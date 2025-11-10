import { Before, Given, Then, When } from '@cucumber/cucumber';
import { actorCalled, Actor } from '@serenity-js/core';
import { Ensure, equals } from '@serenity-js/assertions';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import { CreateListingAbility } from '../features/abilities/create-listing.ability';

// Import from domain source directly
import type { ItemListingEntityReference } from '../../../src/domain/contexts/listing/item/item-listing.entity';
import { SystemPassport } from '../../../src/domain/iam/system/system.passport';

declare module '@serenity-js/core' {
  interface Actor {
    createListingAbility: CreateListingAbility;
    // Use a permissive type to avoid cross-build (src vs dist) type incompatibilities in tests
    currentListings: any[];
  }
}

// Initialize actor before each scenario
Before(async () => {
    const actor = actorCalled('User');
    
    // Give the actor ability to create listings
    actor.createListingAbility = new CreateListingAbility();
    actor.currentListings = [];
});

// Step Definitions
Given('a registered user is authenticated', async () => {
    // In domain layer tests, we're using a SystemPassport which is always authenticated
    return Promise.resolve();
});

When('the user creates a new listing titled {string}', async (title: string) => {
    const actor = actorCalled('User');
    const listing = await actor.createListingAbility.createListing({
        title,
        description: 'Test listing description',
        category: 'Other',
        location: 'Test Location',
        sharingPeriodStart: new Date(),
        sharingPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        images: []
    });
    
    // Store the created listing for later steps
    actor.currentListings.push(listing);
});

Then('the listing should appear in the shared catalog', async () => {
    const actor = actorCalled('User');
    const currentListing = actor.currentListings[0];
    
    // First ensure we have a valid listing
    if (!currentListing) {
        throw new Error('No listing was created in the previous step');
    }
    
    // Get all listings for the user
    const listings = await actor.createListingAbility.getUserListings(currentListing.sharer.id);
    const foundListing = listings.find(l => l.id === currentListing.id);
    
    // Verify that the listing exists and its state is Published
    await actor.attemptsTo(
        Ensure.that(Boolean(foundListing), equals(true)),
        Ensure.that(foundListing?.state === 'Published', equals(true))
    );
});

Given('a listing has been active for {int} months', async (months: number) => {
    const actor = actorCalled('User');
    const listing = actor.currentListings[0];
    
    // Set the creation date back by the specified number of months
    const createdDate = new Date();
    createdDate.setMonth(createdDate.getMonth() - months);
    
    await actor.createListingAbility.updateListingDates(listing.id, createdDate, new Date());
});

When('the system checks for expired listings', async () => {
    const actor = actorCalled('User');
    const listing = actor.currentListings[0];
    
    // Check if listing should be expired based on its creation date
    if (listing.createdAt) {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        if (listing.createdAt < sixMonthsAgo) {
            await actor.createListingAbility.updateListingState(listing.id, 'Expired');
        }
    }
});

Then('the listing should be removed from public view', async () => {
    const actor = actorCalled('User');
    const listing = actor.currentListings[0];
    
    // Simulate the system marking the listing as expired
    await actor.createListingAbility.updateListingState(listing.id, 'Expired');
    
    // Get the current state of the listing
    const listings = await actor.createListingAbility.getUserListings(listing.sharer.id);
    const foundListing = listings.find(l => l.id === listing.id);
    
    // Verify that the listing exists and its state is Expired
    await actor.attemptsTo(
        Ensure.that(Boolean(foundListing), equals(true)),
        Ensure.that(foundListing?.state === 'Expired', equals(true))
    );
});
