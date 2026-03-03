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
		const title = await actor.answer(notes<{ lastListingTitle: string }>().get('lastListingTitle'));
		if (!title) {
			throw new Error(
				'No listing title found in actor notes. Did the actor create a listing first? ' +
				'Use a When step like "Alice has created a draft listing titled ..."',
			);
		}
		return title;
	}

	toString = () => 'listing title';
}
