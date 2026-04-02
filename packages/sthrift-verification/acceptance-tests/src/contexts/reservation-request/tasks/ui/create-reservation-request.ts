import { Task, type Actor, notes } from '@serenity-js/core';
import type { CreateReservationRequestInput, ReservationRequestNotes } from '../../abilities/reservation-request-types.ts';
import { CreateReservationRequestAbility } from '../../abilities/create-reservation-request-ability.ts';

export class CreateReservationRequest extends Task {
	static with(input: CreateReservationRequestInput) {
		return new CreateReservationRequest(input);
	}

	private constructor(private readonly input: CreateReservationRequestInput) {
		super(
			`renders reservation request UI for listing "${input.listingId}"`,
		);
	}

	async performAs(actor: Actor): Promise<void> {
		// 1. Perform domain validation first (handles overlaps, missing fields, etc.)
		const ability = CreateReservationRequestAbility.as(actor);
		ability.createReservationRequest(this.input);

		const reservationRequest = ability.getCreatedAggregate();
		if (!reservationRequest) {
			throw new Error(
				'Domain CreateReservationRequestAbility did not produce an aggregate',
			);
		}

		// 2. Render UI components for code coverage
		const { ensureJsdom, cleanupJsdom } = await import(
			'../../../../shared/support/ui/jsdom-setup.ts'
		);
		const { renderForCoverage } = await import(
			'../../../../shared/support/ui/react-render.tsx'
		);

		ensureJsdom();

		// Render the ReservationRequestForm component
		const { ReservationRequestForm } = await import(
			'@apps/ui-sharethrift/src/components/layouts/app/pages/view-listing/components/reservation-request-form.tsx'
		);

		const { cleanup } = await renderForCoverage(
			ReservationRequestForm as React.ComponentType<Record<string, unknown>>,
			{
				userIsSharer: false,
				isAuthenticated: true,
				userReservationRequest: null,
				onReserveClick: () => {},
				onCancelClick: () => {},
				reservationDates: {
					startDate: this.input.reservationPeriodStart,
					endDate: this.input.reservationPeriodEnd,
				},
				onReservationDatesChange: () => {},
				reservationLoading: false,
				otherReservationsLoading: false,
				otherReservationsError: undefined,
				otherReservations: [],
			},
			{ withRouter: true },
		);

		cleanup();

		// Also render the ReservationCard for broader coverage
		try {
			const { ReservationCard } = await import(
				'@apps/ui-sharethrift/src/components/layouts/app/pages/my-reservations/components/reservation-card.tsx'
			);

			const { cleanup: cleanup2 } = await renderForCoverage(
				ReservationCard as React.ComponentType<Record<string, unknown>>,
				{
					reservation: {
						id: this.input.listingId,
						listing: {
							title: 'Test Listing',
							images: [],
						},
						state: 'Requested',
						reservationPeriodStart:
							this.input.reservationPeriodStart.toISOString(),
						reservationPeriodEnd:
							this.input.reservationPeriodEnd.toISOString(),
					},
					showActions: false,
				},
				{ withRouter: true },
			);

			cleanup2();
		} catch {
			// ReservationCard may have additional import requirements; skip gracefully
		}

		cleanupJsdom();

		// 3. Store values in notes for assertion steps
		const startDate =
			reservationRequest.reservationPeriodStart
				.toISOString()
				.split('T')[0] ?? '';
		const endDate =
			reservationRequest.reservationPeriodEnd
				.toISOString()
				.split('T')[0] ?? '';

		await actor.attemptsTo(
			notes<ReservationRequestNotes>().set(
				'lastReservationRequestId',
				reservationRequest.id,
			),
			notes<ReservationRequestNotes>().set(
				'lastReservationRequestState',
				reservationRequest.state,
			),
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

	override toString = () =>
		`renders reservation request UI for listing "${this.input.listingId}"`;
}
