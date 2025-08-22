import type { GraphContext } from "../../context.ts";
import type { 
  ListingStatus, 
  RequestStatus 
} from '@sthrift/api-application-services';

interface MyListingsAllArgs {
  page: number;
  pageSize: number;
  searchText?: string;
  statusFilter?: ListingStatus[];
  sortBy?: 'title' | 'publishedAt' | 'reservationPeriod' | 'pendingRequestsCount';
  sortOrder?: 'asc' | 'desc';
}

interface MyListingsRequestsArgs {
  page: number;
  pageSize: number;
  searchText?: string;
  statusFilter?: RequestStatus[];
  sortBy?: 'title' | 'requestedBy' | 'requestedOn' | 'reservationPeriod';
  sortOrder?: 'asc' | 'desc';
}

interface ListingActionArgs {
  listingId: string;
}

interface AppealListingArgs extends ListingActionArgs {
  reason: string;
}

interface RequestActionArgs {
  requestId: string;
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
    myListingsAll: (_parent: unknown, args: MyListingsAllArgs, context: GraphContext) => {
      console.log('myListingsAll resolver called with args:', args);
      
      // TODO: Get actual user ID from context/auth
      const userId = 'currentUser';
      
      const input = {
        page: args.page,
        pageSize: args.pageSize,
        userId,
        ...(args.searchText !== undefined && { searchText: args.searchText }),
        ...(args.statusFilter !== undefined && { statusFilter: args.statusFilter }),
        ...(args.sortBy !== undefined && { sortBy: args.sortBy }),
        ...(args.sortOrder !== undefined && { sortOrder: args.sortOrder })
      };
      
      return context.applicationServices.myListingsAllQuery.execute(input);
    },
    
    myListingsRequests: (_parent: unknown, args: MyListingsRequestsArgs, context: GraphContext) => {
      console.log('myListingsRequests resolver called with args:', args);
      
      // TODO: Get actual user ID from context/auth
      const userId = 'currentUser';
      
      const input = {
        page: args.page,
        pageSize: args.pageSize,
        userId,
        ...(args.searchText !== undefined && { searchText: args.searchText }),
        ...(args.statusFilter !== undefined && { statusFilter: args.statusFilter }),
        ...(args.sortBy !== undefined && { sortBy: args.sortBy }),
        ...(args.sortOrder !== undefined && { sortOrder: args.sortOrder })
      };
      
      return context.applicationServices.myListingsRequestsQuery.execute(input);
    },
  },
  
  Mutation: {
    // Listing actions (placeholder implementations)
    pauseListing: (_parent: unknown, args: ListingActionArgs, context: GraphContext) => {
      console.log('pauseListing mutation called with args:', args);
      const userId = 'currentUser'; // TODO: Get from auth context
      return context.applicationServices.pauseListingMutation.execute({ ...args, userId });
    },
    
    reinstateListing: (_parent: unknown, args: ListingActionArgs, context: GraphContext) => {
      console.log('reinstateListing mutation called with args:', args);
      const userId = 'currentUser'; // TODO: Get from auth context
      return context.applicationServices.reinstateListingMutation.execute({ ...args, userId });
    },
    
    appealListing: (_parent: unknown, args: AppealListingArgs, context: GraphContext) => {
      console.log('appealListing mutation called with args:', args);
      const userId = 'currentUser'; // TODO: Get from auth context
      return context.applicationServices.appealListingMutation.execute({ ...args, userId });
    },
    
    publishListing: (_parent: unknown, args: ListingActionArgs, context: GraphContext) => {
      console.log('publishListing mutation called with args:', args);
      const userId = 'currentUser'; // TODO: Get from auth context
      return context.applicationServices.publishListingMutation.execute({ ...args, userId });
    },
    
    editListing: (_parent: unknown, args: ListingActionArgs, context: GraphContext) => {
      console.log('editListing mutation called with args:', args);
      const userId = 'currentUser'; // TODO: Get from auth context
      return context.applicationServices.editListingMutation.execute({ ...args, userId });
    },
    
    deleteListing: (_parent: unknown, args: ListingActionArgs, context: GraphContext) => {
      console.log('deleteListing mutation called with args:', args);
      const userId = 'currentUser'; // TODO: Get from auth context
      return context.applicationServices.deleteListingMutation.execute({ ...args, userId });
    },
    
    // Request actions (placeholder implementations)
    acceptRequest: (_parent: unknown, args: RequestActionArgs, context: GraphContext) => {
      console.log('acceptRequest mutation called with args:', args);
      const userId = 'currentUser'; // TODO: Get from auth context
      return context.applicationServices.acceptRequestMutation.execute({ listingId: args.requestId, userId });
    },
    
    rejectRequest: (_parent: unknown, args: RequestActionArgs, context: GraphContext) => {
      console.log('rejectRequest mutation called with args:', args);
      const userId = 'currentUser'; // TODO: Get from auth context
      return context.applicationServices.rejectRequestMutation.execute({ listingId: args.requestId, userId });
    },
    
    closeRequest: (_parent: unknown, args: RequestActionArgs, context: GraphContext) => {
      console.log('closeRequest mutation called with args:', args);
      const userId = 'currentUser'; // TODO: Get from auth context
      return context.applicationServices.closeRequestMutation.execute({ listingId: args.requestId, userId });
    },
    
    messageRequester: (_parent: unknown, args: RequestActionArgs, context: GraphContext) => {
      console.log('messageRequester mutation called with args:', args);
      const userId = 'currentUser'; // TODO: Get from auth context
      return context.applicationServices.messageRequesterMutation.execute({ listingId: args.requestId, userId });
    },
    
    deleteRequest: (_parent: unknown, args: RequestActionArgs, context: GraphContext) => {
      console.log('deleteRequest mutation called with args:', args);
      const userId = 'currentUser'; // TODO: Get from auth context
      return context.applicationServices.deleteRequestMutation.execute({ listingId: args.requestId, userId });
    },
  },
};