import { Question, type AnswersQuestions, type UsesAbilities, notes } from '@serenity-js/core';

/**
 * ListingTitle question - gets the title of the last created listing.
 *
 * The title is retrieved from actor notes set during task execution.
 */
export class ListingTitle extends Question<Promise<string>> {
	constructor() {
		super('listing title');
	}

	static displayed(): ListingTitle {
		return new ListingTitle();
	}

	override answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<string> {
		return actor.answer(notes<{ lastListingTitle: string }>().get('lastListingTitle')).then((title: unknown) => {
			if (!title) {
				throw new Error(
					'No listing title found in actor notes. Did the actor create a listing first? ' +
					'Use a When step like "Alice has created a draft listing titled ..."',
				);
			}
			return title as string;
		});
	}

	override toString = () => 'listing title';
}
