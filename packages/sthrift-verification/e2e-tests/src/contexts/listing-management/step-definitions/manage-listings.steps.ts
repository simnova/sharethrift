import { Then, When } from '@cucumber/cucumber';
import { Ensure, equals } from '@serenity-js/assertions';
import { actorCalled } from '@serenity-js/core';
import type { ShareThriftWorld } from '../../../world.ts';
import { CreateListingForm, IncomingRequestsTab, ListingsDashboard } from '../questions/listing-management-content.ts';
import { OpenListingDashboard, StartCreatingListing, ViewIncomingRequests } from '../tasks/manage-listings.ts';

When('{word} starts a new listing', async function (this: ShareThriftWorld, name: string) {
	await actorCalled(name).attemptsTo(StartCreatingListing.fromNavigation());
});
When('{word} opens her listings dashboard', async function (this: ShareThriftWorld, name: string) {
	await actorCalled(name).attemptsTo(OpenListingDashboard.fromNavigation());
});
When('{word} views incoming listing requests', async function (this: ShareThriftWorld, name: string) {
	await actorCalled(name).attemptsTo(ViewIncomingRequests.fromDashboard());
});
Then('{word} should see the create listing form', async function (this: ShareThriftWorld, name: string) {
	await actorCalled(name).attemptsTo(Ensure.that(CreateListingForm, equals(true)));
});
Then('{word} should see her listings', async function (this: ShareThriftWorld, name: string) {
	await actorCalled(name).attemptsTo(Ensure.that(ListingsDashboard, equals(true)));
});
Then('{word} should see the requests tab', async function (this: ShareThriftWorld, name: string) {
	await actorCalled(name).attemptsTo(Ensure.that(IncomingRequestsTab, equals(true)));
});
