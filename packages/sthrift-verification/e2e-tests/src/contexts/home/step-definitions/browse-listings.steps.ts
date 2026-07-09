import { Given, Then, When } from '@cucumber/cucumber';
import { Ensure, equals } from '@serenity-js/assertions';
import { actorCalled } from '@serenity-js/core';
import type { ShareThriftWorld } from '../../../world.ts';
import { CreateListing } from '../../listing/tasks/create-listing.ts';
import { DiscoveryControls, ListingInDiscovery, SelectedCategory } from '../questions/home-page-content.ts';
import { BrowseListings } from '../tasks/browse-listings.ts';

Given('{word} has created a published listing titled {string}', async function (this: ShareThriftWorld, actorName: string, title: string) {
	await actorCalled(actorName).attemptsTo(CreateListing.with({ title, description: 'Portable projector for neighborhood movie nights', category: 'Electronics', location: 'Philadelphia, PA', isDraft: false }));
});
When('{word} browses available listings', async function (this: ShareThriftWorld, actorName: string) {
	await actorCalled(actorName).attemptsTo(BrowseListings.onTheHomePage());
});
When('{word} searches listings for {string}', async function (this: ShareThriftWorld, actorName: string, query: string) {
	await actorCalled(actorName).attemptsTo(BrowseListings.matching(query));
});
When('{word} opens listing {string}', async function (this: ShareThriftWorld, actorName: string, title: string) {
	await actorCalled(actorName).attemptsTo(BrowseListings.open(title));
});
When('{word} filters listings by {string}', async function (this: ShareThriftWorld, actorName: string, category: string) {
	await actorCalled(actorName).attemptsTo(BrowseListings.inCategory(category));
});
Then('{word} should see listing search, category, and location controls', async function (this: ShareThriftWorld, actorName: string) {
	await actorCalled(actorName).attemptsTo(Ensure.that(DiscoveryControls, equals(true)));
});
Then('{word} should find the listing {string}', async function (this: ShareThriftWorld, actorName: string, title: string) {
	await actorCalled(actorName).attemptsTo(Ensure.that(ListingInDiscovery(title), equals(true)));
});
Then('{word} should see listing {string} details', async function (this: ShareThriftWorld, actorName: string, title: string) {
	await actorCalled(actorName).attemptsTo(Ensure.that(ListingInDiscovery(title), equals(true)));
});
Then('{word} should see {string} as the selected category', async function (this: ShareThriftWorld, actorName: string, category: string) {
	await actorCalled(actorName).attemptsTo(Ensure.that(SelectedCategory(category), equals(true)));
});
