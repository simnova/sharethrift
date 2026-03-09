import { Question, type AnswersQuestions, type UsesAbilities, notes } from '@serenity-js/core';

export class ListingStatus extends Question<Promise<string>> {
	constructor() {
		super('listing status');
	}
    
	override answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<string> {
		return actor.answer(notes<{ lastListingStatus: string }>().get('lastListingStatus')).then((status: unknown) => {
			if (!status) {
				throw new Error(
					'No listing status found in actor notes. Did the actor create a listing first? ' +
					'Use a When step like "Alice has created a draft listing titled ..."',
				);
			}
			return status as string;
		});
	}

	static of(): ListingStatus {
		return new ListingStatus();
	}

	override toString(): string {
		return 'the listing status';
	}
}
