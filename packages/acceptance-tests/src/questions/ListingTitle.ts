import { Question, type Actor, notes } from '@serenity-js/core';

/**
 * ListingTitle question - gets the title of the last created listing.
 *
 * The title is retrieved from actor notes set during task execution.
 */
export class ListingTitle extends Question<string> {
	constructor() {
		super('listing title');
	}

	/**
	 * Get the listing title
	 */
	static displayed() {
		return new ListingTitle();
	}

	async answeredBy(actor: Actor): Promise<string> {
		return actor.answer(notes<{ lastListingTitle: string }>().get('lastListingTitle'));
	}

	toString = () => 'listing title';
}
