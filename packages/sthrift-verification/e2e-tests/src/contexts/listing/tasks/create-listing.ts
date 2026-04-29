import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { type Actor, Task, notes } from '@serenity-js/core';

import { BrowseTheWeb } from '../../../shared/abilities/browse-the-web.ts';
import {
	type E2EListingPage,
	ListingPage,
} from '@sthrift-verification/verification-shared/pages';
import { PlaywrightPageAdapter } from '@sthrift-verification/verification-shared/pages/playwright';
import type { ListingDetails, ListingNotes } from '../types.ts';

const TEST_IMAGE_PATH = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'../../../shared/fixtures/test-image.png',
);

export class CreateListing extends Task {
	static with(details: ListingDetails) {
		return new CreateListing(details);
	}

	private constructor(private readonly details: ListingDetails) {
		super(`creates listing "${details.title}" (e2e)`);
	}

	async performAs(actor: Actor): Promise<void> {
		const { page } = BrowseTheWeb.withActor(actor);
		const listingPage: E2EListingPage = new ListingPage(
			new PlaywrightPageAdapter(page),
		);

		await page.goto('/create-listing', { waitUntil: 'domcontentloaded' });
		await page.waitForURL('**/create-listing', { timeout: 15_000, waitUntil: 'commit' });
		await this.ensureCreateListingFormReady(page, listingPage);

		await listingPage.fillForm({
			title: this.details.title,
			description: this.details.description,
			category: this.details.category,
			location: this.details.location,
		});

		// Fill sharing period using the Ant Design date picker
		const rangePickerVisible = await page.locator('.ant-picker-range').isVisible();
		if (rangePickerVisible) {
			const today = new Date();
			const startDate = new Date(today);
			startDate.setDate(today.getDate() + 1);
			const endDate = new Date(today);
			endDate.setDate(today.getDate() + 30);

			await page.locator('.ant-picker-range').click();
			const startStr = startDate.toISOString().split('T')[0] ?? '';
			const endStr = endDate.toISOString().split('T')[0] ?? '';
			await page.locator(`td[title="${startStr}"]`).first().click();
			// Navigate to next month if end date not visible
			const endCell = page.locator(`td[title="${endStr}"]`).first();
			if (!(await endCell.isVisible({ timeout: 1_000 }).catch(() => false))) {
				await page.locator('.ant-picker-header-next-btn').last().click();
			}
			await endCell.waitFor({ state: 'visible', timeout: 3_000 });
			await endCell.click();
			await page.keyboard.press('Escape');
		}

		await page.locator('body').click({ position: { x: 0, y: 0 } });

		const isDraft = !(this.details.isDraft === 'false' || this.details.isDraft === false);

		// Upload a test image when publishing (required for non-draft listings)
		if (!isDraft) {
			await page.locator('input[type="file"][accept="image/*"]').first().setInputFiles(TEST_IMAGE_PATH);
			await page.locator('img[src^="data:image"]').first().waitFor({ state: 'visible', timeout: 5_000 });
		}

		const hasMissingRequired = !this.details.title;

		if (hasMissingRequired) {
			await listingPage.clickPublish();

			const validationError = await listingPage.firstValidationError
				.textContent()
				.catch(() => null);

			if (validationError) {
				throw new Error(validationError);
			}

			throw new Error('Required fields are missing');
		}

		// Click the appropriate submit button
		const submitButton = isDraft ? listingPage.saveDraftButton : listingPage.publishButton;

		// Intercept the GraphQL mutation response to capture listing ID and errors
		const getMutationResult = await this.listenForMutationResponse(page, 'createItemListing');

		await submitButton.click();

		// Verify button enters loading state during submission
		await listingPage.loadingButton.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => {
			// Button may not show loading state if submission is very fast
		});

		// Wait for the success modal to appear
		const expectedModalText = isDraft ? 'Draft saved!' : 'Your listing is live!';
		const submissionOutcome = await page.waitForFunction(
			(successText) => {
				const modal = document.querySelector('.ant-modal');
				if (modal?.textContent?.includes(String(successText))) {
					return { kind: 'success' };
				}

				const errorEl = document.querySelector('.ant-form-item-explain-error, .ant-message-error, [role="alert"]');
				const errorText = errorEl?.textContent?.trim();
				if (errorText) {
					return { kind: 'error', message: errorText };
				}

				return null;
			},
			expectedModalText,
			{ timeout: 15_000 },
		).then((handle) => handle.jsonValue() as Promise<{ kind: 'success' } | { kind: 'error'; message: string }>);

