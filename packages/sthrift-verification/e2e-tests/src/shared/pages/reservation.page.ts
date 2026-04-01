import type { Page } from '@playwright/test';
import { DateRangePicker } from './components/date-range-picker.component.ts';

/**
 * Page object for the reservation request flow on the listing detail page.
 */
export class ReservationPage {
	readonly datePicker: DateRangePicker;

	constructor(private readonly page: Page) {
		this.datePicker = new DateRangePicker(page);
	}

	get overlapErrorMessage() {
		return this.page.locator('div').filter({ hasText: /overlaps with existing reservations/i }).first();
	}

	get reserveButton() { return this.page.getByRole('button', { name: /Reserve/i }); }
	get cancelRequestButton() { return this.page.getByRole('button', { name: /Cancel Request/i }); }
	get loadingIcon() { return this.page.locator('.anticon-loading').first(); }
}
