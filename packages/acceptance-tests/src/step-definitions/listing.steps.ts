import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { actorCalled, notes } from '@serenity-js/core';
import type { ShareThriftWorld } from '../support/world.js';
import type { ListingDetails } from '../tasks/domain/create-listing.js';

/**
 * Step definitions for listing-related scenarios.
 *
 * These steps work across all testing levels (domain/graphql/dom)
 * by using the dynamically loaded task implementations.
 */

Given(
	'{word} is an authenticated user',
	function (this: ShareThriftWorld, actorName: string) {
		// Get the actor from the cast - this will be configured with the right abilities
		// Authentication is set up in world.ts based on testing level:
		// - Domain: Mock authenticated passport (configured in domain tasks)
		// - GraphQL: AuthenticateUser ability with JWT token from mock OAuth2 server
		// - DOM: Login through UI (future implementation)
		// For GraphQL level, the actor already has AuthenticateUser ability
		// which will be used automatically by CallAnApi when making requests
		actorCalled(actorName);
	},
);

Given(
	'{word} has created a draft listing titled {string}',
	async function (this: ShareThriftWorld, actorName: string, title: string) {
		const actor = actorCalled(actorName);

		// Import task from correct level based on world configuration
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
		const { ListingStatus } = await import('../questions/listing-status.js');

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
		const { ListingTitle } = await import('../questions/listing-title.js');

		const title = await actor.answer(ListingTitle.displayed());
		if (title !== expectedTitle) {
			throw new Error(`Expected listing title "${expectedTitle}" but got "${title}"`);
		}
	},
);

Then(
	'the listing should have a daily rate of {string}',
	function (this: ShareThriftWorld, expectedRate: string) {
		// TODO: Implement daily rate verification question
		console.log(`TODO: Verify daily rate is ${expectedRate}`);
	},
);

Then(
	'the listing should be visible in search results',
	function (this: ShareThriftWorld) {
		// TODO: Implement SearchResults question
		console.log('TODO: Verify listing is visible in search results');
	},
);

Then(
	'{word} should see a validation error for {string}',
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
		const { FormValidationError } = await import('../questions/form-validation-error.js');
		const error = await actor.answer(FormValidationError.forField(fieldName));
		if (!error) {
			throw new Error(`Expected a validation error for "${fieldName}" but none was found`);
		}
	},
);

Then(
	'{word} should see a validation error {string}',
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
		const { FormValidationError } = await import('../questions/form-validation-error.js');
		const error = await actor.answer(FormValidationError.displayed());

		if (!error || !error.includes(expectedMessage)) {
			throw new Error(`Expected error message "${expectedMessage}", but got: "${error || 'none'}"`);
		}
	},
);

Then('no listing should be created', function (this: ShareThriftWorld) {
	// TODO: Verify no listing was created
	console.log('TODO: Verify no listing was created');
});

// Backward-compatible step definitions for existing scenarios
Then(
	'the listing should be in {word} status',
	async function (this: ShareThriftWorld, expectedStatus: string) {
		const actor = actorCalled('Alice');
		const { ListingStatus } = await import('../questions/listing-status.js');

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
		const { ListingTitle } = await import('../questions/listing-title.js');

		const title = await actor.answer(ListingTitle.displayed());
		if (title !== expectedTitle) {
			throw new Error(`Expected listing title "${expectedTitle}" but got "${title}"`);
		}
	},
);
