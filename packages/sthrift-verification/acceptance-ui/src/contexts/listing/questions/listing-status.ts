import {
	type AnswersQuestions,
	notes,
	Question,
	type UsesAbilities,
} from '@serenity-js/core';
import { CreateListingAbility } from '../abilities/create-listing-ability.ts';

export class ListingStatus extends Question<Promise<string>> {
	constructor() {
		super('listing status');
	}

	override answeredBy(
		actor: AnswersQuestions & UsesAbilities,
	): Promise<string> {
		return this.resolveStatus(actor);
	}

	static of(): ListingStatus {
		return new ListingStatus();
	}

	override toString(): string {
		return 'the listing status';
	}

	private async resolveStatus(
		actor: AnswersQuestions & UsesAbilities,
	): Promise<string> {
		const domainStatus = this.readStatusFromDomain(actor);
		if (domainStatus) {
			return this.normalizeStatus(domainStatus);
		}

		const notedStatus = await this.readNote(actor, 'lastListingStatus');
		if (!notedStatus) {
			throw new Error(
				'No listing status found in the system or actor notes. Did the actor create a listing first?',
			);
		}

		return this.normalizeStatus(notedStatus);
	}

	private readStatusFromDomain(
		actor: AnswersQuestions & UsesAbilities,
	): string | undefined {
		try {
			return CreateListingAbility.as(actor).getCreatedListing()?.state;
		} catch {
			return undefined;
		}
	}

	private async readNote(
		actor: AnswersQuestions & UsesAbilities,
		key: 'lastListingId' | 'lastListingTitle' | 'lastListingStatus',
	): Promise<string | undefined> {
		try {
			return await actor.answer(notes<Record<typeof key, string>>().get(key));
		} catch {
			return undefined;
		}
	}

	private normalizeStatus(status: string): string {
		const normalized = status.trim().toLowerCase();
		if (normalized === 'published') {
			return 'active';
		}
		return normalized;
	}
}
