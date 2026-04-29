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

	get disabledPicker(): ElementHandle {
		return this.adapter.locator('.ant-picker-range.ant-picker-disabled');
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

	get skeleton(): ElementHandle {
		return this.adapter.locator('.ant-skeleton');
	}

	calendarCell(dateStr: string): ElementHandle {
		return this.adapter.locator(`td[title="${dateStr}"]`);
	}

	async isDisabled(): Promise<boolean> {
		const className = await this.rangePicker.getAttribute('class');
		return className?.includes('ant-picker-disabled') ?? false;
	}

	async isCalendarCellDisabled(dateStr: string): Promise<boolean> {
		const className = await this.calendarCell(dateStr).getAttribute('class');
		return className?.includes('ant-picker-cell-disabled') ?? false;
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

	async selectDateRange(startDate: Date, endDate: Date): Promise<void> {
		await this.openDatePicker();

		const startStr = formatDate(startDate);
		const endStr = formatDate(endDate);

		const startCell = this.calendarCell(startStr);
		await startCell.waitFor({ state: 'visible', timeout: 5_000 });
		await startCell.click();

		let endCell = this.calendarCell(endStr);
		try {
			await endCell.waitFor({ state: 'visible', timeout: 1_000 });
		} catch {
			await this.nextMonthButton.click();
			endCell = this.calendarCell(endStr);
			await endCell.waitFor({ state: 'visible', timeout: 5_000 });
		}

		await endCell.click();
	}
}

export function formatDate(date: Date): string {
	return date.toISOString().split('T')[0] ?? '';
}
