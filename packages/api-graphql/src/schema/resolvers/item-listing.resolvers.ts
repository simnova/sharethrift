import type { GraphContext } from "../../context.ts";
import { myListingsMockService } from "../../mock-services/my-listings-mock.service.ts";

interface MyListingsArgs {
  page: number;
  pageSize: number;
}

export const itemListingResolvers = {
  Query: {
    itemListings: (_parent: unknown, _args: unknown, context: GraphContext) => {
      console.log('item listing resolver called with context:', context);
      // TODO: implement actual logic to fetch listings
      return [];
    },
    itemListing: () => {
      console.log('item listing resolver called');
      // TODO: implement actual logic to fetch listings
      return {};
    },
    activeListings: (_parent: unknown, _args: unknown, context: GraphContext) => {
      console.log('active listings resolver called with context:', context);
      // TODO: implement actual logic to fetch active listings
      return [];
    },
    
    // My Listings queries
    myListingsAll: (_parent: unknown, args: MyListingsArgs, context: GraphContext) => {
      console.log('myListingsAll resolver called with args:', args, context);
      
      // Use mock service to get paginated listings
      const result = myListingsMockService.getMyListings({
        page: args.page,
        pageSize: args.pageSize,
      });
      
      return result;
    },
    
    myListingsRequests: (_parent: unknown, args: MyListingsArgs, context: GraphContext) => {
      console.log('myListingsRequests resolver called with args:', args, context);
      
      // Use mock service to get paginated listing requests
      const result = myListingsMockService.getMyListingRequests({
        page: args.page,
        pageSize: args.pageSize,
      });
      
      return result;
    }
  },
  
  Mutation: {
    // placeholder mutations for future implementation
  },
};