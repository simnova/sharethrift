import { Task, type Actor, notes } from '@serenity-js/core';
import type { CreateReservationRequestInput, ReservationRequest } from '../../abilities/reservation-request-session.js';
import { DomainReservationRequestSession } from '../../abilities/domain-reservation-request-session.js';

interface ReservationRequestNotes {
	lastReservationRequestId: string;
	lastReservationRequestState: string;
	lastReservationRequestStartDate: string;
	lastReservationRequestEndDate: string;
}

export class CreateReservationRequest extends Task {
	static with(input: CreateReservationRequestInput) {
		return new CreateReservationRequest(input);
	}

	private constructor(private readonly input: CreateReservationRequestInput) {
		super(`creates reservation request for listing "${input.listingId}" (domain)`);
	}

	async performAs(actor: Actor): Promise<void> {
		const session = DomainReservationRequestSession.as(actor);

		// Create the reservation request via session
		const reservationRequest = await session.createReservationRequest(this.input);

		// Store results for Then steps
		await actor.attemptsTo(
			notes<ReservationRequestNotes>().set('lastReservationRequestId', reservationRequest.id),
			notes<ReservationRequestNotes>().set('lastReservationRequestState', reservationRequest.state),
			notes<ReservationRequestNotes>().set(
				'lastReservationRequestStartDate',
				reservationRequest.reservationPeriodStart.toISOString().split('T')[0],
			),
			notes<ReservationRequestNotes>().set(
				'lastReservationRequestEndDate',
				reservationRequest.reservationPeriodEnd.toISOString().split('T')[0],
			),
		);

		console.log(
			`[DOMAIN] Created reservation request: ${reservationRequest.id} for listing ${this.input.listingId}`,
		);
	}

	override toString = () => `creates reservation request for listing "${this.input.listingId}" (domain)`;
}
