import { type DataTable, Given, Then, When } from '@cucumber/cucumber';
import { actorCalled, actorInTheSpotlight } from '@serenity-js/core';
import { Ensure, isTrue } from '@serenity-js/assertions';
import { CreateListingAbility } from '../screenplay/abilities/index.ts';
import { ListingWasCreated, ListingIsDraft } from '../screenplay/questions/index.ts';
import '../support/setup.ts'; // Import setup to configure Serenity

Given('I am a personal user', function () {
	// Set up actor with abilities (configured in setup.ts)
	actorCalled('PersonalUser');
});

When(
	'I create a draft listing with the following details:',
	async function (dataTable: DataTable) {
		const rows = dataTable.rowsHash();

		const params = {
			title: rows.title,
			description: rows.description,
			category: rows.category,
			location: rows.location,
		};

		// Use the ability directly for now (simplified approach)
		const actor = actorInTheSpotlight();
		const ability = CreateListingAbility.as(actor);
		await ability.createDraftListing(params);
	},
);

Then('the listing should be created successfully', async function () {
	// Verify listing was created using Serenity assertions
	await actorInTheSpotlight().attemptsTo(
		Ensure.that(ListingWasCreated(), isTrue()),
	);
});

Then('the listing should be in draft state', async function () {
	// Verify listing is in draft state
	await actorInTheSpotlight().attemptsTo(Ensure.that(ListingIsDraft(), isTrue()));
});
