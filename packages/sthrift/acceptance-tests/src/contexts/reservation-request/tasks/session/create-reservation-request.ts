import { Task, type Actor, notes } from '@serenity-js/core';
import { getSession } from '../../../../shared/abilities/session.ts';
import type { CreateReservationRequestInput, ReservationRequestResponse } from '../../abilities/reservation-request-types.ts';

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
		const session = getSession(actor, 'reservation');

		const reservationRequest = await session.execute<CreateReservationRequestInput, ReservationRequestResponse>(
			'reservation:create',
			this.input,
		);

		const startDate = reservationRequest.reservationPeriodStart.toISOString().split('T')[0] ?? '';
		const endDate = reservationRequest.reservationPeriodEnd.toISOString().split('T')[0] ?? '';

		await actor.attemptsTo(
			notes<ReservationRequestNotes>().set('lastReservationRequestId', reservationRequest.id),
			notes<ReservationRequestNotes>().set('lastReservationRequestState', reservationRequest.state),
			notes<ReservationRequestNotes>().set(
				'lastReservationRequestStartDate',
				startDate,
			),
			notes<ReservationRequestNotes>().set(
				'lastReservationRequestEndDate',
				endDate,
			),
		);

	}

	override toString = () => `creates reservation request for listing "${this.input.listingId}"`;
}
