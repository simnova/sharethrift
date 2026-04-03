import {
	type Actor,
	type AnswersQuestions,
	notes,
	Question,
	type UsesAbilities,
} from '@serenity-js/core';
import { GraphQLClient } from '../../../shared/abilities/graphql-client.ts';

const GET_LISTING_QUERY = `
	query GetListing($id: ObjectID!) {
		itemListing(id: $id) { id title }
	}
`;

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
		const listingId = await this.readNote(actor, 'lastListingId');

		const apiTitle = await this.readTitleFromApi(actor, listingId);
		if (apiTitle) {
			return apiTitle;
		}

		if (!notedTitle) {
			throw new Error(
				'No listing title found in the system or actor notes. Did the actor create a listing first?',
			);
		}

		return notedTitle;
	}

	private async readTitleFromApi(
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
			return listing?.title ? String(listing.title) : undefined;
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
