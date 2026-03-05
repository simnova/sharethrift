import { Task, type Actor, notes } from '@serenity-js/core';
import { getSession } from '../../../../shared/abilities/session.js';
import type { CreateReservationRequestInput, ReservationRequest } from '../../abilities/reservation-request-session.js';

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
		super(`creates reservation request for listing "${input.listingId}"`);
	}

	async performAs(actor: Actor): Promise<void> {
		// Get the reservation-request-specific Session ability
		const session = getSession(actor, 'reservation');

		// Create the reservation request via Session interface
		const reservationRequest = await session.execute<CreateReservationRequestInput, ReservationRequest>(
			'reservation:create',
			this.input,
		);

		// Store reservation request details in notes for later tasks
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
			`[SESSION] Created reservation request: ${reservationRequest.id} for listing ${this.input.listingId}`,
		);
	}

	override toString = () => `creates reservation request for listing "${this.input.listingId}"`;
}
