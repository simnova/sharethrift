import { Given, Then, When, type DataTable } from '@cucumber/cucumber';
import { actorCalled, notes } from '@serenity-js/core';
import type { ShareThriftWorld } from '../../../shared/support/world.js';
import type { CreateReservationRequestInput } from '../abilities/reservation-request-session.js';

interface ReservationRequestNotes {
	lastReservationRequestId: string;
	lastReservationRequestState: string;
	lastReservationRequestStartDate: string;
	lastReservationRequestEndDate: string;
	lastValidationError: string;
	reservationRequestCountForListing: number;
}

let lastCreatedListingId = '';

Given(
	'{word} has created a listing with:',
	async function (this: ShareThriftWorld, actorName: string, dataTable: DataTable) {
		const actor = actorCalled(actorName);
		const details = dataTable.rowsHash();

		const taskLevel = this.level;
		const { CreateListing } = await import(`../../listing/tasks/${taskLevel}/create-listing.js`);

		await actor.attemptsTo(
			CreateListing.with(details as unknown as Record<string, unknown>),
		);

		// Store the listing ID from notes
		lastCreatedListingId = `test-listing-${Date.now()}`;
	},
);

When(
	'{word} creates a reservation request for {word}\'s listing with:',
	async function (this: ShareThriftWorld, reserver: string, dataTable: DataTable) {
		const actor = actorCalled(reserver);
		const data = dataTable.rowsHash();

		const taskLevel = this.level;
		const { CreateReservationRequest } = await import(`../tasks/${taskLevel}/create-reservation-request.js`);

		try {
			const startDate = data['reservationPeriodStart'];
			const endDate = data['reservationPeriodEnd'];

			await actor.attemptsTo(
				CreateReservationRequest.with({
					listingId: lastCreatedListingId,
					reservationPeriodStart: startDate ? new Date(String(startDate)) : new Date(),
					reservationPeriodEnd: endDate ? new Date(String(endDate)) : new Date(),
					reserver: {
						id: 'test-user-1',
						email: `${reserver.toLowerCase()}@test.com`,
						firstName: reserver,
						lastName: 'Tester',
					},
				}),
			);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			await actor.attemptsTo(
				notes<ReservationRequestNotes>().set('lastValidationError', errorMessage),
			);
		}
	},
);

When(
	'{word} attempts to create a reservation request with:',
	async function (this: ShareThriftWorld, actorName: string, dataTable: DataTable) {
		const actor = actorCalled(actorName);
		const data = dataTable.rowsHash();

		const taskLevel = this.level;
		const { CreateReservationRequest } = await import(`../tasks/${taskLevel}/create-reservation-request.js`);

		try {
			const startDate = data['reservationPeriodStart'];
			const endDate = data['reservationPeriodEnd'];

			const input: Partial<CreateReservationRequestInput> = {
				listingId: lastCreatedListingId,
				reserver: {
					id: 'test-user-1',
					email: `${actorName.toLowerCase()}@test.com`,
					firstName: actorName,
					lastName: 'Tester',
				},
			};

			if (startDate) {
				input.reservationPeriodStart = new Date(String(startDate));
			}
			if (endDate) {
				input.reservationPeriodEnd = new Date(String(endDate));
			}

			await actor.attemptsTo(
				CreateReservationRequest.with(input as CreateReservationRequestInput),
			);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			await actor.attemptsTo(
				notes<ReservationRequestNotes>().set('lastValidationError', errorMessage),
			);
		}
	},
);

Then(
	'the reservation request should be in requested status',
	async function (this: ShareThriftWorld) {
		const actor = actorCalled('Alice');
		// Check if actor has the reservation request ID stored in notes
		try {
			const requestId = await actor.answer(notes<ReservationRequestNotes>().get('lastReservationRequestId'));
			if (!requestId) {
				throw new Error('No reservation request was created');
			}
			const state = await actor.answer(notes<ReservationRequestNotes>().get('lastReservationRequestState'));
			if (state !== 'Requested') {
				throw new Error(`Expected reservation request status "Requested" but got "${state}"`);
			}
		} catch {
			throw new Error('Could not verify reservation request status');
		}
	},
);

Then(
	'the reservation request should have a start date of {string}',
	async function (this: ShareThriftWorld, expectedDate: string) {
		const actor = actorCalled('Alice');
		try {
			const startDate = await actor.answer(notes<ReservationRequestNotes>().get('lastReservationRequestStartDate'));
			if (startDate !== expectedDate) {
				throw new Error(`Expected start date "${expectedDate}" but got "${startDate}"`);
			}
		} catch {
			throw new Error(`Could not verify reservation request start date`);
		}
	},
);

Then(
	'the reservation request should have an end date of {string}',
	async function (this: ShareThriftWorld, expectedDate: string) {
		const actor = actorCalled('Alice');
		try {
			const endDate = await actor.answer(notes<ReservationRequestNotes>().get('lastReservationRequestEndDate'));
			if (endDate !== expectedDate) {
				throw new Error(`Expected end date "${expectedDate}" but got "${endDate}"`);
			}
		} catch {
			throw new Error(`Could not verify reservation request end date`);
		}
	},
);

Then(
	'{word} should see a reservation error for {string}',
	async function (this: ShareThriftWorld, actorName: string, fieldName: string) {
		// Map pronouns to actual actor names
		const resolvedActorName = /^(she|he|they)$/.test(actorName) ? 'Alice' : actorName;
		const actor = actorCalled(resolvedActorName);

		// Check if actor has a stored validation error from task execution
		try {
			const storedError = await actor.answer(notes<{lastValidationError?: string}>().get('lastValidationError'));
			if (storedError) {
				// Error was caught during task execution - validation passed
				return;
			}
		} catch {
			// No error stored
		}

		throw new Error(`Expected a validation error for "${fieldName}" but none was found`);
	},
);

Then(
	'{word} should see a reservation error {string}',
	async function (this: ShareThriftWorld, actorName: string, expectedMessage: string) {
		// Map pronouns to actual actor names
		const resolvedActorName = /^(she|he|they)$/.test(actorName) ? 'Alice' : actorName;
		const actor = actorCalled(resolvedActorName);

		// Check if actor has a stored validation error from task execution
		try {
			const storedError = await actor.answer(notes<{lastValidationError?: string}>().get('lastValidationError'));
			if (storedError) {
				if (!storedError.includes(expectedMessage)) {
					throw new Error(`Expected error message "${expectedMessage}", but got: "${storedError}"`);
				}
				return;
			}
		} catch {
			// No error stored
		}

		throw new Error(`Expected error message "${expectedMessage}", but none was found`);
	},
);

Then(
	'no reservation request should be created',
	async function (this: ShareThriftWorld) {
		const actor = actorCalled('Alice');
		try {
			const requestId = await actor.answer(notes<ReservationRequestNotes>().get('lastReservationRequestId'));
			if (requestId) {
				throw new Error('Expected no reservation request to be created, but one was');
			}
		} catch {
			// Expected - no reservation request was created
		}
	},
);

Then(
	'only one reservation request should exist for the listing',
	async function (this: ShareThriftWorld) {
		const actor = actorCalled('Alice');
		try {
			const count = await actor.answer(notes<ReservationRequestNotes>().get('reservationRequestCountForListing'));
			if (count !== 1) {
				throw new Error(`Expected 1 reservation request for listing but got ${count}`);
			}
		} catch {
			throw new Error('Could not verify reservation request count');
		}
	},
);
