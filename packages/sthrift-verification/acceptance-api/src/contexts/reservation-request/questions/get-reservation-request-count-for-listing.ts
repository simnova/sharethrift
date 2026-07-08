import { type Actor, Question } from '@serenity-js/core';

import { GraphQLClient } from '../../../shared/abilities/graphql-client.ts';

const GET_RESERVATION_COUNT_QUERY = `
	query GetReservationRequestsForListing($listingId: ObjectID!) {
		queryActiveByListingId(listingId: $listingId) { id }
	}
`;

export class GetReservationRequestCountForListing extends Question<Promise<number>> {
	static forListing(listingId: string) {
		return new GetReservationRequestCountForListing(listingId);
	}

	constructor(private readonly listingId: string) {
		super(`count of reservation requests for listing "${listingId}"`);
	}

	async answeredBy(actor: Actor): Promise<number> {
		const graphql = actor.abilityTo(GraphQLClient);
		const response = await graphql.execute(GET_RESERVATION_COUNT_QUERY, {
			listingId: this.listingId,
		});
		const items = response.data.queryActiveByListingId as unknown[];
		return Array.isArray(items) ? items.length : 0;
	}
}
