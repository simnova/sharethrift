import { By, PageElement } from '@serenity-js/web';

/**
 * Page Object for Create Listing page.
 * 
 * Following Serenity/JS best practices:
 * - Page Objects define UI elements (targets)
 * - They don't contain business logic or actions
 * - They're reusable across tasks and interactions
 */
export class CreateListingPage {
	static readonly url = '/create-listing';

	static readonly titleInput = PageElement.located(By.css('input[name="title"]'))
		.describedAs('title input');

	static readonly descriptionTextarea = PageElement.located(By.css('textarea[name="description"]'))
		.describedAs('description textarea');

	static readonly categorySelect = PageElement.located(By.css('select[name="category"]'))
		.describedAs('category select');

	static readonly locationInput = PageElement.located(By.css('input[name="location"]'))
		.describedAs('location input');

	static readonly sharingPeriodStartInput = PageElement.located(By.css('input[name="sharingPeriodStart"]'))
		.describedAs('sharing period start date');

	static readonly sharingPeriodEndInput = PageElement.located(By.css('input[name="sharingPeriodEnd"]'))
		.describedAs('sharing period end date');

	static readonly saveDraftButton = PageElement.located(By.css('button[data-testid="save-draft"]'))
		.describedAs('save as draft button');

	static readonly successMessage = PageElement.located(By.css('.toast-success'))
		.describedAs('success toast message');
}
