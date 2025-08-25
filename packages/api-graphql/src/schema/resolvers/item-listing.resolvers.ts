import type { GraphContext } from "../../context.ts";

interface MyListingsArgs {
  page: number;
  pageSize: number;
  filter?: {
    searchText?: string;
    statusFilter?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };
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
    myListingsAll: async (_parent: unknown, args: MyListingsArgs, context: GraphContext) => {
      console.log('myListingsAll resolver called with args:', args);
      
      // TODO: Get actual user ID from context/auth or pass it in
      const userId = 'currentUser';
      
      try {
        // Get the listing repository from context
        const listingRepository = context.apiContext.dataSources.domainDataSource.listingDataSource.itemListingRepository;
        
        const result = await listingRepository.findBySharerWithPagination({
          sharerId: userId,
          page: args.page,
          pageSize: args.pageSize,
          searchText: args.filter?.searchText,
          statusFilter: args.filter?.statusFilter,
          sortBy: args.filter?.sortBy,
          sortOrder: args.filter?.sortOrder
        });
        
        return {
          edges: result.edges,
          pageInfo: result.pageInfo,
          totalCount: result.totalCount
        };
      } catch (error) {
        console.error('Error in myListingsAll resolver:', error);
        throw error;
      }
    },
    
    myListingsRequests: async (_parent: unknown, args: MyListingsArgs, context: GraphContext) => {
      console.log('myListingsRequests resolver called with args:', args);
      
      // TODO: Get actual user ID from context/auth or pass it in
      const userId = 'currentUser';
      
      try {
        // Get the listing repository from context
        const listingRepository = context.apiContext.dataSources.domainDataSource.listingDataSource.itemListingRepository;
        
        const result = await listingRepository.findBySharerWithRequestsWithPagination({
          sharerId: userId,
          page: args.page,
          pageSize: args.pageSize,
          searchText: args.filter?.searchText,
          statusFilter: args.filter?.statusFilter,
          sortBy: args.filter?.sortBy,
          sortOrder: args.filter?.sortOrder
        });
        
        return {
          edges: result.edges,
          pageInfo: result.pageInfo,
          totalCount: result.totalCount
        };
      } catch (error) {
        console.error('Error in myListingsRequests resolver:', error);
        throw error;
      }
    },
  },
  
  Mutation: {
    // mutations
  },
};