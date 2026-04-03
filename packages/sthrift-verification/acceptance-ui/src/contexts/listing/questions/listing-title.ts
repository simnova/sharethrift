import {
	type AnswersQuestions,
	notes,
	Question,
	type UsesAbilities,
} from '@serenity-js/core';
import { CreateListingAbility } from '../abilities/create-listing-ability.ts';

export class ListingTitle extends Question<Promise<string>> {
	constructor() {
		super('listing title');
	}

	static displayed(): ListingTitle {
		return new ListingTitle();
	}

	override answeredBy(
		actor: AnswersQuestions & UsesAbilities,
	): Promise<string> {
		return this.resolveTitle(actor);
	}

	override toString = () => 'listing title';

	private async resolveTitle(
		actor: AnswersQuestions & UsesAbilities,
	): Promise<string> {
		const notedTitle = await this.readNote(actor, 'lastListingTitle');

		const domainTitle = this.readTitleFromDomain(actor);
		if (domainTitle) {
			return domainTitle;
		}

		if (!notedTitle) {
			throw new Error(
				'No listing title found in the system or actor notes. Did the actor create a listing first?',
			);
		}

		return notedTitle;
	}

	private readTitleFromDomain(
		actor: AnswersQuestions & UsesAbilities,
	): string | undefined {
		try {
			return CreateListingAbility.as(actor).getCreatedListing()?.title;
		} catch {
			return undefined;
		}
	}

	private async readNote(
		actor: AnswersQuestions & UsesAbilities,
		key: 'lastListingId' | 'lastListingTitle',
	): Promise<string | undefined> {
		try {
			return await actor.answer(notes<Record<typeof key, string>>().get(key));
		} catch {
			return undefined;
		}
	}
}
