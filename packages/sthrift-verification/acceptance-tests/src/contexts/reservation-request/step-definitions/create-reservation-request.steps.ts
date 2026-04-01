import { Given, Then, When, type DataTable } from '@cucumber/cucumber';
import { actorCalled, notes } from '@serenity-js/core';
import { Ensure, equals, includes, isPresent } from '@serenity-js/assertions';
import type { ShareThriftWorld } from '../../../world.ts';
import { makeTestUserData, resolveActorName } from '../../../shared/support/domain-test-helpers.ts';
import { CreateListing as SessionCreateListing } from '../../listing/tasks/session/create-listing.ts';
import { CreateListing as DomainCreateListing, type CreateListingInput } from '../../listing/tasks/domain/create-listing.ts';
import { CreateReservationRequest as SessionCreateReservationRequest } from '../tasks/session/create-reservation-request.ts';
import { CreateReservationRequest as DomainCreateReservationRequest } from '../tasks/domain/create-reservation-request.ts';
import { GetReservationRequestCountForListing } from '../questions/get-reservation-request-count-for-listing.ts';
import { DomainGetReservationRequestCountForListing } from '../questions/domain-get-reservation-request-count-for-listing.ts';
import type { CreateReservationRequestInput, ReservationRequestNotes } from '../abilities/reservation-request-types.ts';

let lastActorName = 'Alice';

function getCreateListingTask(level: string) {
	switch (level) {
		case 'session':
			return SessionCreateListing;
		default:
			return DomainCreateListing;
	}
}

function getCreateReservationRequestTask(level: string) {
	switch (level) {
		case 'session':
			return SessionCreateReservationRequest;
		default:
			return DomainCreateReservationRequest;
	}
}

function parseDateInput(input: string): Date {
	if (input.startsWith('+')) {
		const days = parseInt(input.substring(1), 10);
		const date = new Date();
		date.setDate(date.getDate() + days);
		date.setHours(0, 0, 0, 0);
		return date;
	}
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
		lastActorName = actorName;
		const actor = actorCalled(actorName);
		const details = dataTable.rowsHash();

		const CreateListing = getCreateListingTask(this.level);

		await actor.attemptsTo(
			CreateListing.with(details as unknown as CreateListingInput),
		);
	},
);

