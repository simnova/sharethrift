import { Question, type AnswersQuestions, type UsesAbilities, notes } from '@serenity-js/core';

export class ListingTitle extends Question<Promise<string>> {
	constructor() {
		super('listing title');
	}

	static displayed(): ListingTitle {
		return new ListingTitle();
	}

	override answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<string> {
		return actor.answer(notes<{ lastListingTitle: string }>().get('lastListingTitle')).then((title: string) => {
			if (!title) {
				throw new Error(
					'No listing title found in actor notes. Did the actor create a listing first? ' +
					'Use a When step like "Alice has created a draft listing titled ..."',
				);
			}
			return title;
		});
	}

	override toString = () => 'listing title';
}
