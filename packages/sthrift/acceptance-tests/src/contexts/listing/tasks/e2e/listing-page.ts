import type { Page } from '@playwright/test';

// Centralised locators for listing-related pages.
// Prefer accessible roles and test-ids over Ant Design internal CSS classes.
export class ListingPage {
	constructor(private readonly page: Page) {}

	// --- Create Listing form ---
	get titleInput() { return this.page.getByPlaceholder('Enter listing title'); }
	get descriptionInput() { return this.page.getByPlaceholder('Describe your item and sharing terms'); }
	get locationInput() { return this.page.getByPlaceholder('Enter location'); }
	get categorySelect() { return this.page.getByRole('combobox').first(); }
	categoryOption(name: string) { return this.page.getByTitle(name, { exact: true }); }
	get sharingPeriodPicker() { return this.page.getByRole('textbox', { name: /start date|sharing period/i }).first().locator('..').locator('..'); }
	get rangePicker() { return this.page.locator('.ant-picker-range'); }
	get saveDraftButton() { return this.page.getByRole('button', { name: /Save as Draft/i }); }
	get publishButton() { return this.page.getByRole('button', { name: /Publish Listing/i }); }
	get firstValidationError() { return this.page.locator('.ant-form-item-explain-error').first(); }

	// --- Success modal ---
	get modal() { return this.page.locator('.ant-modal'); }
	get viewDraftButton() { return this.modal.getByRole('button', { name: /View Draft/i }); }
	get viewListingButton() { return this.modal.getByRole('button', { name: /View Listing/i }); }

	// --- My Listings table ---
	listingRowByTitle(title: string) {
		return this.page.getByRole('table').locator('tr').filter({ hasText: title });
	}

	listingTitleCell(title: string) {
		return this.page.getByRole('table').locator('span').filter({ hasText: title }).first();
	}

	statusTagInRow(title: string) {
		return this.listingRowByTitle(title).locator('.ant-tag').first();
	}

	listingLinkInRow(title: string) {
		return this.listingRowByTitle(title).locator('a[href*="/listing/"]').first();
	}

	// --- Calendar helpers ---
	calendarCell(dateStr: string) { return this.page.locator(`td[title="${dateStr}"]`).first(); }
	get nextMonthButton() { return this.page.locator('.ant-picker-header-next-btn').last(); }

	// --- Loading indicator ---
	get loadingButton() { return this.page.locator('.ant-btn-loading').first(); }

	// --- Helper to detect server-side mutation errors in network traffic ---
	async listenForMutationError(mutationName: string): Promise<() => string | undefined> {
		let serverError: string | undefined;

		const listener = async (resp: import('@playwright/test').Response) => {
			if (resp.request().method() !== 'POST') return;
			try {
				const postData = resp.request().postData();
				if (!postData?.toLowerCase().includes(mutationName.toLowerCase())) return;
				const json = await resp.json();
				const entries = Array.isArray(json) ? json : [json];
				for (const entry of entries) {
					const result = entry?.data?.[mutationName];
					if (result?.status?.success === false) {
						serverError = result.status.errorMessage ?? `${mutationName} failed`;
					}
				}
			} catch { /* non-JSON response */ }
		};

		this.page.on('response', listener);
		return () => {
			this.page.off('response', listener);
			return serverError;
		};
	}
}
