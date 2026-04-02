import type { ElementHandle, PageAdapter } from './page-adapter.ts';

/**
 * Universal ReservationPage — works with both jsdom (acceptance UI tests)
 * and Playwright (e2e tests) via the PageAdapter abstraction.
 */
export class ReservationPage {
	constructor(private readonly adapter: PageAdapter) {}

	get rangePicker(): ElementHandle {
		return this.adapter.locator('.ant-picker-range');
	}

	get reserveButton(): ElementHandle {
		return this.adapter.getByRole('button', { name: /Reserve/i });
	}

	get cancelRequestButton(): ElementHandle {
		return this.adapter.getByRole('button', { name: /Cancel Request/i });
	}

	get loadingIcon(): ElementHandle {
		return this.adapter.locator('.anticon-loading');
	}

	get overlapErrorMessage(): ElementHandle {
		return this.adapter.getByText(/overlaps with existing reservations/i);
	}

	get nextMonthButton(): ElementHandle {
		return this.adapter.locator('.ant-picker-header-next-btn');
	}

	calendarCell(dateStr: string): ElementHandle {
		return this.adapter.locator(`td[title="${dateStr}"]`);
	}

	async clickReserve(): Promise<void> {
		await this.reserveButton.click();
	}

	async clickCancelRequest(): Promise<void> {
		await this.cancelRequestButton.click();
	}

	async openDatePicker(): Promise<void> {
		await this.rangePicker.click();
	}
}

export function formatDate(date: Date): string {
	return date.toISOString().split('T')[0] ?? '';
}
