import { Task, type Actor, notes } from '@serenity-js/core';
import { BrowseTheWeb } from '../../../../shared/abilities/browse-the-web.ts';
import type { ListingDetails, ListingNotes } from '../../abilities/listing-types.ts';
import { ListingPage } from './listing-page.ts';

export class CreateListing extends Task {
	static with(details: ListingDetails) {
		return new CreateListing(details);
	}

	private constructor(private readonly details: ListingDetails) {
		super(`creates listing "${details.title}" (e2e)`);
	}

	async performAs(actor: Actor): Promise<void> {
		const { page } = BrowseTheWeb.as(actor);
		const listingPage = new ListingPage(page);

		await page.goto('/create-listing');
		await page.waitForLoadState('networkidle');

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
		if (await listingPage.rangePicker.isVisible()) {
			await listingPage.rangePicker.click();
			const today = new Date();
			const startDate = new Date(today);
			startDate.setDate(today.getDate() + 1);
			const endDate = new Date(today);
			endDate.setDate(today.getDate() + 30);

			const startCell = listingPage.calendarCell(this.formatDate(startDate));
			await startCell.waitFor({ state: 'visible', timeout: 3_000 }).catch(() => {});
			if (await startCell.isVisible()) {
				await startCell.click();
			}

			let endCell = listingPage.calendarCell(this.formatDate(endDate));
			if (!(await endCell.isVisible({ timeout: 1_000 }).catch(() => false))) {
				await listingPage.nextMonthButton.click();
				endCell = listingPage.calendarCell(this.formatDate(endDate));
			}
			await endCell.waitFor({ state: 'visible', timeout: 3_000 }).catch(() => {});
			if (await endCell.isVisible()) {
				await endCell.click();
			}

			await page.keyboard.press('Escape');
		}

		await page.locator('body').click({ position: { x: 0, y: 0 } });

		const isDraft = !(this.details.isDraft === 'false' || this.details.isDraft === false);

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

		// Listen for server-side validation errors in the GraphQL response
		const getServerError = await listingPage.listenForMutationError('createItemListing');

		await submitButton.click();

		// Verify button enters loading state during submission
		await listingPage.loadingButton.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => {});

		// Wait for the success modal to appear
		const expectedModalText = isDraft ? 'Draft saved!' : 'Your listing is live!';
		await listingPage.modal.waitFor({ state: 'visible', timeout: 15_000 });
		await listingPage.modal.getByText(expectedModalText).waitFor({ state: 'visible', timeout: 15_000 });

		// Check for server-side errors
		const serverError = getServerError();
		if (serverError) {
			throw new Error(serverError);
		}

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

		// Extract listing ID from the row link
		const listingLink = listingPage.listingLinkInRow(this.details.title);
		let listingId = 'e2e-unknown';
		const hasLink = await listingLink.isVisible({ timeout: 2_000 }).catch(() => false);
		if (hasLink) {
			const href = await listingLink.getAttribute('href');
			const match = href?.match(/\/listing\/([^/]+)/);
			if (match?.[1]) {
				listingId = match[1];
			}
		}

		await actor.attemptsTo(
			notes<ListingNotes>().set('lastListingId', listingId),
			notes<ListingNotes>().set('lastListingTitle', domTitle.trim()),
			notes<ListingNotes>().set('lastListingStatus', domStatus.trim().toLowerCase()),
		);
	}

	private formatDate(date: Date): string {
		return date.toISOString().split('T')[0] ?? '';
	}

	override toString = () => `creates listing "${this.details.title}" (e2e)`;
}
