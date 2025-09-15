import { DUMMY_LISTINGS } from './mock-listings.js';
import type { ItemListing } from './mock-listings.js';
import type { GraphContext } from "../../init/context.ts";

function mapState(state?: string) {
  return state === 'Appeal Requested' ? 'Appeal_Requested' : state;
}
interface MyListingsArgs {
  page: number;
  pageSize: number;
  searchText?: string;
  statusFilters?: string[];
  sorter?: { field: string; order: 'ascend' | 'descend' };
}

const itemListingResolvers = {
  Query: {
    itemListings: async (_parent: unknown, _args: unknown, context: GraphContext) => {
      // Delegate to application service for fetching all listings (with filtering, etc.)
      // This should be implemented in the application service layer, not here.
      // For now, we call a method like queryAll (to be implemented) or reuse queryMyListingsAll with no filters.
      // If you want to support admin/global listing queries, add a new service method.
      return await context.applicationServices.Conversation.ItemListing.queryAll();
    },
    itemListing: async (_parent: unknown, args: { id: string }, context: GraphContext) => {
      // Use the application service to fetch by ID (delegates to persistence layer)
      const item = await context.applicationServices.Conversation.ItemListing.queryById({ id: args.id });
      if (!item) {
        return null;
      }
      return {
        sharer: item.sharer,
        title: item.title,
        description: item.description,
        category: item.category,
        location: item.location,
        sharingPeriodStart: item.sharingPeriodStart?.toISOString?.() ?? null,
        sharingPeriodEnd: item.sharingPeriodEnd?.toISOString?.() ?? null,
        state: mapState(item.state),
        sharingHistory: item.sharingHistory || [],
        reports: item.reports || 0,
        images: item.images || [],
        id: item.id,
        schemaVersion: item.schemaVersion ?? "1",
        createdAt: item.createdAt?.toISOString?.() ?? null,
        updatedAt: item.updatedAt?.toISOString?.() ?? null,
        version: item.version ?? 1
      };
    },
    // My Listings queries
    myListingsAll: async (_parent: unknown, args: MyListingsArgs, context: GraphContext) => {
      // Delegate to application service (mock or real backend)
      return await queryMyListingsAll(args, context);
    },
    
  },
};

export default itemListingResolvers;