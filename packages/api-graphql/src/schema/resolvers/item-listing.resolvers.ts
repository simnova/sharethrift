import type { GraphContext } from "../../context.ts";

// Mock data to demonstrate functionality
import { MOCK_MY_LISTINGS, MOCK_LISTING_REQUESTS, type MyListing, type ListingRequest } from './mock-data.ts';

// Helper function to convert status names between frontend and backend
const convertStatusToState = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Active': 'Published',
    'Paused': 'Paused',
    'Reserved': 'Published', // Reserved is a computed state based on accepted requests
    'Expired': 'Expired',
    'Draft': 'Drafted',
    'Blocked': 'Blocked',
  };
  return statusMap[status] || status;
};

const convertStateToStatus = (state: string): string => {
  const stateMap: Record<string, string> = {
    'Published': 'Active',
    'Paused': 'Paused',
    'Expired': 'Expired',
    'Drafted': 'Draft',
    'Blocked': 'Blocked',
  };
  return stateMap[state] || state;
};

// Helper function to apply filters and sorting
const filterAndSortListings = (
  listings: MyListing[],
  filter?: {
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }
): MyListing[] => {
  let filtered = [...listings];

  // Apply search filter
  if (filter?.search) {
    const searchLower = filter.search.toLowerCase();
    filtered = filtered.filter(listing =>
      listing.title.toLowerCase().includes(searchLower) ||
      listing.description.toLowerCase().includes(searchLower)
    );
  }

  // Apply status filter
  if (filter?.status) {
    const backendState = convertStatusToState(filter.status);
    filtered = filtered.filter(listing => {
      const listingState = convertStatusToState(listing.status);
      return listingState === backendState;
    });
  }

  // Apply sorting
  if (filter?.sortBy) {
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filter.sortBy) {
        case 'TITLE':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'CREATED_AT':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'UPDATED_AT':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'SHARING_PERIOD_START':
          comparison = new Date(a.sharingPeriodStart).getTime() - new Date(b.sharingPeriodStart).getTime();
          break;
        default:
          comparison = 0;
      }

      return filter.sortOrder === 'DESC' ? -comparison : comparison;
    });
  }

  return filtered;
};

// Helper function to apply filters and sorting to requests
const filterAndSortRequests = (
  requests: ListingRequest[],
  filter?: {
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }
): ListingRequest[] => {
  let filtered = [...requests];

  // Apply search filter
  if (filter?.search) {
    const searchLower = filter.search.toLowerCase();
    filtered = filtered.filter(request =>
      request.listing.title.toLowerCase().includes(searchLower) ||
      request.requestedBy.toLowerCase().includes(searchLower)
    );
  }

  // Apply status filter
  if (filter?.status) {
    filtered = filtered.filter(request => request.status === filter.status);
  }

  // Apply sorting
  if (filter?.sortBy) {
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filter.sortBy) {
        case 'REQUESTED_BY':
          comparison = a.requestedBy.localeCompare(b.requestedBy);
          break;
        case 'CREATED_AT':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'UPDATED_AT':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'RESERVATION_PERIOD_START':
          comparison = new Date(a.reservationPeriodStart).getTime() - new Date(b.reservationPeriodStart).getTime();
          break;
        default:
          comparison = 0;
      }

      return filter.sortOrder === 'DESC' ? -comparison : comparison;
    });
  }

  return filtered;
};

// Helper function to implement pagination
const paginateResults = <T>(
  items: T[],
  first: number = 6,
  after?: string
): {
  edges: Array<{ node: T; cursor: string }>;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  totalCount: number;
} => {
  const startIndex = after ? items.findIndex((_, i) => i.toString() === after) + 1 : 0;
  const endIndex = Math.min(startIndex + first, items.length);
  const slicedItems = items.slice(startIndex, endIndex);

  const edges = slicedItems.map((item, index) => ({
    node: item,
    cursor: (startIndex + index).toString(),
  }));

  const pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  } = {
    hasNextPage: endIndex < items.length,
    hasPreviousPage: startIndex > 0,
  };

  if (edges.length > 0 && edges[0]) {
    pageInfo.startCursor = edges[0].cursor;
  }
  if (edges.length > 0) {
    const lastEdge = edges[edges.length - 1];
    if (lastEdge) {
      pageInfo.endCursor = lastEdge.cursor;
    }
  }

  return {
    edges,
    pageInfo,
    totalCount: items.length,
  };
};

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
    myListings: (
      _parent: unknown, 
      args: { 
        first?: number; 
        after?: string; 
        filter?: {
          search?: string;
          status?: string;
          sortBy?: string;
          sortOrder?: string;
        };
      }, 
      context: GraphContext
    ) => {
      console.log('myListings resolver called with args:', args, 'context:', context);
      
      // For now, using mock data. In production, this would fetch from the database
      // using context.apiContext.dataSources.domainDataSource.itemListingRepository
      
      const filteredListings = filterAndSortListings(MOCK_MY_LISTINGS, args.filter);
      const result = paginateResults(filteredListings, args.first, args.after);
      
      console.log(`Returning ${result.edges.length} listings out of ${result.totalCount} total`);
      return result;
    },
    myListingRequests: (
      _parent: unknown, 
      args: { 
        first?: number; 
        after?: string; 
        filter?: {
          search?: string;
          status?: string;
          sortBy?: string;
          sortOrder?: string;
        };
      }, 
      context: GraphContext
    ) => {
      console.log('myListingRequests resolver called with args:', args, 'context:', context);
      
      // For now, using mock data. In production, this would fetch from the database
      // using context.apiContext.dataSources.domainDataSource.listingRequestRepository
      
      const filteredRequests = filterAndSortRequests(MOCK_LISTING_REQUESTS, args.filter);
      const result = paginateResults(filteredRequests, args.first, args.after);
      
      console.log(`Returning ${result.edges.length} requests out of ${result.totalCount} total`);
      return result;
    },
    myListingRequestsCount: (_parent: unknown, _args: unknown, context: GraphContext) => {
      console.log('myListingRequestsCount resolver called with context:', context);
      
      // For now, using mock data count of pending requests
      const pendingRequests = MOCK_LISTING_REQUESTS.filter(request => request.status === 'Pending');
      return pendingRequests.length;
    },
  },
  ItemListing: {
    // Resolve the images field
    images: (parent: MyListing) => {
      return parent.images || [];
    },
    // Resolve pending requests count
    pendingRequestsCount: (parent: MyListing) => {
      // In production, this would query the ListingRequest repository
      const requests = MOCK_LISTING_REQUESTS.filter(
        request => request.listingId === parent._id && request.status === 'Pending'
      );
      return requests.length;
    },
    // Convert backend state to frontend status for consistency
    state: (parent: MyListing) => {
      return convertStateToStatus(parent.status);
    },
  },
  ListingRequest: {
    // Resolve the listing field
    listing: (parent: ListingRequest) => {
      // In production, this would use the listing repository
      return MOCK_MY_LISTINGS.find(listing => listing._id === parent.listingId);
    },
    // Resolve requestedByUsername from the requestedBy field
    requestedByUsername: (parent: ListingRequest) => {
      return parent.requestedBy; // Mock data already has username format
    },
  },
};