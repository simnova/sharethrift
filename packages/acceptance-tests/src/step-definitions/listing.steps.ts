import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import type { IWorld } from '@cucumber/cucumber';
import type { ShareThriftWorld } from '../support/world.js';

/**
 * Step definitions for listing-related scenarios.
 *
 * These steps work across all testing levels (domain/graphql/dom)
 * by dynamically loading the appropriate task implementations.
 */

Given('{word} is an authenticated user', async function (this: IWorld, actorName: string) {
	const world = this as unknown as ShareThriftWorld;

	// TODO: Setup authentication based on testing level
	// Domain: Mock authenticated passport
	// GraphQL: Obtain auth token
	// DOM: Login through UI
	
	// Store actor name for later use
	(this as any).currentActor = actorName;
});

Given(
	'{word} has created a draft listing titled {string}',
	async function (this: IWorld, actorName: string, title: string) {
		const world = this as unknown as ShareThriftWorld;

		// Import task from correct level
		const taskLevel = world.level;
		const { CreateListing } = await import(`../tasks/${taskLevel}/CreateListing.js`);

		// Execute the task directly
		await CreateListing.with({
			title,
			description: 'Test listing',
			category: 'Other',
			location: 'Test Location',
		});
		
		// Store for later assertions
		(this as any).lastListing = { title };
	},
);

When(
	'{word} creates a listing with:',
	async function (this: IWorld, actorName: string, dataTable: DataTable) {
		const world = this as unknown as ShareThriftWorld;

		const details = dataTable.rowsHash();

		// Import task from correct level
		const taskLevel = world.level;
		const { CreateListing } = await import(`../tasks/${taskLevel}/CreateListing.js`);

		// Execute the task directly
		await CreateListing.with(details as any);
		
		// Store for later assertions
		(this as any).lastListing = details;
	},
);

When(
	'{word} attempts to create a listing with:',
	async function (this: IWorld, actorName: string, dataTable: DataTable) {
		const world = this as unknown as ShareThriftWorld;

		const details = dataTable.rowsHash();

		// Import task from correct level
		const taskLevel = world.level;
		const { CreateListing } = await import(`../tasks/${taskLevel}/CreateListing.js`);

		try {
			await CreateListing.with(details as any);
		} catch (error) {
			// Store error for validation in Then steps
			(this as any).lastError = error;
		}
	},
);

When('{word} publishes the listing', async function (this: IWorld, actorName: string) {
	const world = this as unknown as ShareThriftWorld;
	const taskLevel = world.level;
	const { PublishListing } = await import(`../tasks/${taskLevel}/PublishListing.js`);
	
	const lastListing = (this as any).lastListing;
	await PublishListing.for(lastListing?.title);
});

Then('the listing should be in {word} status', async function (this: IWorld, expectedStatus: string) {
	const world = this as unknown as ShareThriftWorld;
	const taskLevel = world.level;
	
	if (taskLevel === 'domain') {
		// For domain level, check the in-memory listing status
		const { CreateListing } = await import(`../tasks/${taskLevel}/CreateListing.js`);
		const listing = CreateListing.getLastListing();
		
		if (!listing) {
			throw new Error('No listing found');
		}
		
		if (listing.status !== expectedStatus) {
			throw new Error(`Expected status ${expectedStatus} but got ${listing.status}`);
		}
	} else {
		// For other levels, status verification is TODO
		console.log(`Status check (${taskLevel}): expecting ${expectedStatus}`);
	}
});

Then(
	'the listing title should be {string}',
	async function (this: IWorld, expectedTitle: string) {
		const lastListing = (this as any).lastListing;
		if (lastListing?.title !== expectedTitle) {
			throw new Error(`Expected title "${expectedTitle}" but got "${lastListing?.title}"`);
		}
	},
);

Then(
	'the listing should have a daily rate of {string}',
	async function (this: IWorld, expectedRate: string) {
		// TODO: Implement daily rate verification
	},
);

Then(
	'the listing should be visible in search results',
	async function (this: IWorld) {
		// TODO: Implement SearchResults question
	},
);

Then(
	'{word} should see a validation error for {string}',
	async function (this: IWorld, actorName: string, fieldName: string) {
		const error = (this as any).lastError;
		if (!error) {
			throw new Error('Expected a validation error but none was thrown');
		}
		
		const errorMessage = error.message || String(error);
		if (!errorMessage.toLowerCase().includes(fieldName.toLowerCase())) {
			throw new Error(`Expected error message to mention "${fieldName}", but got: ${errorMessage}`);
		}
	},
);

Then(
	'{word} should see a validation error {string}',
	async function (this: IWorld, actorName: string, expectedMessage: string) {
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

Then('no listing should be created', async function (this: IWorld) {
	// TODO: Verify no listing was created
});
