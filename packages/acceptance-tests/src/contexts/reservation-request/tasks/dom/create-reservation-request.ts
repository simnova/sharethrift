import { Task, type Actor, notes } from '@serenity-js/core';
import { ReservationRequestForm } from '../../../../../../../apps/ui-sharethrift/src/components/layouts/app/pages/view-listing/components/index.js';
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
		// Get abilities
		const renderer = RenderComponents.as(actor);
		const session = getSession(actor, 'reservation');

		// Track date changes
		let selectedDates: { startDate: Date | null; endDate: Date | null } = {
			startDate: null,
			endDate: null,
		};

		// Render the ReservationRequestForm component (date picker + reserve button)
		renderer.render(
			ReservationRequestForm,
			{
				reservationDates: selectedDates,
				onReservationDatesChange: (dates: { startDate: Date | null; endDate: Date | null }) => {
					selectedDates = dates;
				},
				onReserveClick: () => {
					// Will be triggered when user clicks Reserve button
				},
				disabled: false,
				loading: false,
				userReservationRequestState: null,
				otherReservations: [],
				otherReservationsLoading: false,
			} as unknown as Record<string, unknown>,
		);

		// Select the reservation dates in the DatePicker
		// The component accepts date range selection through the onReservationDatesChange callback
		selectedDates = {
			startDate: this.input.reservationPeriodStart,
			endDate: this.input.reservationPeriodEnd,
		};

		// Create the reservation request via Session
		const reservationRequest = await session.execute<CreateReservationRequestInput, ReservationRequest>(
			'reservationRequest:create',
			this.input,
		);

		// Store reservation request details in notes for later tasks
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

		console.log(
			`[DOM] Created reservation request: ${reservationRequest.id} for listing ${this.input.listingId}`,
		);
	}

	override toString = () => `creates reservation request for listing "${this.input.listingId}" (dom)`;
}
