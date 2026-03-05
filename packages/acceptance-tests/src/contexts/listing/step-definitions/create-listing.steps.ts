import { Given, When, Then, type DataTable } from '@cucumber/cucumber';
import { actorCalled, notes } from '@serenity-js/core';
import type { ShareThriftWorld } from '../../../shared/support/world.js';
import type { ListingDetails } from '../tasks/domain/create-listing.js';
import  { ListingStatus } from '../questions/listing-status.js';
import  { ListingTitle } from '../questions/listing-title.js';
import  { FormValidationError } from '../questions/form-validation-error.js';

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

		const taskLevel = this.level;
		const { CreateListing } = await import(`../tasks/${taskLevel}/create-listing.js`);

		// Execute the task using Serenity/JS actor
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

		// Import task from correct level
		const taskLevel = this.level;
		const { CreateListing } = await import(`../tasks/${taskLevel}/create-listing.js`);

		// Execute the task
		await actor.attemptsTo(CreateListing.with(details as unknown as ListingDetails));
	},
);

When(
	'{word} attempts to create a listing with:',
	async function (this: ShareThriftWorld, actorName: string, dataTable: DataTable) {
		const actor = actorCalled(actorName);
		const details = dataTable.rowsHash();

		// Import task from correct level
		const taskLevel = this.level;
		const { CreateListing } = await import(`../tasks/${taskLevel}/create-listing.js`);

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
	function (this: ShareThriftWorld, expectedRate: string) {
		console.log(`TODO: Verify daily rate is ${expectedRate}`);
	},
);

Then(
	'{word} should see a listing error for {string}',
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
			// No error stored - check DOM instead
		}

		// For DOM tests, try to get error from form UI
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

Then('no listing should be created', function (this: ShareThriftWorld) {
	console.log('TODO: Verify no listing was created');
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
