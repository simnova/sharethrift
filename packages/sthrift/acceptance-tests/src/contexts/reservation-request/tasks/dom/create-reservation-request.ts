import { Task, type Actor, notes } from '@serenity-js/core';
import { RenderComponents } from '../../../../shared/abilities/render-components.js';
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
		super(`creates reservation request for listing "${input.listingId}" (dom)`);
	}

	async performAs(actor: Actor): Promise<void> {
		const renderer = RenderComponents.as(actor);
		const session = getSession(actor, 'reservation');

		renderer.cleanupDOM();

		let reserveClicked = false;

		// Lazy-load UI component to avoid import errors in non-DOM tests
		const { ReservationRequestForm } = await import(
			'../../../../../../../../apps/ui-sharethrift/src/components/layouts/app/pages/view-listing/components/reservation-request-form.tsx' as string
		);

		const { getByRole, user } = renderer.render(
			ReservationRequestForm,
			{
				userIsSharer: false,
				isAuthenticated: true,
				userReservationRequest: null,
				reservationDates: {
					startDate: this.input.reservationPeriodStart,
					endDate: this.input.reservationPeriodEnd,
				},
				onReservationDatesChange: () => { /* no-op */ },
				onReserveClick: () => {
					reserveClicked = true;
				},
				onCancelClick: () => { /* no-op */ },
				reservationLoading: false,
				otherReservationsLoading: false,
				otherReservations: [],
			} as unknown as Record<string, unknown>,
		);

		await user.click(getByRole('button', { name: /reserve/i }));

		if (!reserveClicked) {
			throw new Error('ReservationRequestForm onReserveClick was not called');
		}

		const reservationRequest = await session.execute<CreateReservationRequestInput, ReservationRequest>(
			'reservation:create',
			this.input,
		);

		await actor.attemptsTo(
			notes<ReservationRequestNotes>().set('lastReservationRequestId', reservationRequest.id),
			notes<ReservationRequestNotes>().set('lastReservationRequestState', reservationRequest.state),
			notes<ReservationRequestNotes>().set(
				'lastReservationRequestStartDate',
				reservationRequest.reservationPeriodStart.toISOString().split('T')[0] ?? '',
			),
			notes<ReservationRequestNotes>().set(
				'lastReservationRequestEndDate',
				reservationRequest.reservationPeriodEnd.toISOString().split('T')[0] ?? '',
			),
		);

	}

	override toString = () => `creates reservation request for listing "${this.input.listingId}" (dom)`;
}
