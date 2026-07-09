import type { PageAdapter } from '@cellix/serenity-framework/pages';
export class ReservationsPage {
	constructor(private readonly adapter: PageAdapter) {}
	get heading() {
		return this.adapter.getByRole('heading', { name: 'My Reservations' });
	}
	get activeTab() {
		return this.adapter.getByRole('tab', { name: 'Active Reservations' });
	}
	get historyTab() {
		return this.adapter.getByRole('tab', { name: 'Reservation History' });
	}
	async viewHistory() {
		await this.historyTab.click();
	}
}
