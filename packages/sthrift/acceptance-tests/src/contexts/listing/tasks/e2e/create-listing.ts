import { Task, type Actor, notes } from '@serenity-js/core';
import { BrowseTheWeb } from '../../../../shared/abilities/browse-the-web.ts';
import type { ListingDetails, ListingNotes } from '../../abilities/listing-types.ts';

export class CreateListing extends Task {
	static with(details: ListingDetails) {
		return new CreateListing(details);
	}

	private constructor(private readonly details: ListingDetails) {
		super(`creates listing "${details.title}" (e2e)`);
	}

	async performAs(actor: Actor): Promise<void> {
		const { page } = BrowseTheWeb.as(actor);

		// Navigate and fill form
		await page.goto('/create-listing');
		await page.waitForLoadState('networkidle');

		if (this.details.title) {
			await page.getByPlaceholder('Enter listing title').fill(this.details.title);
		}

		if (this.details.description) {
			await page.getByPlaceholder('Describe your item and sharing terms').fill(this.details.description);
		}

		if (this.details.category) {
			// Open antd Select dropdown and click option
			const select = page.locator('.ant-select').first();
			await select.click();
			await page.locator(`.ant-select-item[title="${this.details.category}"]`).click();
		}

		if (this.details.location) {
			await page.getByPlaceholder('Enter location').fill(this.details.location);
		}

		// Fill sharing period dates
		const rangePicker = page.locator('.ant-picker-range');
		if (await rangePicker.isVisible()) {
			await rangePicker.click();
			const today = new Date();
			const startDate = new Date(today);
			startDate.setDate(today.getDate() + 1);
			const endDate = new Date(today);
			endDate.setDate(today.getDate() + 30);

			const startCell = page.locator(`td[title="${this.formatDate(startDate)}"]`).first();
			await startCell.waitFor({ state: 'visible', timeout: 3_000 }).catch(() => {});
			if (await startCell.isVisible()) {
				await startCell.click();
			}

			// Navigate forward if end date in next month
			let endCell = page.locator(`td[title="${this.formatDate(endDate)}"]`).first();
			if (!(await endCell.isVisible({ timeout: 1_000 }).catch(() => false))) {
				await page.locator('.ant-picker-header-next-btn').last().click();
				endCell = page.locator(`td[title="${this.formatDate(endDate)}"]`).first();
			}
			await endCell.waitFor({ state: 'visible', timeout: 3_000 }).catch(() => {});
			if (await endCell.isVisible()) {
				await endCell.click();
			}

			// Close date picker
			await page.keyboard.press('Escape');
		}

		// Clear overlays
		await page.locator('body').click({ position: { x: 0, y: 0 } });

		const isDraft = !(this.details.isDraft === 'false' || this.details.isDraft === false);

		// Check for missing required fields
		const hasMissingRequired = !this.details.title;

		if (hasMissingRequired) {
			await page.getByRole('button', { name: /Publish Listing/i }).click();

			const validationError = await page.locator('.ant-form-item-explain-error').first()
				.textContent({ timeout: 3_000 })
				.catch(() => null);

			if (validationError) {
				throw new Error(validationError);
			}

			throw new Error('Required fields are missing');
		}

		// Intercept mutation response
		let mutationResponse: { success: boolean; errorMessage?: string; listing?: { id: string; state: string } } | undefined;
		let mutationError: string | undefined;

		const mutationResponsePromise = new Promise<void>((resolve) => {
			const handler = async (resp: import('@playwright/test').Response) => {
				if (resp.request().method() !== 'POST') return;
				try {
					const postData = resp.request().postData();
					// Match both query text and operation name (covers persisted queries)
					if (!postData?.toLowerCase().includes('createitemlisting')) return;

					const json = await resp.json();
					// Handle batched and single responses
					const responses = Array.isArray(json) ? json : [json];
					for (const entry of responses) {
						if (entry?.data?.createItemListing) {
							const result = entry.data.createItemListing;
							mutationResponse = {
								success: result.status?.success ?? true,
								errorMessage: result.status?.errorMessage,
								listing: result.listing,
							};
							page.off('response', handler);
							resolve();
							return;
						}
						if (entry?.errors?.length) {
							// Skip PersistedQueryNotFound (Apollo retries with full query)
							const isPersistedQueryRetry = entry.errors.some(
								(e: { message: string }) => e.message === 'PersistedQueryNotFound',
							);
							if (isPersistedQueryRetry) return;

							mutationError = entry.errors.map((e: { message: string }) => e.message).join('; ');
							page.off('response', handler);
							resolve();
							return;
						}
					}
				} catch {
					// Ignore non-JSON responses
				}
			};
			page.on('response', handler);

			// 15s timeout
			setTimeout(() => {
				page.off('response', handler);
				resolve();
			}, 15_000);
		});

		// Click the appropriate submit button
		const buttonText = isDraft ? /Save as Draft/i : /Publish Listing/i;
		await page.getByRole('button', { name: buttonText }).click();

		// Wait for the mutation response
		await mutationResponsePromise;

		if (mutationError) {
			throw new Error(mutationError);
		}

		if (!mutationResponse) {
			throw new Error('No createItemListing response received');
		}

		if (!mutationResponse.success) {
			throw new Error(mutationResponse.errorMessage ?? 'Listing creation failed');
		}

		const listing = mutationResponse.listing;
		const listingId = listing?.id ?? 'e2e-unknown';

		// Store listing ID for subsequent steps
		await actor.attemptsTo(
			notes<ListingNotes>().set('lastListingId', listingId),
		);

		// Verify success modal
		const expectedModalText = isDraft ? 'Draft saved!' : 'Your listing is live!';
		const modal = page.locator('.ant-modal');
		await modal.waitFor({ state: 'visible', timeout: 10_000 });

		const modalContent = await modal.textContent();
		if (!modalContent?.includes(expectedModalText)) {
			throw new Error(
				`Expected success modal with "${expectedModalText}" but got: "${modalContent}"`,
			);
		}
		const domStatus = isDraft ? 'draft' : 'published';

		// Verify listing appears in /my-listings
		await page.goto('/my-listings');
		await page.waitForLoadState('networkidle');

		const listingTitleCell = page.getByRole('table').locator('span').filter({ hasText: this.details.title });
		await listingTitleCell.first().waitFor({ state: 'visible', timeout: 10_000 });
		const domTitle = await listingTitleCell.first().textContent();

		if (!domTitle?.trim()) {
			throw new Error(
				`Listing title "${this.details.title}" not found on /my-listings page`,
			);
		}

		await actor.attemptsTo(
			notes<ListingNotes>().set('lastListingTitle', domTitle.trim()),
			notes<ListingNotes>().set('lastListingStatus', domStatus),
		);
	}

	private formatDate(date: Date): string {
		return date.toISOString().split('T')[0] ?? '';
	}

	override toString = () => `creates listing "${this.details.title}" (e2e)`;
}
