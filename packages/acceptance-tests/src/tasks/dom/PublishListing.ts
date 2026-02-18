import { Task, type Actor, notes } from '@serenity-js/core';
import { Navigate, Click } from '@serenity-js/web';
import { PageElement, By } from '@serenity-js/web';
import { Wait } from '@serenity-js/core';

interface ListingNotes {
	lastListingId?: string;
	lastListingTitle: string;
	lastListingStatus: string;
}

/**
 * PublishListing task for DOM level.
 *
 * Uses browser automation to click the Publish button on a listing.
 */
export class PublishListing extends Task {
	static justCreated() {
		return new PublishListing(undefined);
	}

	static withId(id: string) {
		return new PublishListing(id);
	}

		private constructor(private readonly listingId?: string) {
		super(listingId ? `publishes listing ${listingId} (DOM)` : 'publishes just created listing (DOM)');
	}

	async performAs(actor: Actor): Promise<void> {
		const id = this.listingId || await actor.answer(notes<ListingNotes>().get('lastListingId'));
		const title = await actor.answer(notes<ListingNotes>().get('lastListingTitle'));

		if (!id && !title) {
			throw new Error('No listing ID or title available');
		}

		console.log(`[DOM] Publishing listing: ${title || id}`);

		await actor.attemptsTo(
			Navigate.to('http://localhost:3000/my-listings'),

			// Find and click the Activate button for this listing
			Click.on(
				PageElement.located(
					By.xpath(`//tr[contains(., \"${title}\")]//button[contains(text(), \"Activate\")]`),
				).describedAs(`activate button for ${title}`),
			),

			// Wait for success confirmation
			Wait.forNextNavigationRequest(),

			// Update state in notes
			notes<ListingNotes>().set('lastListingStatus', 'published'),
		);
	}

	toString = () => `publishes listing ${this.listingId || '(just created)'} (DOM)`;
}