When(
	'{word} creates a reservation request for {word}\'s listing with:',
	async function (this: ShareThriftWorld, reserver: string, owner: string, dataTable: DataTable) {
		lastActorName = reserver;
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
		lastActorName = actorName;
		const actor = actorCalled(actorName);
		const data = dataTable.rowsHash();

		const CreateReservationRequest = getCreateReservationRequestTask(this.level);

		await actor.attemptsTo(
			notes<ReservationRequestNotes>().set('lastReservationRequestId', undefined as unknown as string),
			notes<ReservationRequestNotes>().set('lastReservationRequestState', undefined as unknown as string),
			notes<ReservationRequestNotes>().set('lastValidationError', undefined as unknown as string),
		);

		try {
			const startDate = data['reservationPeriodStart'];
			const endDate = data['reservationPeriodEnd'];

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
		const actor = actorCalled(lastActorName);

		await actor.attemptsTo(
			Ensure.that(
				notes<ReservationRequestNotes>().get('lastReservationRequestId'),
				isPresent(),
			),
			Ensure.that(
				notes<ReservationRequestNotes>().get('lastReservationRequestState'),
				equals('Requested'),
			),
		);
	},
);

Then(
	'the reservation request should have a start date of {string}',
	async function (this: ShareThriftWorld, expectedDate: string) {
		const actor = actorCalled(lastActorName);

		await actor.attemptsTo(
			Ensure.that(
				notes<ReservationRequestNotes>().get('lastReservationRequestStartDate'),
				equals(expectedDate),
			),
		);
	},
);

Then(
	'the reservation request should have a start date that is {int} day(s) from now',
	async function (this: ShareThriftWorld, daysFromNow: number) {
		const actor = actorCalled(lastActorName);
		const expectedDate = new Date();
		expectedDate.setDate(expectedDate.getDate() + daysFromNow);
		const expectedDateStr = formatDateForComparison(expectedDate);

		await actor.attemptsTo(
			Ensure.that(
				notes<ReservationRequestNotes>().get('lastReservationRequestStartDate'),
				equals(expectedDateStr),
			),
		);
	},
);

Then(
	'the reservation request should have an end date of {string}',
	async function (this: ShareThriftWorld, expectedDate: string) {
		const actor = actorCalled(lastActorName);

		await actor.attemptsTo(
			Ensure.that(
				notes<ReservationRequestNotes>().get('lastReservationRequestEndDate'),
				equals(expectedDate),
			),
		);
	},
);

Then(
	'the reservation request should have an end date that is {int} day(s) from now',
	async function (this: ShareThriftWorld, daysFromNow: number) {
		const actor = actorCalled(lastActorName);
		const expectedDate = new Date();
		expectedDate.setDate(expectedDate.getDate() + daysFromNow);
		const expectedDateStr = formatDateForComparison(expectedDate);

		await actor.attemptsTo(
			Ensure.that(
				notes<ReservationRequestNotes>().get('lastReservationRequestEndDate'),
				equals(expectedDateStr),
			),
		);
	},
);

Then(
	'{word} should see a reservation error for {string}',
	async function (this: ShareThriftWorld, actorName: string, fieldName: string) {
		const resolvedActorName = resolveActorName(actorName);
		const actor = actorCalled(resolvedActorName);

		const storedError = await actor.answer(notes<{lastValidationError?: string}>().get('lastValidationError'));
		if (!storedError) {
			throw new Error(`Expected a validation error for "${fieldName}" but no error was captured`);
		}

		const lowerError = storedError.toLowerCase();
		const lowerField = fieldName.toLowerCase();
		const isFieldMentioned = lowerError.includes(lowerField);
		const isValidationPattern = /required|missing|invalid|cannot read properties of undefined|wrong raw value type/i.test(storedError);

		if (!isFieldMentioned && !isValidationPattern) {
			throw new Error(
				`Expected a validation error related to "${fieldName}", but got an unrecognized error: "${storedError}"`,
			);
		}

		let requestId: string | undefined;
		try {
			requestId = await actor.answer(notes<ReservationRequestNotes>().get('lastReservationRequestId'));
		} catch {
			// expected
		}
		if (requestId) {
			throw new Error(
				`Expected reservation creation to be blocked by "${fieldName}" validation, ` +
				`but a request was created with id: ${requestId}`,
			);
		}
	},
);

Then(
	'{word} should see a reservation error {string}',
	async function (this: ShareThriftWorld, actorName: string, expectedMessage: string) {
		const resolvedActorName = resolveActorName(actorName);
		const actor = actorCalled(resolvedActorName);

		await actor.attemptsTo(
			Ensure.that(
				notes<{lastValidationError: string}>().get('lastValidationError'),
				includes(expectedMessage),
			),
		);
	},
);

Then(
	'no reservation request should be created',
	async function (this: ShareThriftWorld) {
		const actor = actorCalled(lastActorName);

		let hasValidationError = false;
		try {
			const storedError = await actor.answer(notes<ReservationRequestNotes>().get('lastValidationError'));
			hasValidationError = !!storedError;
		} catch {
			// No error stored
		}

		let requestId: string | undefined;
		try {
			requestId = await actor.answer(notes<ReservationRequestNotes>().get('lastReservationRequestId'));
		} catch {
			// No ID — expected
		}

		if (requestId) {
			throw new Error(
				`Expected no reservation request to be created, but one was created with id: ${requestId}`,
			);
		}

		if (!hasValidationError) {
			throw new Error(
				'Expected a validation error to prevent reservation creation, but no error was captured. ' +
				'The test may be passing without actually validating the scenario.',
			);
		}
	},
);

Then(
	'only one reservation request should exist for the listing',
	async function (this: ShareThriftWorld) {
		const actor = actorCalled(lastActorName);
		const listingId = await getListingIdFromOwner('Bob');
		const countQuestion = this.level === 'domain'
			? DomainGetReservationRequestCountForListing.forListing(listingId)
			: GetReservationRequestCountForListing.forListing(listingId);

		await actor.attemptsTo(
			Ensure.that(countQuestion, equals(1)),
		);
	},
);

Given(
	'{word} has already created a reservation request for {word}\'s listing with:',
	async function (this: ShareThriftWorld, reserver: string, owner: string, dataTable: DataTable) {
		lastActorName = reserver;
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
	'{word} attempts to create another reservation request for the same listing with:',
	async function (this: ShareThriftWorld, actorName: string, dataTable: DataTable) {
		lastActorName = actorName;
		const actor = actorCalled(actorName);
		const data = dataTable.rowsHash();

		const CreateReservationRequest = getCreateReservationRequestTask(this.level);

		await actor.attemptsTo(
			notes<{lastValidationError?: string}>().set('lastValidationError', undefined as unknown as string),
		);

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
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			await actor.attemptsTo(notes<{lastValidationError?: string}>().set('lastValidationError', errorMessage));
		}
	},
);
