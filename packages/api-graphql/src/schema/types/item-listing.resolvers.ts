import { DUMMY_LISTINGS } from './mock-listings.js';
import type { ItemListing } from './mock-listings.js';

function mapState(state?: string) {
  return state === 'Appeal Requested' ? 'Appeal_Requested' : state;
}

// Create a mutable copy for testing mutations
const mutableListings = [...DUMMY_LISTINGS];

interface CreateItemListingInput {
  title: string;
  description: string;
  category: string;
  location: string;
  sharingPeriodStart: string;
  sharingPeriodEnd: string;
  images?: string[];
  isDraft?: boolean;
}

const itemListingResolvers = {
  Query: {
    itemListings: () => {
      return mutableListings.map((listing: ItemListing) => ({
        sharer: listing.sharer,
        title: listing.title,
        description: listing.description,
        category: listing.category,
        location: listing.location,
        sharingPeriodStart: listing.sharingPeriodStart.toISOString(),
        sharingPeriodEnd: listing.sharingPeriodEnd.toISOString(),
        state: mapState(listing.state),
        sharingHistory: listing.sharingHistory || [],
        reports: listing.reports || 0,
        images: listing.images || [],
        id: listing._id,
        schemaVersion: "1",
        createdAt: listing.createdAt?.toISOString(),
        updatedAt: listing.updatedAt?.toISOString(),
        version: 1
      }));
    },
    itemListing: (_parent: unknown, args: { id: string }) => {
      const listing = mutableListings.find((l: ItemListing) => l._id === args.id);
      if (!listing) {
        return null;
      }
      return {
        sharer: listing.sharer,
        title: listing.title,
        description: listing.description,
        category: listing.category,
        location: listing.location,
        sharingPeriodStart: listing.sharingPeriodStart.toISOString(),
        sharingPeriodEnd: listing.sharingPeriodEnd.toISOString(),
        state: mapState(listing.state),
        sharingHistory: listing.sharingHistory || [],
        reports: listing.reports || 0,
        images: listing.images || [],
        id: listing._id,
        schemaVersion: "1",
        createdAt: listing.createdAt?.toISOString(),
        updatedAt: listing.updatedAt?.toISOString(),
        version: 1
      };
    },
  },
  Mutation: {
    createItemListing: (_parent: unknown, args: { input: CreateItemListingInput }) => {
      const { input } = args;
      
      // Generate a new ID
      const newId = `64f7a9c2d1e5b97f3c9d${Math.random().toString(36).substr(2, 4)}`;
      
      // Create new listing
      const newListing: ItemListing = {
        _id: newId,
        sharer: 'Current User', // In real implementation, would get from auth context
        title: input.title,
        description: input.description,
        category: input.category,
        location: input.location,
        sharingPeriodStart: new Date(input.sharingPeriodStart),
        sharingPeriodEnd: new Date(input.sharingPeriodEnd),
        state: input.isDraft ? 'Drafted' : 'Published',
        images: input.images || [],
        sharingHistory: [],
        reports: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Add to mutable listings array
      mutableListings.push(newListing);
      
      // Return formatted response
      return {
        sharer: newListing.sharer,
        title: newListing.title,
        description: newListing.description,
        category: newListing.category,
        location: newListing.location,
        sharingPeriodStart: newListing.sharingPeriodStart.toISOString(),
        sharingPeriodEnd: newListing.sharingPeriodEnd.toISOString(),
        state: mapState(newListing.state),
        sharingHistory: newListing.sharingHistory || [],
        reports: newListing.reports || 0,
        images: newListing.images || [],
        id: newListing._id,
        schemaVersion: "1",
        createdAt: newListing.createdAt?.toISOString(),
        updatedAt: newListing.updatedAt?.toISOString(),
        version: 1
      };
    },
  },
};

export default itemListingResolvers;