import type { PageAdapter } from '@cellix/serenity-framework/pages';

export class ListingManagementPage {
	constructor(private readonly adapter: PageAdapter) {}
	get heading() {
		return this.adapter.getByRole('heading', { name: 'My Listings' });
	}
	get allListingsTab() {
		return this.adapter.getByRole('tab', { name: 'All Listings' });
	}
	get requestsTab() {
		return this.adapter.getByRole('tab', { name: /Requests/ });
	}
	get createListingHeading() {
		return this.adapter.getByText('Create a Listing');
	}
	async viewRequests(): Promise<void> {
		await this.requestsTab.click();
	}
}
