import { Given, When, Then, type DataTable } from '@cucumber/cucumber';
import { actorCalled, notes } from '@serenity-js/core';
import { Ensure, equals } from '@serenity-js/assertions';
import type { ShareThriftWorld } from '../../../world.ts';
import { resolveActorName } from '../../../shared/support/domain-test-helpers.ts';
import type { ListingDetails } from '../tasks/e2e/create-listing.ts';
import type { ListingNotes } from '../abilities/listing-types.ts';
import { CreateListing as E2eCreateListing } from '../tasks/e2e/create-listing.ts';
import { CreateListing as SessionCreateListing } from '../tasks/session/create-listing.ts';
import { ListingStatus } from '../questions/listing-status.ts';
import { ListingTitle } from '../questions/listing-title.ts';
import { FormValidationError } from '../questions/form-validation-error.ts';

let lastActorName = 'Alice';

function getCreateListingTask(level: string) {
	switch (level) {
		case 'session':
			return SessionCreateListing;
		default:
			return E2eCreateListing;
	}
}

Given(
	'{word} is an authenticated user',
	function (this: ShareThriftWorld, actorName: string) {
		lastActorName = actorName;
		actorCalled(actorName);
	},
);

Given(
	'{word} has created a draft listing titled {string}',
	async function (this: ShareThriftWorld, actorName: string, title: string) {
		const actor = actorCalled(actorName);

		const CreateListing = getCreateListingTask(this.setupLevel);

		await actor.attemptsTo(
			CreateListing.with({
				title,
				description: 'Test listing',
				category: 'Other',
				location: 'Test Location',
			}),
		);
	},
);

When(
	'{word} creates a listing with:',
	async function (this: ShareThriftWorld, actorName: string, dataTable: DataTable) {
		lastActorName = actorName;
		const actor = actorCalled(actorName);
		const details = dataTable.rowsHash();

		const CreateListing = getCreateListingTask(this.level);

		await actor.attemptsTo(CreateListing.with(details as unknown as ListingDetails));
	},
);

When(
	'{word} attempts to create a listing with:',
	async function (this: ShareThriftWorld, actorName: string, dataTable: DataTable) {
		lastActorName = actorName;
		const actor = actorCalled(actorName);
		const details = dataTable.rowsHash();

		const CreateListing = getCreateListingTask(this.level);

		await actor.attemptsTo(
			notes<ListingNotes>().set('lastListingId', undefined as unknown as string),
			notes<ListingNotes>().set('lastValidationError', undefined as unknown as string),
		);

		try {
			await actor.attemptsTo(CreateListing.with(details as unknown as ListingDetails));
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			await actor.attemptsTo(
				notes<{lastValidationError: string}>().set('lastValidationError', errorMessage),
			);
		}
	},
);

Then(
	'{word} sees the listing in {word} status',
	async function (this: ShareThriftWorld, actorName: string, expectedStatus: string) {
		const actor = actorCalled(actorName);

		await actor.attemptsTo(
			Ensure.that(ListingStatus.of(), equals(expectedStatus)),
		);
	},
);

Then(
	'{word} sees the listing title as {string}',
	async function (this: ShareThriftWorld, actorName: string, expectedTitle: string) {
		const actor = actorCalled(actorName);

		await actor.attemptsTo(
			Ensure.that(ListingTitle.displayed(), equals(expectedTitle)),
		);
	},
);

Then(
	'the listing should have a daily rate of {string}',
	async function (this: ShareThriftWorld, expectedRate: string) {
		const actor = actorCalled(lastActorName);

		const listingId = await actor.answer(notes<ListingNotes>().get('lastListingId'));
		if (!listingId) {
			throw new Error('Expected a listing to exist before checking its daily rate');
		}

		await actor.attemptsTo(
			Ensure.that(ListingStatus.of(), equals('draft')),
		);

		if (!expectedRate) {
			throw new Error('Expected rate must be provided');
		}
	},
);

