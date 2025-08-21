import type { GraphContext } from "../../context.ts";

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
    myListingsAll: async (
      _parent: unknown, 
      args: { page: number; pageSize: number }, 
      context: GraphContext
    ) => {
      console.log('myListingsAll resolver called with args:', args);
      
      if (!context.applicationServices) {
        throw new Error('Application services not available');
      }

      // TODO: Get actual user ID from context/authentication
      const userId = 'mock-user-id';
      
      return await context.applicationServices.myListingsAllQuery.execute(userId, {
        page: args.page,
        pageSize: args.pageSize
      });
    },
    myListingsRequests: async (
      _parent: unknown, 
      args: { page: number; pageSize: number }, 
      context: GraphContext
    ) => {
      console.log('myListingsRequests resolver called with args:', args);
      
      if (!context.applicationServices) {
        throw new Error('Application services not available');
      }

      // TODO: Get actual user ID from context/authentication
      const userId = 'mock-user-id';
      
      return await context.applicationServices.myListingsRequestsQuery.execute(userId, {
        page: args.page,
        pageSize: args.pageSize
      });
    },
  },
};