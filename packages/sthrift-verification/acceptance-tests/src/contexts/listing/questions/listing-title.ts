import { Question, type Actor, type AnswersQuestions, type UsesAbilities, notes } from '@serenity-js/core';
import { getSession } from '../../../shared/abilities/session.ts';
import { CreateListingAbility } from '../abilities/create-listing-ability.ts';

export class ListingTitle extends Question<Promise<string>> {
	constructor() {
		super('listing title');
	}

	static displayed(): ListingTitle {
		return new ListingTitle();
	}

	override answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<string> {
		return this.resolveTitle(actor);
	}

	override toString = () => 'listing title';

	private async resolveTitle(actor: AnswersQuestions & UsesAbilities): Promise<string> {
		const notedTitle = await this.readNote(actor, 'lastListingTitle');
		const listingId = await this.readNote(actor, 'lastListingId');

		const sessionTitle = await this.readTitleFromSession(actor, listingId);
		if (sessionTitle) {
			return sessionTitle;
		}

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

	private async readTitleFromSession(actor: AnswersQuestions & UsesAbilities, listingId?: string): Promise<string | undefined> {
		if (!listingId) {
			return undefined;
		}

		try {
			const session = getSession(actor as unknown as Actor, 'listing');
			const listing = await session.execute<{ id: string }, { title?: string } | null>('listing:getById', { id: listingId });
			return listing?.title ? String(listing.title) : undefined;
		} catch {
			return undefined;
		}
	}

	private readTitleFromDomain(actor: AnswersQuestions & UsesAbilities): string | undefined {
		try {
			return CreateListingAbility.as(actor as unknown as Actor).getCreatedListing()?.title;
		} catch {
			return undefined;
		}
	}

	private async readNote(actor: AnswersQuestions & UsesAbilities, key: 'lastListingId' | 'lastListingTitle'): Promise<string | undefined> {
		try {
			return await actor.answer(notes<Record<typeof key, string>>().get(key));
		} catch {
			return undefined;
		}
	}
}
