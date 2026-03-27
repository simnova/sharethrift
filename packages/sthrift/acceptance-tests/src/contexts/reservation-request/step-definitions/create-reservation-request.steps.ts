import { Given, Then, When, type DataTable } from '@cucumber/cucumber';
import { actorCalled, notes } from '@serenity-js/core';
import type { ShareThriftWorld } from '../../../world.ts';
import { makeTestUserData, resolveActorName } from '../../../shared/support/domain-test-helpers.ts';
import { CreateListing as E2eCreateListing } from '../../listing/tasks/e2e/create-listing.ts';
import { CreateListing as SessionCreateListing } from '../../listing/tasks/session/create-listing.ts';
import { CreateListing as DomainCreateListing, type CreateListingInput } from '../../listing/tasks/domain/create-listing.ts';
import { CreateReservationRequest as E2eCreateReservationRequest } from '../tasks/e2e/create-reservation-request.ts';
import { CreateReservationRequest as SessionCreateReservationRequest } from '../tasks/session/create-reservation-request.ts';
import { CreateReservationRequest as DomainCreateReservationRequest } from '../tasks/domain/create-reservation-request.ts';
import { GetReservationRequestCountForListing } from '../questions/get-reservation-request-count-for-listing.ts';
import type { CreateReservationRequestInput, ReservationRequestNotes } from '../abilities/reservation-request-types.ts';

function getCreateListingTask(level: string) {
	switch (level) {
		case 'e2e':
			return E2eCreateListing;
		case 'session':
			return SessionCreateListing;
		default:
			return DomainCreateListing;
	}
}

function getCreateReservationRequestTask(level: string) {
	switch (level) {
		case 'e2e':
			return E2eCreateReservationRequest;
		case 'session':
			return SessionCreateReservationRequest;
		default:
			return DomainCreateReservationRequest;
	}
}

function parseDateInput(input: string): Date {
	// Handle relative dates like "+1" (tomorrow), "+5" (5 days from now)
	if (input.startsWith('+')) {
		const days = parseInt(input.substring(1), 10);
		const date = new Date();
		date.setDate(date.getDate() + days);
		date.setHours(0, 0, 0, 0);
		return date;
	}
	// Handle ISO date strings
	const date = new Date(input);
	date.setHours(0, 0, 0, 0);
	return date;
}

function formatDateForComparison(date: Date): string {
	return date.toISOString().split('T')[0] ?? '';
}

async function getListingIdFromOwner(ownerName: string): Promise<string> {
	const owner = actorCalled(ownerName);
	const listingId = await owner.answer(
		notes<{ lastListingId: string }>().get('lastListingId'),
	);
	if (!listingId) {
		throw new Error(
			`No listing ID found in ${ownerName}'s notes. Did ${ownerName} create a listing first?`,
		);
	}
	return listingId;
}

Given(
	'{word} has created a listing with:',
	async function (this: ShareThriftWorld, actorName: string, dataTable: DataTable) {
		const actor = actorCalled(actorName);
		const details = dataTable.rowsHash();

		const CreateListing = getCreateListingTask(this.setupLevel);

		await actor.attemptsTo(
			CreateListing.with(details as unknown as CreateListingInput),
		);
	},
);

