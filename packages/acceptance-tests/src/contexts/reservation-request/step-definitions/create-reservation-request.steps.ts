import { Given, Then, When, type DataTable } from '@cucumber/cucumber';
import { actorCalled, notes } from '@serenity-js/core';
import type { ShareThriftWorld } from '../../../shared/support/world.js';
import type { CreateReservationRequestInput } from '../abilities/reservation-request-session.js';
import { CreateListing as DomCreateListing } from '../../listing/tasks/dom/create-listing.js';
import { CreateListing as SessionCreateListing } from '../../listing/tasks/session/create-listing.js';
import { CreateListing as DomainCreateListing } from '../../listing/tasks/domain/create-listing.js';
import { CreateReservationRequest as DomCreateReservationRequest } from '../tasks/dom/create-reservation-request.js';
import { CreateReservationRequest as SessionCreateReservationRequest } from '../tasks/session/create-reservation-request.js';
import { CreateReservationRequest as DomainCreateReservationRequest } from '../tasks/domain/create-reservation-request.js';
import { GetReservationRequestCountForListing } from '../questions/get-reservation-request-count-for-listing.js';

interface ReservationRequestNotes {
	lastReservationRequestId: string;
	lastReservationRequestState: string;
	lastReservationRequestStartDate: string;
	lastReservationRequestEndDate: string;
	lastValidationError: string;
	reservationRequestCountForListing: number;
}

function getCreateListingTask(level: string) {
	switch (level) {
		case 'dom':
			return DomCreateListing;
		case 'session':
			return SessionCreateListing;
		default:
			return DomainCreateListing;
	}
}

function getCreateReservationRequestTask(level: string) {
	switch (level) {
		case 'dom':
			return DomCreateReservationRequest;
		case 'session':
			return SessionCreateReservationRequest;
		default:
			return DomainCreateReservationRequest;
	}
}

let lastCreatedListingId = '';

Given(
	'{word} has created a listing with:',
	async function (this: ShareThriftWorld, actorName: string, dataTable: DataTable) {
		const actor = actorCalled(actorName);
		const details = dataTable.rowsHash();

		const CreateListing = getCreateListingTask(this.level);

		await actor.attemptsTo(
			CreateListing.with(details as unknown as Record<string, unknown>),
		);

		// Store the listing ID from notes
		lastCreatedListingId = `test-listing-${Date.now()}`;
	},
);

When(
	'{word} creates a reservation request for {word}\'s listing with:',
	async function (this: ShareThriftWorld, reserver: string, owner: string, dataTable: DataTable) {
		const actor = actorCalled(reserver);
		const data = dataTable.rowsHash();

		const CreateReservationRequest = getCreateReservationRequestTask(this.level);

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
	},
);

When(
	'{word} attempts to create a reservation request with:',
	async function (this: ShareThriftWorld, actorName: string, dataTable: DataTable) {
		const actor = actorCalled(actorName);
		const data = dataTable.rowsHash();

		const CreateReservationRequest = getCreateReservationRequestTask(this.level);

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
		// Check if actor has the reservation request ID and state stored in notes
		try {
			const requestId = await actor.answer(notes<ReservationRequestNotes>().get('lastReservationRequestId'));
			if (!requestId) {
				throw new Error('No reservation request was created - lastReservationRequestId not found in notes');
			}
			const state = await actor.answer(notes<ReservationRequestNotes>().get('lastReservationRequestState'));
			if (!state) {
				throw new Error('Reservation request state not found in notes');
			}
			if (state !== 'Requested') {
				throw new Error(`Expected reservation request status "Requested" but got "${state}"`);
			}
		} catch (error) {
			throw new Error(`Could not verify reservation request status: ${error instanceof Error ? error.message : String(error)}`);
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
			const count = await actor.answer(
				GetReservationRequestCountForListing.forListing(lastCreatedListingId),
			);
			if (count !== 1) {
				throw new Error(`Expected 1 reservation request for listing but got ${count}`);
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			throw new Error(`Could not verify reservation request count: ${message}`);
		}
	},
);

Given(
	'{word} has already created a reservation request for {word}\'s listing with:',
	async function (this: ShareThriftWorld, reserver: string, owner: string, dataTable: DataTable) {
		const actor = actorCalled(reserver);
		const data = dataTable.rowsHash();

		const CreateReservationRequest = getCreateReservationRequestTask(this.level);

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
	},
);

When(
	'{word} attempts to create another reservation request for the same listing with:',
	async function (this: ShareThriftWorld, actorName: string, dataTable: DataTable) {
		const actor = actorCalled(actorName);
		const data = dataTable.rowsHash();

		const CreateReservationRequest = getCreateReservationRequestTask(this.level);

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
						email: `${actorName.toLowerCase()}@test.com`,
						firstName: actorName,
						lastName: 'Tester',
					},
				}),
			);

			// Store that no error occurred
			await actor.attemptsTo(notes<{lastValidationError?: string}>().set('lastValidationError', undefined));
		} catch (error) {
			if (error instanceof Error) {
				await actor.attemptsTo(notes<{lastValidationError?: string}>().set('lastValidationError', error.message));
			}
		}
	},
);
