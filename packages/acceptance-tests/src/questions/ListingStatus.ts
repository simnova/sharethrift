import { Question, type Actor, notes } from '@serenity-js/core';

/**
 * ListingStatus is a Question that retrieves the status of a listing.
 *
 * Questions are used in assertions to query the current state.
 * The status is retrieved from actor notes set during task execution.
 */
export class ListingStatus extends Question<string> {
	constructor() {
		super('listing status');
	}

	/**
	 * Retrieve the listing status from actor notes
	 */
	async answeredBy(actor: Actor): Promise<string> {
		const status = await actor.answer(notes<{ lastListingStatus: string }>().get('lastListingStatus'));
		if (!status) {
			throw new Error(
				'No listing status found in actor notes. Did the actor create a listing first? ' +
				'Use a When step like "Alice has created a draft listing titled ..."',
			);
		}
		return status;
	}

	/**
	 * Factory method to create this question
	 */
	static of(): ListingStatus {
		return new ListingStatus();
	}

	toString(): string {
		return 'the listing status';
	}
}