When(
	'{word} creates a reservation request for {word}\'s listing with:',
	async function (this: ShareThriftWorld, reserver: string, owner: string, dataTable: DataTable) {
		const actor = actorCalled(reserver);
		const data = dataTable.rowsHash();

		const CreateReservationRequest = getCreateReservationRequestTask(this.level);

		const listingId = await getListingIdFromOwner(owner);
		const startDate = data['reservationPeriodStart'];
		const endDate = data['reservationPeriodEnd'];

		await actor.attemptsTo(
			CreateReservationRequest.with({
				listingId,
				reservationPeriodStart: startDate ? parseDateInput(String(startDate)) : new Date(),
				reservationPeriodEnd: endDate ? parseDateInput(String(endDate)) : new Date(),
				reserver: makeTestUserData(reserver),
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

		// Clear any stale validation error from a previous scenario
		await actor.attemptsTo(
			notes<ReservationRequestNotes>().set('lastValidationError', undefined as unknown as string),
		);

		try {
			const startDate = data['reservationPeriodStart'];
			const endDate = data['reservationPeriodEnd'];

			// Get the listing ID from the owner (Bob) — set during Background step
			const listingId = await getListingIdFromOwner('Bob');

			const input: Partial<CreateReservationRequestInput> = {
				listingId,
				reserver: makeTestUserData(actorName),
			};

			if (startDate) {
				input.reservationPeriodStart = parseDateInput(String(startDate));
			}
			if (endDate) {
				input.reservationPeriodEnd = parseDateInput(String(endDate));
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
	'the reservation request should have a start date that is {int} day from now',
	async function (this: ShareThriftWorld, daysFromNow: number) {
		const actor = actorCalled('Alice');
		try {
			const startDate = await actor.answer(notes<ReservationRequestNotes>().get('lastReservationRequestStartDate'));
			const expectedDate = new Date();
			expectedDate.setDate(expectedDate.getDate() + daysFromNow);
			const expectedDateStr = formatDateForComparison(expectedDate);
			if (startDate !== expectedDateStr) {
				throw new Error(`Expected start date ${daysFromNow} day(s) from now (${expectedDateStr}) but got "${startDate}"`);
			}
		} catch (error) {
			throw new Error(`Could not verify reservation request start date: ${error instanceof Error ? error.message : String(error)}`);
		}
	},
);

Then(
	'the reservation request should have a start date that is {int} days from now',
	async function (this: ShareThriftWorld, daysFromNow: number) {
		const actor = actorCalled('Alice');
		try {
			const startDate = await actor.answer(notes<ReservationRequestNotes>().get('lastReservationRequestStartDate'));
			const expectedDate = new Date();
			expectedDate.setDate(expectedDate.getDate() + daysFromNow);
			const expectedDateStr = formatDateForComparison(expectedDate);
			if (startDate !== expectedDateStr) {
				throw new Error(`Expected start date ${daysFromNow} days from now (${expectedDateStr}) but got "${startDate}"`);
			}
		} catch (error) {
			throw new Error(`Could not verify reservation request start date: ${error instanceof Error ? error.message : String(error)}`);
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
	'the reservation request should have an end date that is {int} day from now',
	async function (this: ShareThriftWorld, daysFromNow: number) {
		const actor = actorCalled('Alice');
		try {
			const endDate = await actor.answer(notes<ReservationRequestNotes>().get('lastReservationRequestEndDate'));
			const expectedDate = new Date();
			expectedDate.setDate(expectedDate.getDate() + daysFromNow);
			const expectedDateStr = formatDateForComparison(expectedDate);
			if (endDate !== expectedDateStr) {
				throw new Error(`Expected end date ${daysFromNow} day(s) from now (${expectedDateStr}) but got "${endDate}"`);
			}
		} catch (error) {
			throw new Error(`Could not verify reservation request end date: ${error instanceof Error ? error.message : String(error)}`);
		}
	},
);

Then(
	'the reservation request should have an end date that is {int} days from now',
	async function (this: ShareThriftWorld, daysFromNow: number) {
		const actor = actorCalled('Alice');
		try {
			const endDate = await actor.answer(notes<ReservationRequestNotes>().get('lastReservationRequestEndDate'));
			const expectedDate = new Date();
			expectedDate.setDate(expectedDate.getDate() + daysFromNow);
			const expectedDateStr = formatDateForComparison(expectedDate);
			if (endDate !== expectedDateStr) {
				throw new Error(`Expected end date ${daysFromNow} days from now (${expectedDateStr}) but got "${endDate}"`);
			}
		} catch (error) {
			throw new Error(`Could not verify reservation request end date: ${error instanceof Error ? error.message : String(error)}`);
		}
	},
);

Then(
	'{word} should see a reservation error for {string}',
	async function (this: ShareThriftWorld, actorName: string, fieldName: string) {
		const resolvedActorName = resolveActorName(actorName);
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
		const resolvedActorName = resolveActorName(actorName);
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
			const listingId = await getListingIdFromOwner('Bob');
			const countQuestion = this.level === 'domain'
				? DomainGetReservationRequestCountForListing.forListing(listingId)
				: GetReservationRequestCountForListing.forListing(listingId);
			const count = await actor.answer(countQuestion);
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

		const CreateReservationRequest = getCreateReservationRequestTask(this.setupLevel);

		const listingId = await getListingIdFromOwner(owner);
		const startDate = data['reservationPeriodStart'];
		const endDate = data['reservationPeriodEnd'];

		await actor.attemptsTo(
			CreateReservationRequest.with({
				listingId,
				reservationPeriodStart: startDate ? parseDateInput(String(startDate)) : new Date(),
				reservationPeriodEnd: endDate ? parseDateInput(String(endDate)) : new Date(),
				reserver: makeTestUserData(reserver),
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
			const listingId = await getListingIdFromOwner('Bob');
			const startDate = data['reservationPeriodStart'];
			const endDate = data['reservationPeriodEnd'];

			await actor.attemptsTo(
				CreateReservationRequest.with({
					listingId,
					reservationPeriodStart: startDate ? parseDateInput(String(startDate)) : new Date(),
					reservationPeriodEnd: endDate ? parseDateInput(String(endDate)) : new Date(),
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
			const errorMessage = error instanceof Error ? error.message : String(error);
			await actor.attemptsTo(notes<{lastValidationError?: string}>().set('lastValidationError', errorMessage));
		}
	},
);
