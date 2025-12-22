import { Ability } from '@serenity-js/core';
import type { Domain } from '@sthrift/domain';
import { ItemListing } from '../../../../src/domain/contexts/listing/item/item-listing.ts';
import type { ItemListingUnitOfWork } from '../../../../src/domain/contexts/listing/item/item-listing.uow.ts';
import type { Passport } from '../../../../src/domain/iam/passport.ts';

interface ListingCreationParams {
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	images?: string[];
	isDraft?: boolean;
	expiresAt?: Date;
}

/**
 * CreateListingAbility represents an Actor's capacity to create listings in acceptance tests.
 *
 * This ability aligns with Hexagonal Architecture by:
 * - Using the actual domain aggregate factory method (ItemListing.getNewInstance)
 * - Interacting through the domain's UnitOfWork, not mocking the database
 * - Leveraging the real repository implementation (MongoDB memory server in tests)
 */
export class CreateListingAbility extends Ability {
	constructor(
		private readonly unitOfWork: ItemListingUnitOfWork,
		private readonly actorUser: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
		private readonly passport: Passport,
	) {
		super();
	}

	/**
	 * Creates a new listing using the domain model's factory method and persists it via UnitOfWork.
	 *
	 * @param params - Listing creation parameters
	 * @returns The created and persisted listing
	 */
	async createListing(
		params: ListingCreationParams,
	): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference> {
		let createdListing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;

		await this.unitOfWork.withScopedTransaction(async (repo) => {
			// Use the REAL domain factory method - this ensures:
			// 1. Business rules are enforced (validation, state transitions)
			// 2. Domain logic determines the state (Active vs Draft based on isDraft flag)
			// 3. All required fields are properly initialized
			const listing = ItemListing.getNewInstance(
				this.actorUser, // sharer
				{
					title: params.title,
					description: params.description,
					category: params.category,
					location: params.location,
					sharingPeriodStart: params.sharingPeriodStart,
					sharingPeriodEnd: params.sharingPeriodEnd,
					images: params.images,
					isDraft: params.isDraft,
					expiresAt: params.expiresAt,
				},
				this.passport,
			);

			// Save via the repository - this uses real persistence (MongoDB memory server)
			createdListing = await repo.save(listing);
		});

		return createdListing!;
	}

	/**
	 * Factory method to create the ability with required dependencies.
	 *
	 * @param unitOfWork - The listing unit of work for transaction management
	 * @param actorUser - The user creating the listing
	 * @param passport - Security context with permissions
	 */
	static with(
		unitOfWork: ItemListingUnitOfWork,
		actorUser: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
		passport: Passport,
	): CreateListingAbility {
		return new CreateListingAbility(unitOfWork, actorUser, passport);
	}
}