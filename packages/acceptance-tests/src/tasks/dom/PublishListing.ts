import { Task, type Actor, notes } from '@serenity-js/core';
import { Navigate, Click } from '@serenity-js/web';
import { MyListingsPage } from '../../ui/MyListingsPage.js';

interface ListingNotes {
	lastListingId?: string;
	lastListingTitle: string;
	lastListingStatus: string;
}

/**
 * PublishListing task for DOM level.
 *
 * Following Aslak Hellesøy's Screenplay Pattern:
 * - HIGH-LEVEL task describing user intent
 * - Uses Page Objects for element location
 * - Simple and focused on the business goal
 */
export class PublishListing extends Task {
	static justCreated(): PublishListing {
		return new PublishListing(undefined);
	}

	static withId(id: string): PublishListing {
		return new PublishListing(id);
	}

	private constructor(private readonly listingId?: string) {
		super(`#actor publishes ${listingId ? `listing ${listingId}` : 'the just-created listing'} via UI`);
	}

	async performAs(actor: Actor): Promise<void> {
		// Get listing details from notes
		const id = this.listingId || await actor.answer(notes<ListingNotes>().get('lastListingId'));
		const title = await actor.answer(notes<ListingNotes>().get('lastListingTitle'));

		if (!id && !title) {
			throw new Error('Cannot publish listing: No listing ID or title available');
		}

		// Navigate to my listings page
		await actor.attemptsTo(Navigate.to(MyListingsPage.url));

		// Click activate button for the listing (using title as identifier)
		await actor.attemptsTo(Click.on(MyListingsPage.activateButtonFor(title)));

		// Update status in notes
		await actor.attemptsTo(notes<ListingNotes>().set('lastListingStatus', 'published'));
	}
}