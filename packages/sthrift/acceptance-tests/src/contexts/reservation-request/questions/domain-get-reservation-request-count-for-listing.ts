import { type Actor, Question } from '@serenity-js/core';
import { CreateReservationRequestAbility } from '../abilities/create-reservation-request-ability.ts';

export class DomainGetReservationRequestCountForListing extends Question<number> {
	static forListing(listingId: string) {
		return new DomainGetReservationRequestCountForListing(listingId);
	}

	constructor(private readonly listingId: string) {
		super(`count of reservation requests for listing "${listingId}" (domain)`);
	}

	answeredBy(_actor: Actor): number {
		return CreateReservationRequestAbility.getCountForListing(this.listingId);
	}
}
