import type { Page } from '@playwright/test';

/**
 * Reusable component for Ant Design DatePicker / RangePicker interactions.
 * Used by both ListingPage and ReservationPage.
 */
export class DateRangePicker {
	constructor(private readonly page: Page) {}

	get rangePicker() { return this.page.locator('.ant-picker-range'); }
	get nextMonthButton() { return this.page.locator('.ant-picker-header-next-btn').last(); }

	calendarCell(dateStr: string) { return this.page.locator(`td[title="${dateStr}"]`).first(); }

	get isDisabled() {
		return this.rangePicker.evaluate((el) => el.classList.contains('ant-picker-disabled'));
	}

	get disabledPicker() { return this.page.locator('.ant-picker-range.ant-picker-disabled'); }

	isCalendarCellDisabled(dateStr: string) {
		return this.calendarCell(dateStr).evaluate(
			(el) => el.classList.contains('ant-picker-cell-disabled'),
		);
	}

	async selectDateRange(startDate: Date, endDate: Date): Promise<void> {
		await this.rangePicker.click();

		const startStr = formatDate(startDate);
		const endStr = formatDate(endDate);

		const startCell = this.calendarCell(startStr);
		await startCell.waitFor({ state: 'visible', timeout: 3_000 }).catch(() => { /* cell not available */ });
		if (await startCell.isVisible()) {
			await startCell.click();
		}

		let endCell = this.calendarCell(endStr);
		if (!(await endCell.isVisible({ timeout: 1_000 }).catch(() => false))) {
			await this.nextMonthButton.click();
			endCell = this.calendarCell(endStr);
		}
		await endCell.waitFor({ state: 'visible', timeout: 3_000 }).catch(() => { /* cell not available */ });
		if (await endCell.isVisible()) {
			await endCell.click();
		}
	}
}

export function formatDate(date: Date): string {
	return date.toISOString().split('T')[0] ?? '';
}
