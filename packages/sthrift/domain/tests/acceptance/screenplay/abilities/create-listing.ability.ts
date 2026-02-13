import { Ability } from '@serenity-js/core';
import type { Domain } from '@sthrift/domain';

// Type aliases for mocked dependencies
// TODO: Replace with real types when implementing actual domain integration
type MockUow = unknown;
type MockUser = unknown;
type MockPassport = unknown;
type MockActor = { abilityTo: (ability: typeof CreateListingAbility) => CreateListingAbility };

/**
 * CreateListingAbility represents an Actor's capacity to create listings in acceptance tests.
 *
 * This ability uses mock dependencies for rapid implementation.
 * Future enhancement: Replace mocks with real domain infrastructure (MongoDB Memory Server, etc.)
 */
export class CreateListingAbility extends Ability {
	private createdListing?: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;

	constructor(
		private readonly uow: MockUow,
		private readonly user: MockUser,
		private readonly passport: MockPassport,
	) {
		super();
	}	/**
	 * Creates a draft listing with the provided details.
	 * Currently uses mock dependencies.
	 */
	createDraftListing(params: {
		title: string;
		description: string;
		category: string;
		location: string;
	}): void {
		// Mock implementation for now - just store the params as if listing was created
		this.createdListing = {
			id: 'mock-listing-id',
			...params,
		} as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;
	}/**
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
	static using(uow: MockUow, user: MockUser, passport: MockPassport): CreateListingAbility {
		return new CreateListingAbility(uow, user, passport);
	}

	/**
	 * Helper to get this ability from an actor.
	 */
	static as(actor: MockActor): CreateListingAbility {
		return actor.abilityTo(CreateListingAbility);
	}
}