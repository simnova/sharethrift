import type { Page } from '@playwright/test';
import { DateRangePicker } from './components/date-range-picker.component.ts';

/**
 * Page object for listing-related pages: Create Listing form and My Listings table.
 */
export class ListingPage {
	readonly datePicker: DateRangePicker;

	constructor(private readonly page: Page) {
		this.datePicker = new DateRangePicker(page);
	}

	// --- Create Listing form ---
	get titleInput() { return this.page.getByPlaceholder('Enter listing title'); }
	get descriptionInput() { return this.page.getByPlaceholder('Describe your item and sharing terms'); }
	get locationInput() { return this.page.getByPlaceholder('Enter location'); }
	get categorySelect() { return this.page.getByRole('combobox').first(); }
	categoryOption(name: string) { return this.page.getByTitle(name, { exact: true }); }
	get imageUploadInput() { return this.page.locator('input[type="file"][accept="image/*"]').first(); }
	get homeCreateListingButton() { return this.page.getByRole('button', { name: /Create a Listing/i }).first(); }
	get saveDraftButton() { return this.page.getByRole('button', { name: /Save as Draft/i }); }
	get publishButton() { return this.page.getByRole('button', { name: /Publish Listing/i }); }
	get firstValidationError() { return this.page.locator('.ant-form-item-explain-error').first(); }
	get errorToast() { return this.page.locator('.ant-message-error, [role="alert"]').last(); }

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

	// --- Loading indicator ---
	get loadingButton() { return this.page.locator('.ant-btn-loading').first(); }

	// --- Helper to intercept a GraphQL mutation response ---
	listenForMutationResponse(mutationName: string): Promise<() => { error?: string; data?: Record<string, unknown> }> {
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
						if (result?.status?.success === false) {
							serverError = result.status.errorMessage ?? `${mutationName} failed`;
						}
					}
				}
			} catch { /* non-JSON response */ }
		};

		this.page.on('response', listener);
		return Promise.resolve(() => {
			this.page.off('response', listener);
			return { error: serverError, data: mutationData };
		});
	}
}
