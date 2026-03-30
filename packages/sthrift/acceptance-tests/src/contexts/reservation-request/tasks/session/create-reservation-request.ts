import { Task, type Actor, notes } from '@serenity-js/core';
import { getSession } from '../../../../shared/abilities/session.ts';
import type { CreateReservationRequestInput, ReservationRequestNotes, ReservationRequestResponse } from '../../abilities/reservation-request-types.ts';

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

		// Validate the response contains expected data
		if (!reservationRequest.id) {
			throw new Error('Session reservation:create returned a reservation request without an id');
		}
		if (!reservationRequest.state) {
			throw new Error('Session reservation:create returned a reservation request without a state');
		}
		if (reservationRequest.state !== 'Requested') {
			throw new Error(
				`Session reservation:create returned state "${reservationRequest.state}", expected "Requested"`,
			);
		}

		// Verify persistence via count query
		const count = await session.execute<{ listingId: string }, number>(
			'reservation:getCountForListing',
			{ listingId: this.input.listingId },
		);
		if (count < 1) {
			throw new Error(
				`Expected at least 1 reservation request for listing ${this.input.listingId} after creation, but found ${count}`,
			);
		}

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
