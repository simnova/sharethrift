import { Question, type Actor, notes } from '@serenity-js/core';

/**
 * ListingState question - gets the state/status of a listing.
 *
 * This works across all levels by reading from the shared notes.
 */
export class ListingStateQuestion extends Question<string> {
	constructor() {
		super('listing state');
	}

	async answeredBy(actor: Actor): Promise<string> {
		return actor.answer(notes<{ lastListingState: string }>().get('lastListingState'));
	}

	static of() {
		return new ListingStateQuestion();
	}
}

export const ListingState = {
	of: () => new ListingStateQuestion(),
};
