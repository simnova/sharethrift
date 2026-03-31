import type { Page } from '@playwright/test';

// Centralised locators for the reservation request flow.
export class ReservationPage {
	constructor(private readonly page: Page) {}

	// --- Listing detail page ---
	get rangePicker() { return this.page.locator('.ant-picker-range'); }

	get isRangePickerDisabled() {
		return this.rangePicker.evaluate((el) => el.classList.contains('ant-picker-disabled'));
	}

	calendarCell(dateStr: string) { return this.page.locator(`td[title="${dateStr}"]`).first(); }

	async isCalendarCellDisabled(dateStr: string) {
		return this.calendarCell(dateStr).evaluate(
			(el) => el.classList.contains('ant-picker-cell-disabled'),
		);
	}

	get overlapErrorMessage() {
		return this.page.locator('div').filter({ hasText: /overlaps with existing reservations/i }).first();
	}

	get reserveButton() { return this.page.getByRole('button', { name: /Reserve/i }); }
	get cancelRequestButton() { return this.page.getByRole('button', { name: /Cancel Request/i }); }
	get loadingIcon() { return this.page.locator('.anticon-loading').first(); }
	get disabledRangePicker() { return this.page.locator('.ant-picker-range.ant-picker-disabled'); }
}
