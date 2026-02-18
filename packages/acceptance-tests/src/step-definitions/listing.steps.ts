import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { actorCalled } from '@serenity-js/core';
import { Ensure, equals } from '@serenity-js/assertions';
import type { ShareThriftWorld } from '../support/world.js';

/**
 * Step definitions for listing-related scenarios.
 *
 * These steps work across all testing levels (domain/graphql/dom)
 * by using the dynamically loaded task implementations.
 */

Given('{word} is an authenticated user', async function (this: ShareThriftWorld, actorName: string) {
	// Get the actor from the cast - this will be configured with the right abilities
	const actor = actorCalled(actorName);

	// TODO: Add authentication setup based on testing level
	// Domain: Mock authenticated passport
	// GraphQL: Obtain auth token
	// DOM: Login through UI
});

Given(
	'{word} has created a draft listing titled {string}',
	async function (this: ShareThriftWorld, actorName: string, title: string) {
		const actor = actorCalled(actorName);

		// Import task from correct level based on world configuration
		const taskLevel = this.level;
		const { CreateListing } = await import(`../tasks/${taskLevel}/CreateListing.js`);

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
		const { CreateListing } = await import(`../tasks/${taskLevel}/CreateListing.js`);

		// Execute the task
		await actor.attemptsTo(CreateListing.with(details as any));
	},
);

When(
	'{word} attempts to create a listing with:',
	async function (this: ShareThriftWorld, actorName: string, dataTable: DataTable) {
		const actor = actorCalled(actorName);
		const details = dataTable.rowsHash();

		// Import task from correct level
		const taskLevel = this.level;
		const { CreateListing } = await import(`../tasks/${taskLevel}/CreateListing.js`);

		try {
			// Execute the task - validation errors will be thrown
			await actor.attemptsTo(CreateListing.with(details as any));
		} catch (error) {
			// Store error for validation in Then steps
			(this as any).lastError = error;
		}
	},
);

When('{word} publishes the listing', async function (this: ShareThriftWorld, actorName: string) {
	const actor = actorCalled(actorName);
	const taskLevel = this.level;
	const { PublishListing } = await import(`../tasks/${taskLevel}/PublishListing.js`);

	await actor.attemptsTo(PublishListing.justCreated());
});

Then(
	'the listing should be in {word} status',
	async function (this: ShareThriftWorld, expectedStatus: string) {
		// Import the question from the questions directory
		const { ListingStatus } = await import('../questions/ListingStatus.js');

		// Use the same actor that performed the previous steps
		const actor = actorCalled('Alice');
		
		// Use Serenity/JS assertions
		await actor.attemptsTo(Ensure.that(ListingStatus.of(), equals(expectedStatus)));
	},
);

Then(
	'the listing title should be {string}',
	async function (this: ShareThriftWorld, expectedTitle: string) {
		const actor = actorCalled('Alice');

		const { ListingTitle } = await import('../questions/ListingTitle.js');

		await actor.attemptsTo(Ensure.that(ListingTitle.displayed(), equals(expectedTitle)));
	},
);

Then(
	'the listing should have a daily rate of {string}',
	async function (this: ShareThriftWorld, expectedRate: string) {
		// TODO: Implement daily rate verification question
		console.log(`TODO: Verify daily rate is ${expectedRate}`);
	},
);

Then(
	'the listing should be visible in search results',
	async function (this: ShareThriftWorld) {
		// TODO: Implement SearchResults question
		console.log('TODO: Verify listing is visible in search results');
	},
);

Then(
	'{word} should see a validation error for {string}',
	async function (this: ShareThriftWorld, actorName: string, fieldName: string) {
		const error = (this as any).lastError;
		if (!error) {
			throw new Error('Expected a validation error but none was thrown');
		}

		const errorMessage = error.message || String(error);
		if (!errorMessage.toLowerCase().includes(fieldName.toLowerCase())) {
			throw new Error(
				`Expected error message to mention "${fieldName}", but got: ${errorMessage}`,
			);
		}
	},
);

Then(
	'{word} should see a validation error {string}',
	async function (this: ShareThriftWorld, actorName: string, expectedMessage: string) {
		const error = (this as any).lastError;
		if (!error) {
			throw new Error('Expected a validation error but none was thrown');
		}

		const errorMessage = error.message || String(error);
		if (!errorMessage.includes(expectedMessage)) {
			throw new Error(`Expected error message "${expectedMessage}", but got: ${errorMessage}`);
		}
	},
);

Then('no listing should be created', async function (this: ShareThriftWorld) {
	// TODO: Verify no listing was created
	console.log('TODO: Verify no listing was created');
});
