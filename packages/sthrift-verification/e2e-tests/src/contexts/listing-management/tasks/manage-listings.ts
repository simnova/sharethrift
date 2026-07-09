import { PlaywrightPageAdapter } from '@cellix/serenity-framework/pages/playwright';
import { BrowseTheWeb } from '@cellix/serenity-framework/serenity/browser';
import { type Actor, Task } from '@serenity-js/core';
import { NavigationPage } from '../../../shared/pages/navigation.page.ts';
import { ListingManagementPage } from '../pages/listing-management.page.ts';

export class OpenListingDashboard extends Task {
	static fromNavigation() {
		return new OpenListingDashboard();
	}
	private constructor() {
		super('opens My Listings from the navigation');
	}
	async performAs(actor: Actor) {
		const { page } = BrowseTheWeb.withActor(actor);
		await new NavigationPage(new PlaywrightPageAdapter(page)).open('My Listings');
	}
}
export class ViewIncomingRequests extends Task {
	static fromDashboard() {
		return new ViewIncomingRequests();
	}
	private constructor() {
		super('views incoming listing requests');
	}
	async performAs(actor: Actor) {
		const { page } = BrowseTheWeb.withActor(actor);
		await new ListingManagementPage(new PlaywrightPageAdapter(page)).viewRequests();
	}
}
export class StartCreatingListing extends Task {
	static fromNavigation() {
		return new StartCreatingListing();
	}
	private constructor() {
		super('starts creating a listing');
	}
	async performAs(actor: Actor) {
		const { page } = BrowseTheWeb.withActor(actor);
		const adapter = new PlaywrightPageAdapter(page);
		await adapter.goto('/', { waitUntil: 'domcontentloaded' });
		await adapter.getByRole('button', { name: /Create a Listing/i }).click();
	}
}
