import {
	type Actor,
	type AnswersQuestions,
	notes,
	Question,
	type UsesAbilities,
} from '@serenity-js/core';
import { GraphQLClient } from '../../../shared/abilities/graphql-client.ts';
import { CreateListingAbility } from '../abilities/create-listing-ability.ts';

const GET_LISTING_QUERY = `
	query GetListing($id: ObjectID!) {
		itemListing(id: $id) { id state }
	}
`;

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
		const listingId = await this.readNote(actor, 'lastListingId');

		const apiStatus = await this.readStatusFromApi(actor, listingId);
		if (apiStatus) {
			return this.normalizeStatus(apiStatus);
		}

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

	private async readStatusFromApi(
		actor: AnswersQuestions & UsesAbilities,
		listingId?: string,
	): Promise<string | undefined> {
		if (!listingId) {
			return undefined;
		}

		try {
			const graphql = GraphQLClient.as(actor as unknown as Actor);
			const response = await graphql.execute(GET_LISTING_QUERY, {
				id: listingId,
			});
			const listing = response.data.itemListing as
				| Record<string, unknown>
				| undefined;
			return listing?.state ? String(listing.state) : undefined;
		} catch {
			return undefined;
		}
	}

	private readStatusFromDomain(
		actor: AnswersQuestions & UsesAbilities,
	): string | undefined {
		try {
			return CreateListingAbility.as(
				actor as unknown as Actor,
			).getCreatedListing()?.state;
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
