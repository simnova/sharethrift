import { By, PageElement } from '@serenity-js/web';

/**
 * Page Object for My Listings page.
 * 
 * Following Serenity/JS best practices:
 * - Page Objects define UI elements (targets)
 * - Dynamic elements use factory methods
 */
export class MyListingsPage {
	static readonly url = '/my-listings';

	/**
	 * Get the activate button for a specific listing by title.
	 */
	static activateButtonFor(title: string): PageElement {
		return PageElement.located(
			By.xpath(`//tr[contains(., "${title}")]//button[contains(text(), "Activate")]`),
		).describedAs(`activate button for listing "${title}"`);
	}
}
