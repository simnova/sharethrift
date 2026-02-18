import { Ability } from '@serenity-js/core';
import type { Domain } from '@sthrift/domain';

// Type aliases for mocked dependencies
// TODO: Replace with real types when implementing actual domain integration
type MockUow = unknown;
type MockUser = unknown;
type MockPassport = unknown;

/**
 * CreateListingAbility represents an Actor's capacity to create listings in acceptance tests.
 *
 * This ability is used at the DOMAIN level to directly interact with domain models.
 * At other levels (GraphQL/DOM), different abilities are used instead.
 *
 * Current implementation uses mock dependencies for rapid prototyping.
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
	}

	/**
	 * Creates a draft listing with the provided details.
	 * Validates input according to domain rules.
	 */
	createDraftListing(params: {
		title?: string;
		description?: string;
		category?: string;
		location?: string;
	}): void {
		// Domain validation
		if (!params.title) {
			throw new Error('Validation error: title is required');
		}
		if (params.title.length < 5) {
			throw new Error('Validation error: Title must be at least 5 characters');
		}
		if (params.title.length > 100) {
			throw new Error('Validation error: Title must be at most 100 characters');
		}
		if (!params.description) {
			throw new Error('Validation error: description is required');
		}
		if (!params.category) {
			throw new Error('Validation error: category is required');
		}
		if (!params.location) {
			throw new Error('Validation error: location is required');
		}

		// Mock implementation for now - just store the params as if listing was created
		this.createdListing = {
			id: 'mock-listing-id',
			...params,
		} as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;
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
	static using(uow: MockUow, user: MockUser, passport: MockPassport): CreateListingAbility {
		return new CreateListingAbility(uow, user, passport);
	}

	/**
	 * Get this ability from an actor.
	 */
	static as(actor: import('@serenity-js/core').Actor): CreateListingAbility {
		return actor.abilityTo(CreateListingAbility);
	}
}
