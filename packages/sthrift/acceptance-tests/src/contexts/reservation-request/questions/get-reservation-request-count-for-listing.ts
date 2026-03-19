import { type Actor, Question } from '@serenity-js/core';

import { getSession } from '../../../shared/abilities/session.ts';

export class GetReservationRequestCountForListing extends Question<Promise<number>> {
	static forListing(listingId: string) {
		return new GetReservationRequestCountForListing(listingId);
	}

	constructor(private readonly listingId: string) {
		super(`count of reservation requests for listing "${listingId}"`);
	}

	answeredBy(actor: Actor): Promise<number> {
		const session = getSession(actor, 'reservation');
		return session.execute<{ listingId: string }, number>(
			'reservation:getCountForListing',
			{ listingId: this.listingId },
		);
	}
}