		// Check for server-side errors
		const mutationResult = getMutationResult();
		if (submissionOutcome.kind === 'error') {
			throw new Error(submissionOutcome.message);
		}

		if (mutationResult.error) {
			throw new Error(mutationResult.error);
		}

		await listingPage.modal.waitFor({ state: 'visible', timeout: 5_000 });

		const modalContent = await listingPage.modal.textContent();
		if (!modalContent?.includes(expectedModalText)) {
			throw new Error(
				`Expected success modal with "${expectedModalText}" but got: "${modalContent}"`,
			);
		}

		// Navigate via modal button (real user interaction)
		const viewButton = isDraft ? listingPage.viewDraftButton : listingPage.viewListingButton;
		await viewButton.click();

		// Verify actual page navigation occurred
		await page.waitForURL('**/my-listings**', { timeout: 10_000 });
		await page.waitForLoadState('domcontentloaded');

		// Read listing title from the table DOM
		const listingTitleCell = listingPage.listingTitleCell(this.details.title);
		await listingTitleCell.waitFor({ state: 'visible', timeout: 10_000 });
		const domTitle = await listingTitleCell.textContent();

		if (!domTitle?.trim()) {
			throw new Error(
				`Listing title "${this.details.title}" not found on /my-listings page`,
			);
		}

		// Read listing status from the table row
		const statusTag = await listingPage.statusTagInRow(this.details.title);
		if (!statusTag) {
			throw new Error(
				`Listing status not found in table for "${this.details.title}"`,
			);
		}
		await statusTag.waitFor({ state: 'visible', timeout: 5_000 });
		const domStatus = await statusTag.textContent();

		if (!domStatus?.trim()) {
			throw new Error(
				`Listing status not found in table for "${this.details.title}"`,
			);
		}

		// Extract listing ID from the GraphQL mutation response
		const listing = mutationResult.data?.['listing'] as
			| Record<string, unknown>
			| undefined;
		const listingId = String(listing?.['id'] ?? 'e2e-unknown');

		await actor.attemptsTo(
			notes<ListingNotes>().set('lastListingId', listingId),
			notes<ListingNotes>().set('lastListingTitle', domTitle.trim()),
			notes<ListingNotes>().set('lastListingStatus', domStatus.trim().toLowerCase()),
		);
	}

	private async ensureCreateListingFormReady(
		page: BrowseTheWeb['page'],
		listingPage: E2EListingPage,
	): Promise<void> {
		try {
			await listingPage.titleInput.waitFor({ state: 'visible', timeout: 15_000 });
		} catch {
			await page.goto('/', { waitUntil: 'domcontentloaded' });
			await page.waitForLoadState('networkidle').catch(() => undefined);
			await listingPage.homeCreateListingButton.waitFor({ state: 'visible', timeout: 15_000 });
			await listingPage.homeCreateListingButton.click();
			await page.waitForURL('**/create-listing', { timeout: 15_000, waitUntil: 'commit' });
			try {
				await listingPage.titleInput.waitFor({ state: 'visible', timeout: 15_000 });
			} catch {
				throw new Error(`Create listing form did not render. Current URL: ${page.url()}`);
			}
		}

		await page.waitForLoadState('networkidle').catch(() => {
			// Network idle may not occur if page is very responsive
		});
	}

	private listenForMutationResponse(page: BrowseTheWeb['page'], mutationName: string): Promise<() => { error: string | undefined; data: Record<string, unknown> | undefined }> {
		let serverError: string | undefined;
		let mutationData: Record<string, unknown> | undefined;

		const listener = async (resp: import('@playwright/test').Response) => {
			if (resp.request().method() !== 'POST') return;
			try {
				const postData = resp.request().postData();
				if (!postData?.toLowerCase().includes(mutationName.toLowerCase())) return;
				const json = await resp.json();
				const entries = Array.isArray(json) ? json : [json];
				for (const entry of entries) {
					const result = entry?.data?.[mutationName];
					if (result) {
						mutationData = result as Record<string, unknown>;
						const status = result['status'] as
							| Record<string, unknown>
							| undefined;
						if (status?.['success'] === false) {
							serverError =
								(typeof status['errorMessage'] === 'string'
									? status['errorMessage']
									: undefined) ?? `${mutationName} failed`;
						}
					}
				}
			} catch { /* non-JSON response */ }
		};

		page.on('response', listener);
		return Promise.resolve(() => {
			page.off('response', listener);
			return { error: serverError, data: mutationData };
		});
	}

	override toString = () => `creates listing "${this.details.title}" (e2e)`;
}
