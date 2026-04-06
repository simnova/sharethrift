import type { ElementHandle, PageAdapter } from './page-adapter.ts';

/**
 * Universal ListingPage — works with both jsdom (acceptance UI tests)
 * and Playwright (e2e tests) via the PageAdapter abstraction.
 */
export class ListingPage {
	constructor(private readonly adapter: PageAdapter) {}

	// --- Create Listing form ---
	get titleInput(): ElementHandle {
		return this.adapter.getByPlaceholder('Enter listing title');
	}

	get descriptionInput(): ElementHandle {
		return this.adapter.getByPlaceholder(
			'Describe your item and sharing terms',
		);
	}

	get locationInput(): ElementHandle {
		return this.adapter.getByPlaceholder('Enter location');
	}

	get categorySelect(): ElementHandle {
		return this.adapter.getByRole('combobox');
	}

	categoryOption(name: string): ElementHandle {
		return this.adapter.locator(`[title="${name}"]`);
	}

	get imageUploadInput(): ElementHandle {
		return this.adapter.locator('input[type="file"][accept="image/*"]');
	}

	get homeCreateListingButton(): ElementHandle {
		return this.adapter.getByRole('button', { name: /Create a Listing/i });
	}

	get saveDraftButton(): ElementHandle {
		return this.adapter.getByRole('button', { name: /Save as Draft/i });
	}

	get publishButton(): ElementHandle {
		return this.adapter.getByRole('button', { name: /Publish Listing/i });
	}

	get cancelButton(): ElementHandle {
		return this.adapter.getByRole('button', { name: /Cancel/i });
	}

	get firstValidationError(): ElementHandle {
		return this.adapter.locator('.ant-form-item-explain-error');
	}

	get errorToast(): ElementHandle {
		return this.adapter.locator('.ant-message-error, [role="alert"]');
	}

	// --- Loading indicator ---
	get loadingButton(): ElementHandle {
		return this.adapter.locator('.ant-btn-loading');
	}

	// --- Success modal ---
	get modal(): ElementHandle {
		return this.adapter.locator('.ant-modal');
	}

	get viewDraftButton(): ElementHandle {
		return this.adapter.getByRole('button', { name: /View Draft/i });
	}

	get viewListingButton(): ElementHandle {
		return this.adapter.getByRole('button', { name: /View Listing/i });
	}

	// --- My Listings table ---
	listingTitleCell(title: string): ElementHandle {
		return this.adapter.getByText(title, { selector: 'table' });
	}

	async statusTagInRow(title: string): Promise<ElementHandle | null> {
		const row = await this.listingRowByTitle(title);
		return row ? row.querySelector('.ant-tag') : null;
	}

	// --- Helper methods ---
	async fillTitle(value: string): Promise<void> {
		await this.titleInput.fill(value);
	}

	async fillDescription(value: string): Promise<void> {
		await this.descriptionInput.fill(value);
	}

	async fillLocation(value: string): Promise<void> {
		await this.locationInput.fill(value);
	}

	async selectCategory(name: string): Promise<void> {
		await this.categorySelect.click();
		await this.categoryOption(name).click();
	}

	async fillForm(data: {
		title?: string;
		description?: string;
		category?: string;
		location?: string;
	}): Promise<void> {
		if (data.title) await this.fillTitle(data.title);
		if (data.description) await this.fillDescription(data.description);
		if (data.location) await this.fillLocation(data.location);
		if (data.category) await this.selectCategory(data.category);
	}

	async clickSaveDraft(): Promise<void> {
		await this.saveDraftButton.click();
	}

	async clickPublish(): Promise<void> {
		await this.publishButton.click();
	}

	private async listingRowByTitle(title: string): Promise<ElementHandle | null> {
		const table = this.adapter.getByRole('table');
		const rows = await table.querySelectorAll('tr');

		for (const row of rows) {
			const text = await row.textContent();
			if (text?.includes(title)) {
				return row;
			}
		}

		return null;
	}
}