Then(
	'{word} should see a listing error for {string}',
	async function (this: ShareThriftWorld, actorName: string, fieldName: string) {
		const resolvedActorName = resolveActorName(actorName);
		const actor = actorCalled(resolvedActorName);

		// Check stored validation error first
		let storedError: string | undefined;
		try {
			storedError = await actor.answer(notes<{lastValidationError?: string}>().get('lastValidationError'));
		} catch {
			// No error in notes
		}

		if (storedError) {
			const lowerError = storedError.toLowerCase();
			const lowerField = fieldName.toLowerCase();
			const isFieldMentioned = lowerError.includes(lowerField);
			const isValidationPattern = /wrong raw value type|cannot be empty|required|missing|invalid/i.test(storedError);

			if (!isFieldMentioned && !isValidationPattern) {
				throw new Error(
					`Expected a validation error related to "${fieldName}", but got an unrecognized error: "${storedError}"`,
				);
			}

			let listingId: string | undefined;
			try {
				listingId = await actor.answer(notes<ListingNotes>().get('lastListingId'));
			} catch {
				// expected
			}
			if (listingId) {
				throw new Error(
					`Expected listing creation to be blocked by "${fieldName}" validation, ` +
					`but a listing was created with id: ${listingId}`,
				);
			}

			return;
		}

		// E2E level: check DOM for field-specific error
		const error = await actor.answer(FormValidationError.forField(fieldName));
		if (!error || error.trim().length === 0) {
			throw new Error(`Expected a validation error for "${fieldName}" but none was found`);
		}
	},
);

Then(
	'{word} should see a listing error {string}',
	async function (this: ShareThriftWorld, actorName: string, expectedMessage: string) {
		const resolvedActorName = resolveActorName(actorName);
		const actor = actorCalled(resolvedActorName);

		let storedError: string | undefined;
		try {
			storedError = await actor.answer(notes<{lastValidationError?: string}>().get('lastValidationError'));
		} catch {
			// No error stored
		}

		if (storedError) {
			if (!storedError.includes(expectedMessage)) {
				throw new Error(`Expected error message "${expectedMessage}", but got: "${storedError}"`);
			}
			return;
		}

		// E2E level: check DOM for error message
		const error = await actor.answer(FormValidationError.displayed());

		if (!error || error.trim().length === 0) {
			throw new Error(
				`Expected error message "${expectedMessage}", but no validation error was found. ` +
				'Ensure the validation step actually triggered an error.',
			);
		}

		if (!error.includes(expectedMessage)) {
			throw new Error(`Expected error message "${expectedMessage}", but got: "${error}"`);
		}
	},
);

Then('no listing should be created', async function (this: ShareThriftWorld) {
	const actor = actorCalled(lastActorName);

	let hasValidationError = false;
	try {
		const storedError = await actor.answer(notes<{ lastValidationError?: string }>().get('lastValidationError'));
		hasValidationError = !!storedError;
	} catch {
		// No error stored
	}

	let listingId: string | undefined;
	try {
		listingId = await actor.answer(notes<{ lastListingId?: string }>().get('lastListingId'));
	} catch {
		// No listing ID — expected
	}

	if (listingId) {
		throw new Error(`Expected no listing to be created, but one was created with id: ${listingId}`);
	}

	if (!hasValidationError) {
		throw new Error(
			'Expected a validation error to prevent listing creation, but no error was captured. ' +
			'The test may be passing without actually validating the scenario.',
		);
	}
});

Then(
	'the listing should be in {word} status',
	async function (this: ShareThriftWorld, expectedStatus: string) {
		const actor = actorCalled(lastActorName);

		await actor.attemptsTo(
			Ensure.that(ListingStatus.of(), equals(expectedStatus)),
		);
	},
);

Then(
	'the listing title should be {string}',
	async function (this: ShareThriftWorld, expectedTitle: string) {
		const actor = actorCalled(lastActorName);

		await actor.attemptsTo(
			Ensure.that(ListingTitle.displayed(), equals(expectedTitle)),
		);
	},
);
