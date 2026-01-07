import { Ability } from '@serenity-js/core';
import type { Domain } from '@sthrift/domain';

/**
 * CreateListingAbility represents an Actor's capacity to create listings in acceptance tests.
 *
 * This ability uses mock dependencies for rapid implementation.
 * Future enhancement: Replace mocks with real domain infrastructure (MongoDB Memory Server, etc.)
 */
export class CreateListingAbility extends Ability {
private createdListing?: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;

constructor(
private readonly uow: any,
private readonly user: any,
private readonly passport: any,
) {
super();
}

/**
 * Creates a draft listing with the provided details.
 * Currently uses mock dependencies.
 */
async createDraftListing(params: {
title: string;
description: string;
category: string;
location: string;
}): Promise<void> {
// Mock implementation for now - just store the params as if listing was created
this.createdListing = {
id: 'mock-listing-id',
...params,
} as any;
}

/**
 * Returns the most recently created listing reference.
 */
getCreatedListing():
| Domain.Contexts.Listing.ItemListing.ItemListingEntityReference
| undefined {
return this.createdListing;
}

/**
 * Factory method to create this ability with dependencies.
 */
static using(uow: any, user: any, passport: any): CreateListingAbility {
return new CreateListingAbility(uow, user, passport);
}

/**
 * Helper to get this ability from an actor.
 */
static as(actor: any): CreateListingAbility {
return actor.abilityTo(CreateListingAbility);
}
}
