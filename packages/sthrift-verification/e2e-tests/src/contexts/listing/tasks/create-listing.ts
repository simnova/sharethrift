import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { type Actor, Task, notes } from '@serenity-js/core';

import { BrowseTheWeb } from '../../../shared/abilities/browse-the-web.ts';
import { ListingPage } from '../../../shared/pages/listing.page.ts';
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
		const listingPage = new ListingPage(page);

		await page.goto('/create-listing', { waitUntil: 'domcontentloaded' });
		await page.waitForURL('**/create-listing', { timeout: 15_000, waitUntil: 'commit' });
		await this.ensureCreateListingFormReady(page, listingPage);

		if (this.details.title) {
			await listingPage.titleInput.fill(this.details.title);
		}

		if (this.details.description) {
			await listingPage.descriptionInput.fill(this.details.description);
		}

		if (this.details.category) {
			await listingPage.categorySelect.click();
			await listingPage.categoryOption(this.details.category).click();
		}

		if (this.details.location) {
			await listingPage.locationInput.fill(this.details.location);
		}

		// Fill sharing period
		if (await listingPage.datePicker.rangePicker.isVisible()) {
			const today = new Date();
			const startDate = new Date(today);
			startDate.setDate(today.getDate() + 1);
			const endDate = new Date(today);
			endDate.setDate(today.getDate() + 30);

			await listingPage.datePicker.selectDateRange(startDate, endDate);
			await page.keyboard.press('Escape');
		}

		await page.locator('body').click({ position: { x: 0, y: 0 } });

		const isDraft = !(this.details.isDraft === 'false' || this.details.isDraft === false);

		// Upload a test image when publishing (required for non-draft listings)
		if (!isDraft) {
			await listingPage.imageUploadInput.setInputFiles(TEST_IMAGE_PATH);
			// Wait for the image preview to render
			await page.locator('img[src^="data:image"]').first().waitFor({ state: 'visible', timeout: 5_000 });
		}

		const hasMissingRequired = !this.details.title;

		if (hasMissingRequired) {
			await listingPage.publishButton.click();

			const validationError = await listingPage.firstValidationError
				.textContent({ timeout: 3_000 })
				.catch(() => null);

			if (validationError) {
				throw new Error(validationError);
			}

			throw new Error('Required fields are missing');
		}

		// Click the appropriate submit button
		const submitButton = isDraft ? listingPage.saveDraftButton : listingPage.publishButton;

		// Intercept the GraphQL mutation response to capture listing ID and errors
		const getMutationResult = await listingPage.listenForMutationResponse('createItemListing');

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
		await listingPage.modal.getByText(expectedModalText).waitFor({ state: 'visible', timeout: 5_000 });

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
		await page.waitForLoadState('networkidle');

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
		const statusTag = listingPage.statusTagInRow(this.details.title);
		await statusTag.waitFor({ state: 'visible', timeout: 5_000 });
		const domStatus = await statusTag.textContent();

		if (!domStatus?.trim()) {
			throw new Error(
				`Listing status not found in table for "${this.details.title}"`,
			);
		}

		// Extract listing ID from the GraphQL mutation response
		const listing = mutationResult.data?.listing as Record<string, unknown> | undefined;
		const listingId = String(listing?.id ?? 'e2e-unknown');

		await actor.attemptsTo(
			notes<ListingNotes>().set('lastListingId', listingId),
			notes<ListingNotes>().set('lastListingTitle', domTitle.trim()),
			notes<ListingNotes>().set('lastListingStatus', domStatus.trim().toLowerCase()),
		);
	}

	private async ensureCreateListingFormReady(page: BrowseTheWeb['page'], listingPage: ListingPage): Promise<void> {
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

	override toString = () => `creates listing "${this.details.title}" (e2e)`;
}
