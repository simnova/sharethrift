import { PlaywrightPageAdapter } from '@cellix/serenity-framework/pages/playwright';
import { BrowseTheWeb } from '@cellix/serenity-framework/serenity/browser';
import { type Actor, Task } from '@serenity-js/core';
import { HomePage } from '../pages/home.page.ts';

export class BrowseListings extends Task {
	static onTheHomePage() {
		return new BrowseListings('browses listings on the home page', 'visit');
	}
	static matching(query: string) {
		return new BrowseListings(`searches listings for "${query}"`, 'search', query);
	}
	static open(title: string) {
		return new BrowseListings(`opens listing "${title}"`, 'open', title);
	}
	static inCategory(category: string) {
		return new BrowseListings(`filters listings by "${category}"`, 'category', category);
	}

	private constructor(
		description: string,
		private readonly action: 'visit' | 'search' | 'open' | 'category',
		private readonly value?: string,
	) {
		super(description);
	}

	async performAs(actor: Actor): Promise<void> {
		const { page } = BrowseTheWeb.withActor(actor);
		const home = new HomePage(new PlaywrightPageAdapter(page));
		if (this.action === 'visit') await home.visit();
		if (this.action === 'search') await home.searchFor(this.value ?? '');
		if (this.action === 'open') await home.openListing(this.value ?? '');
		if (this.action === 'category') await home.filterByCategory(this.value ?? '');
	}
}
