import { Ability } from '@serenity-js/core';import { Ability } from '@serenity-js/core';

import type { Domain } from '@sthrift/domain';import type { Domain } from '@sthrift/domain';

import type { ItemListingUnitOfWork } from '../../../../src/domain/contexts/listing/item/item-listing.uow.ts';

import type { Passport } from '../../../../src/domain/iam/passport.ts';const SCHEMA_VERSION = '1.0.0';

import { ItemListing } from '../../../../src/domain/contexts/listing/item/item-listing.ts';

interface ListingCreationParams {

interface ListingCreationParams {  title: string;

	title: string;  description: string;

	description: string;  category: string;

	category: string;  location: string;

	location: string;  sharingPeriodStart: Date;

	sharingPeriodStart: Date;  sharingPeriodEnd: Date;

	sharingPeriodEnd: Date;  images?: string[];

	images?: string[];  isDraft?: boolean;

	isDraft?: boolean;}

	expiresAt?: Date;

}export class CreateListingAbility extends Ability {

  private listings: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[] = [];

/**

 * CreateListingAbility represents an Actor's capacity to interact with the Listing domain model.  createListing(params: ListingCreationParams): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference> {

 *     if (!params.title) {

 * This ability aligns with Hexagonal Architecture by:      throw new Error('title is required');

 * - Using the actual domain aggregate factory method (getNewInstance)    }

 * - Interacting through the domain's UnitOfWork, not mocking the database    

 * - Leveraging the real repository implementation (MongoDB memory server in tests)    const listing = {

 */      id: `listing-${Date.now()}`,

export class CreateListingAbility extends Ability {      title: params.title,

	constructor(      description: params.description,

		private readonly unitOfWork: ItemListingUnitOfWork,      category: params.category,

		private readonly actorUser: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,      location: params.location,

		private readonly passport: Passport,      sharingPeriodStart: params.sharingPeriodStart,

	) {      sharingPeriodEnd: params.sharingPeriodEnd,

		super();      state: 'Published',

	}      createdAt: new Date(),

      updatedAt: new Date(),

	/**  schemaVersion: SCHEMA_VERSION,

	 * Creates a new listing using the domain model's factory method and persists it via UnitOfWork.      images: params.images,

	 *       listingType: 'item-listing',

	 * @param params - Listing creation parameters      sharingHistory: [],

	 * @returns The created and persisted listing      loadSharer: async () => ({

	 */        id: 'test-user',

	async createListing(        userType: 'personal-user' as const,

		params: ListingCreationParams,        isBlocked: false,

	): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference> {        schemaVersion: SCHEMA_VERSION,

		let createdListing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;        hasCompletedOnboarding: true,

        role: {

		await this.unitOfWork.withScopedTransaction(async (repo) => {          id: 'test-role',

			// 1. Use the REAL static factory method from the domain model          roleName: 'standard',

			const listing = ItemListing.getNewInstance(          isDefault: true,

				this.actorUser, // sharer          roleType: 'personal-user-role',

				{          createdAt: new Date(),

					title: params.title,          updatedAt: new Date(),

					description: params.description,          schemaVersion: SCHEMA_VERSION,

					category: params.category,          permissions: {

					location: params.location,            listingPermissions: {

					sharingPeriodStart: params.sharingPeriodStart,              canCreateItemListing: true,

					sharingPeriodEnd: params.sharingPeriodEnd,              canUpdateItemListing: true,

					images: params.images,              canDeleteItemListing: true,

					isDraft: params.isDraft,              canViewItemListing: true,

					expiresAt: params.expiresAt,              canPublishItemListing: true,

				},              canUnpublishItemListing: true,

				this.passport,              canReserveItemListing: true

			);            },

            conversationPermissions: {

			// 2. Save via the repository provided by the UnitOfWork              canCreateConversation: true,

			// This uses the actual persistence layer (MongoDB memory server in tests)              canManageConversation: true,

			createdListing = await repo.save(listing);              canViewConversation: true

		});            },

            reservationRequestPermissions: {

		return createdListing!;              canCreateReservationRequest: true,

	}              canManageReservationRequest: true,

              canViewReservationRequest: true

	/**            }

	 * Factory method to create the ability with required dependencies.          }

	 *         },

	 * @param unitOfWork - The listing unit of work for transaction management        loadRole: async () => ({

	 * @param actorUser - The user creating the listing          id: 'test-role',

	 * @param passport - Security context with permissions          roleName: 'standard',

	 */          isDefault: true,

	static with(          roleType: 'personal-user-role',

		unitOfWork: ItemListingUnitOfWork,          createdAt: new Date(),

		actorUser: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,          updatedAt: new Date(),

		passport: Passport,          schemaVersion: SCHEMA_VERSION,

	): CreateListingAbility {          permissions: {

		return new CreateListingAbility(unitOfWork, actorUser, passport);            listingPermissions: {

	}              canCreateItemListing: true,

}              canUpdateItemListing: true,

              canDeleteItemListing: true,
              canViewItemListing: true,
              canPublishItemListing: true,
              canUnpublishItemListing: true,
              canReserveItemListing: true
            },
            conversationPermissions: {
              canCreateConversation: true,
              canManageConversation: true,
              canViewConversation: true
            },
            reservationRequestPermissions: {
              canCreateReservationRequest: true,
              canManageReservationRequest: true,
              canViewReservationRequest: true
            }
          }
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
        account: {
          accountType: 'standard' as const,
          email: 'test@example.com',
          username: 'testuser',
          profile: {
            firstName: 'Test',
            lastName: 'User',
            aboutMe: '',
            location: {
              address1: '123 Main St',
              address2: null,
              city: 'Test City', 
              state: 'TS',
              country: 'Testland',
              zipCode: '12345'
            },
            billing: {
              subscriptionId: null,
              cybersourceCustomerId: null,
              paymentState: '',
              lastTransactionId: null,
              lastPaymentAmount: null
            }
          }
        }
      }),
      sharer: {
        id: 'test-user',
        userType: 'personal-user' as const,
        isBlocked: false,
  schemaVersion: SCHEMA_VERSION,
        hasCompletedOnboarding: true,
        role: {
          id: 'test-role',
          roleName: 'standard',
          isDefault: true,
          roleType: 'personal-user-role',
          createdAt: new Date(),
          updatedAt: new Date(),
          schemaVersion: SCHEMA_VERSION,
          permissions: {
            listingPermissions: {
              canCreateItemListing: true,
              canUpdateItemListing: true,
              canDeleteItemListing: true,
              canViewItemListing: true,
              canPublishItemListing: true,
              canUnpublishItemListing: true,
              canReserveItemListing: true
            },
            conversationPermissions: {
              canCreateConversation: true,
              canManageConversation: true,
              canViewConversation: true
            },
            reservationRequestPermissions: {
              canCreateReservationRequest: true,
              canManageReservationRequest: true,
              canViewReservationRequest: true
            }
          }
        },
        loadRole: async () => ({
          id: 'test-role',
          roleName: 'standard',
          isDefault: true,
          roleType: 'personal-user-role',
          createdAt: new Date(),
          updatedAt: new Date(),
          schemaVersion: SCHEMA_VERSION,
          permissions: {
            listingPermissions: {
              canCreateItemListing: true,
              canUpdateItemListing: true,
              canDeleteItemListing: true,
              canViewItemListing: true,
              canPublishItemListing: true,
              canUnpublishItemListing: true,
              canReserveItemListing: true
            },
            conversationPermissions: {
              canCreateConversation: true,
              canManageConversation: true,
              canViewConversation: true
            },
            reservationRequestPermissions: {
              canCreateReservationRequest: true,
              canManageReservationRequest: true,
              canViewReservationRequest: true
            }
          }
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
        account: {
          accountType: 'standard',
          email: 'test@example.com',
          username: 'testuser',
          profile: {
            firstName: 'Test',
            lastName: 'User',
            aboutMe: '',
            location: {
              address1: '123 Main St',
              address2: null,
              city: 'Test City', 
              state: 'TS',
              country: 'Testland',
              zipCode: '12345'
            },
            billing: {
              subscriptionId: null,
              cybersourceCustomerId: null,
              paymentState: '',
              lastTransactionId: null,
              lastPaymentAmount: null
            }
          }
        }
      },
    } as unknown as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;

    this.listings.push(listing);
    return Promise.resolve(listing);
  }

  getUserListings(userId: string): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]> {
    // Return listings for the given user
    return Promise.resolve(this.listings.filter(l => l.sharer.id === userId));
  }

  updateListingState(listingId: string, newState: string): void {
    const index = this.listings.findIndex(l => l.id === listingId);
    if (index !== -1) {
      const listing = this.listings[index];
      this.listings[index] = {
        ...listing,
        state: newState,
      };
    }
  }

  updateListingDates(listingId: string, createdAt: Date, updatedAt: Date): void {
    const index = this.listings.findIndex(l => l.id === listingId);
    if (index !== -1) {
      const listing = this.listings[index];
      this.listings[index] = {
        ...listing,
        createdAt,
        updatedAt,
      };
    }
  }
}

// Export a singleton instance
export const createListingAbility = new CreateListingAbility();