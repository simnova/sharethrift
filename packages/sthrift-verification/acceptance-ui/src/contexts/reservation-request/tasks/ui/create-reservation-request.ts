import '../../../../shared/support/ui/setup-jsdom.ts';
import { type Actor, notes, Task } from '@serenity-js/core';
import { render, cleanup, act } from '@testing-library/react';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
	ReservationPage,
	type UiReservationPage,
} from '@sthrift-verification/test-support/pages';
import { JsdomPageAdapter } from '@sthrift-verification/test-support/pages/jsdom';
import { ReservationCard } from '@apps/ui-sharethrift/src/components/layouts/app/pages/my-reservations/components/reservation-card.tsx';
import { ReservationRequestForm } from '@apps/ui-sharethrift/src/components/layouts/app/pages/view-listing/components/reservation-request-form.tsx';
import { CreateReservationRequestAbility } from '../../abilities/create-reservation-request-ability.ts';
import type {
	CreateReservationRequestInput,
	ReservationRequestNotes,
} from '../../abilities/reservation-request-types.ts';
import { cleanupJsdom } from '../../../../shared/support/ui/jsdom-setup.ts';

const noop = () => undefined;

export class CreateReservationRequest extends Task {
	static with(input: CreateReservationRequestInput) {
		return new CreateReservationRequest(input);
	}

	private constructor(private readonly input: CreateReservationRequestInput) {
		super(
			`fills and submits reservation request form for listing "${input.listingId}"`,
		);
	}

	async performAs(actor: Actor): Promise<void> {
		// 1. Render and interact with UI via page object
		await this.interactWithUI();

		// 2. Domain validation (source of truth for test assertions)
		const ability = CreateReservationRequestAbility.as(actor);
		ability.createReservationRequest(this.input);

		const reservationRequest = ability.getCreatedAggregate();
		if (!reservationRequest) {
			throw new Error(
				'Domain CreateReservationRequestAbility did not produce an aggregate',
			);
		}

		// 3. Store values in notes for assertion steps
		const startDate =
			reservationRequest.reservationPeriodStart.toISOString().split('T')[0] ??
			'';
		const endDate =
			reservationRequest.reservationPeriodEnd.toISOString().split('T')[0] ?? '';

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

	private async interactWithUI(): Promise<void> {
		globalThis.React = React;

		try {
			// Render the ReservationRequestForm component
			const { container } = render(
				React.createElement(
					MemoryRouter,
					null,
					React.createElement(
						ReservationRequestForm as React.ComponentType<
							Record<string, unknown>
						>,
						{
							userIsSharer: false,
							isAuthenticated: true,
							userReservationRequest: null,
							onReserveClick: noop,
							onCancelClick: noop,
							reservationDates: {
								startDate: this.input.reservationPeriodStart,
								endDate: this.input.reservationPeriodEnd,
							},
							onReservationDatesChange: noop,
							reservationLoading: false,
							otherReservationsLoading: false,
							otherReservationsError: undefined,
							otherReservations: [],
						},
					),
				),
			);

			// Use shared page object for form interactions
			const page: UiReservationPage = new ReservationPage(
				new JsdomPageAdapter(container),
			);

			await act(async () => {
				await page.openDatePicker();
			});

			// Click the Reserve button
			await act(async () => {
				await page.clickReserve();
			});

			// Render ReservationCard for broader coverage
			render(
				React.createElement(
					MemoryRouter,
					null,
					React.createElement(
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
									this.input.reservationPeriodStart?.toISOString(),
								reservationPeriodEnd:
									this.input.reservationPeriodEnd?.toISOString(),
							},
							showActions: false,
						},
					),
				),
			);

			cleanup();
		} finally {
			cleanupJsdom();
		}
	}

	override toString = () =>
		`fills and submits reservation request form for listing "${this.input.listingId}"`;
}
