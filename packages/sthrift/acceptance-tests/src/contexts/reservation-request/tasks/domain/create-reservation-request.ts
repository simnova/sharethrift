import { Task, type Actor, notes } from '@serenity-js/core';
import { CreateReservationRequestAbility } from '../../abilities/create-reservation-request-ability.ts';
import type { CreateReservationRequestInput } from '../../abilities/reservation-request-types.ts';

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
		const ability = CreateReservationRequestAbility.as(actor);
		ability.createReservationRequest(this.input);

		const reservationRequest = ability.getCreatedAggregate();
		if (reservationRequest) {
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
	}

	override toString = () => `creates reservation request for listing "${this.input.listingId}" (domain)`;
}
