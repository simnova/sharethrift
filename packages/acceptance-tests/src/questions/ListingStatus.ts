import { Question, type Actor, notes } from '@serenity-js/core';

/**
 * ListingStatus is a Question that retrieves the status of a listing.
 *
 * Questions are used in assertions to query the current state.
 * They work across all testing levels (domain/graphql/dom).
 */
export class ListingStatus extends Question<string> {
	constructor() {
		super('listing status');
	}

	/**
	 * Retrieve the listing status based on the current testing level
	 */
	async answeredBy(actor: Actor): Promise<string> {
		return actor.answer(notes<{ lastListingStatus: string }>().get('lastListingStatus'));
	}

	/**
	 * Factory method to create this question for an actor
	 */
	static of(): ListingStatus {
		return new ListingStatus();
	}

	toString(): string {
		return 'the listing status';
	}
}
