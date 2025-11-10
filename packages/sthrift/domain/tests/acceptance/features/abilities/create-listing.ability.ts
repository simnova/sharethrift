import { Ability } from '@serenity-js/core';
import type { Domain } from '@sthrift/domain';

interface ListingCreationParams {
  title: string;
  description: string;
  category: string;
  location: string;
  sharingPeriodStart: Date;
  sharingPeriodEnd: Date;
  images?: string[];
  isDraft?: boolean;
}

export class CreateListingAbility extends Ability {
  private listings: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[] = [];

  async createListing(params: ListingCreationParams): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference> {
    if (!params.title) {
      throw new Error('title is required');
    }
    
    const listing = {
      id: `listing-${Date.now()}`,
      title: params.title,
      description: params.description,
      category: params.category,
      location: params.location,
      sharingPeriodStart: params.sharingPeriodStart,
      sharingPeriodEnd: params.sharingPeriodEnd,
      state: 'Published',
      createdAt: new Date(),
      updatedAt: new Date(),
      schemaVersion: '1.0.0',
      images: params.images,
      listingType: 'item-listing',
      sharingHistory: [],
      sharer: {
        id: 'test-user',
        userType: 'personal-user',
        isBlocked: false,
        schemaVersion: '1.0.0',
        hasCompletedOnboarding: true,
        role: {
          id: 'test-role',
          roleName: 'standard',
          isDefault: true,
          roleType: 'personal-user-role',
          createdAt: new Date(),
          updatedAt: new Date(),
          schemaVersion: '1.0.0',
          permissions: {
            listingPermissions: {
              canCreateItemListing: true,
              canUpdateItemListing: true,
              canDeleteItemListing: true,
              canViewItemListing: true,
              canPublishItemListing: true,
              canUnpublishItemListing: true
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
          schemaVersion: '1.0.0',
          permissions: {
            listingPermissions: {
              canCreateItemListing: true,
              canUpdateItemListing: true,
              canDeleteItemListing: true,
              canViewItemListing: true,
              canPublishItemListing: true,
              canUnpublishItemListing: true
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
    };

    this.listings.push(listing);
    return listing;
  }

  async getUserListings(userId: string): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]> {
    // Return listings for the given user
    return this.listings.filter(l => l.sharer.id === userId);
  }

  async updateListingState(listingId: string, newState: string): Promise<void> {
    const listing = this.listings.find(l => l.id === listingId);
    if (listing) {
      (listing as any).state = newState;
    }
  }

  async updateListingDates(listingId: string, createdAt: Date, updatedAt: Date): Promise<void> {
    const listing = this.listings.find(l => l.id === listingId);
    if (listing) {
      (listing as any).createdAt = createdAt;
      (listing as any).updatedAt = updatedAt;
    }
  }
}

// Export a singleton instance
export const createListingAbility = new CreateListingAbility();