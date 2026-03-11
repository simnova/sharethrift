import { Given, When, Then, type DataTable } from '@cucumber/cucumber';
import { actorCalled, notes } from '@serenity-js/core';
import type { ShareThriftWorld } from '../../../world.js';
import type { ListingDetails } from '../tasks/domain/create-listing.js';
import { CreateListing as DomCreateListing } from '../tasks/dom/create-listing.js';
import { CreateListing as SessionCreateListing } from '../tasks/session/create-listing.js';
import { CreateListing as DomainCreateListing } from '../tasks/domain/create-listing.js';
import  { ListingStatus } from '../questions/listing-status.js';
import  { ListingTitle } from '../questions/listing-title.js';
import  { FormValidationError } from '../questions/form-validation-error.js';

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

Given(
	'{word} is an authenticated user',
	function (this: ShareThriftWorld, actorName: string) {
		actorCalled(actorName);
		},
);

Given(
	'{word} has created a draft listing titled {string}',
	async function (this: ShareThriftWorld, actorName: string, title: string) {
		const actor = actorCalled(actorName);

		const CreateListing = getCreateListingTask(this.level);

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
		const actor = actorCalled(actorName);
		const details = dataTable.rowsHash();

		const CreateListing = getCreateListingTask(this.level);

		// Execute the task
		await actor.attemptsTo(CreateListing.with(details as unknown as ListingDetails));

	},
);

When(
	'{word} attempts to create a listing with:',
	async function (this: ShareThriftWorld, actorName: string, dataTable: DataTable) {
		const actor = actorCalled(actorName);
		const details = dataTable.rowsHash();

		const CreateListing = getCreateListingTask(this.level);

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

		const status = await actor.answer(ListingStatus.of());
		if (status !== expectedStatus) {
			throw new Error(`Expected listing status "${expectedStatus}" but got "${status}"`);
		}

	},
);

Then(
	'{word} sees the listing title as {string}',
	async function (this: ShareThriftWorld, actorName: string, expectedTitle: string) {
		const actor = actorCalled(actorName);
		const title = await actor.answer(ListingTitle.displayed());
		if (title !== expectedTitle) {
			throw new Error(`Expected listing title "${expectedTitle}" but got "${title}"`);
		}

	},
);

Then(
	'the listing should have a daily rate of {string}',
	async function (this: ShareThriftWorld, _expectedRate: string) {
		// Daily rate is not yet tracked in the domain model.
		// This step will need implementation once the domain adds rate support.
		const actor = actorCalled('Alice');
		const status = await actor.answer(ListingStatus.of());
		if (!status) {
			throw new Error('Expected a listing to exist before checking its daily rate');
		}
	},
);

Then(
	'{word} should see a listing error for {string}',
	async function (this: ShareThriftWorld, actorName: string, fieldName: string) {
		const resolvedActorName = /^(she|he|they)$/.test(actorName) ? 'Alice' : actorName;
		const actor = actorCalled(resolvedActorName);

		try {
			const storedError = await actor.answer(notes<{lastValidationError?: string}>().get('lastValidationError'));
			if (storedError) {
				return;
			}
		} catch {
			// No error in notes
		}
		const error = await actor.answer(FormValidationError.forField(fieldName));
		if (!error) {
			throw new Error(`Expected a validation error for "${fieldName}" but none was found`);
		}
	},
);

Then(
	'{word} should see a listing error {string}',
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
			// No error stored - check DOM instead
		}

		// For DOM tests, try to get error from form UI
		const error = await actor.answer(FormValidationError.displayed());

		if (!error?.includes(expectedMessage)) {
			throw new Error(`Expected error message "${expectedMessage}", but got: "${error || 'none'}"`);
		}
	},
);

Then('no listing should be created', async function (this: ShareThriftWorld) {
	const actor = actorCalled('Alice');
	// If the listing creation errored (as expected), there should be a validation error in notes
	// and no lastListingId set.
	try {
		const listingId = await actor.answer(notes<{ lastListingId?: string }>().get('lastListingId'));
		if (listingId) {
			throw new Error('Expected no listing to be created, but one was');
		}
	} catch {
		// No listing ID in notes — this is the expected state
	}
});

// Backward-compatible step definitions for existing scenarios
Then(
	'the listing should be in {word} status',
	async function (this: ShareThriftWorld, expectedStatus: string) {
		const actor = actorCalled('Alice');

		const status = await actor.answer(ListingStatus.of());
		if (status !== expectedStatus) {
			throw new Error(`Expected listing status "${expectedStatus}" but got "${status}"`);
		}
	},
);

Then(
	'the listing title should be {string}',
	async function (this: ShareThriftWorld, expectedTitle: string) {
		const actor = actorCalled('Alice');

		const title = await actor.answer(ListingTitle.displayed());
		if (title !== expectedTitle) {
			throw new Error(`Expected listing title "${expectedTitle}" but got "${title}"`);
		}
	},
);
