import { Task, type Actor, notes } from '@serenity-js/core';
import { CreateListingAbility } from '../../abilities/CreateListingAbility.js';

interface ListingNotes {
	lastListingId: string;
	lastListingStatus: string;
}

/**
 * PublishListing task for DOMAIN level.
 *
 * Activates a previously created listing using domain logic.
 */
export class PublishListing extends Task {
	static justCreated() {
		return new PublishListing(undefined);
	}

	static withId(id: string) {
		return new PublishListing(id);
	}

		private constructor(private readonly listingId?: string) {
		super(listingId ? `publishes listing ${listingId} (domain)` : 'publishes just created listing (domain)');
	}

	async performAs(actor: Actor): Promise<void> {
		const id = this.listingId || await actor.answer(notes<ListingNotes>().get('lastListingId'));

		if (!id) {
			throw new Error('No listing ID available to publish');
		}

		// TODO: Use ability to publish listing
		console.log(`[DOMAIN] Publishing listing: ${id}`);

		// Update state in notes
		await actor.attemptsTo(
			notes<ListingNotes>().set('lastListingStatus', 'published'),
		);
	}

	toString = () => `publishes listing ${this.listingId || '(just created)'} (domain)`;
}