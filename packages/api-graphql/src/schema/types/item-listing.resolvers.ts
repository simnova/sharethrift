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

// Mock data for My Listings (will be moved to proper domain layer later)
const MOCK_MY_LISTINGS = [
  {
    id: '6324a3f1e3e4e1e6a8e1d8b1',
    title: 'Cordless Drill',
    status: 'Paused',
    image: '/assets/item-images/projector.png',
    pendingRequestsCount: 0,
    publishedAt: '2025-12-23',
    reservationPeriod: '2020-11-08 - 2020-12-23',
  },
  {
    id: '6324a3f1e3e4e1e6a8e1d8b7',
    title: 'Electric Guitar',
    status: 'Active',
    image: '/assets/item-images/projector.png',
    pendingRequestsCount: 3,
    publishedAt: '2025-08-30',
    reservationPeriod: '2025-09-01 - 2025-09-30',
  },
  {
    id: '6324a3f1e3e4e1e6a8e1d8b8',
    title: 'Stand Mixer',
    status: 'Reserved',
    image: '/assets/item-images/sewing-machine.png',
    pendingRequestsCount: 1,
    publishedAt: '2025-09-28',
    reservationPeriod: '2025-10-01 - 2025-10-15',
  },
  {
    id: '6324a3f1e3e4e1e6a8e1d8b9',
    title: 'Bubble Chair',
    status: 'Draft',
    image: '/assets/item-images/bubble-chair.png',
    pendingRequestsCount: 0,
    publishedAt: '2025-10-30',
    reservationPeriod: '2025-11-01 - 2025-11-15',
  },
  {
    id: '6324a3f1e3e4e1e6a8e1d8c0',
    title: 'Projector',
    status: 'Blocked',
    image: '/assets/item-images/projector.png',
    pendingRequestsCount: 0,
    publishedAt: '2025-11-28',
    reservationPeriod: '2025-12-01 - 2025-12-10',
  },
  {
    id: '6324a3f1e3e4e1e6a8e1d8b2',
    title: 'City Bike',
    status: 'Active',
    image: '/assets/item-images/bike.png',
    pendingRequestsCount: 2,
    publishedAt: '2025-01-03',
    reservationPeriod: '2020-11-08 - 2020-12-23',
  },
  {
    id: '6324a3f1e3e4e1e6a8e1d8b3',
    title: 'Sewing Kit',
    status: 'Expired',
    image: '/assets/item-images/sewing-machine.png',
    pendingRequestsCount: 0,
    publishedAt: '2025-01-12',
    reservationPeriod: '2020-11-08 - 2020-12-23',
  },
];

function getMyListingsWithPagination(options: MyListingsArgs) {
  let filteredListings = [...MOCK_MY_LISTINGS];

  // Apply search text filter
  if (options.searchText) {
    filteredListings = filteredListings.filter((listing) =>
      listing.title.toLowerCase().includes(options.searchText?.toLowerCase() || ''),
    );
  }

  // Apply status filters
  if (options.statusFilters && options.statusFilters.length > 0) {
    filteredListings = filteredListings.filter((listing) =>
      options.statusFilters?.includes(listing.status),
    );
  }

  // Apply sorter
  if (options.sorter?.field) {
    filteredListings.sort((a, b) => {
      const fieldA = a[options.sorter?.field as keyof typeof a];
      const fieldB = b[options.sorter?.field as keyof typeof b];

      // Handle undefined cases for sorting
      if (fieldA === undefined || fieldA === null)
        return options.sorter?.order === 'ascend' ? -1 : 1;
      if (fieldB === undefined || fieldB === null)
        return options.sorter?.order === 'ascend' ? 1 : -1;

      if (fieldA < fieldB) {
        return options.sorter?.order === 'ascend' ? -1 : 1;
      }
      if (fieldA > fieldB) {
        return options.sorter?.order === 'ascend' ? 1 : -1;
      }
      return 0;
    });
  }

  const total = filteredListings.length;
  const startIndex = (options.page - 1) * options.pageSize;
  const endIndex = startIndex + options.pageSize;
  const items = filteredListings.slice(startIndex, endIndex);

  return {
    items,
    total,
    page: options.page,
    pageSize: options.pageSize,
  };
}

const itemListingResolvers = {
  Query: {
    itemListings: () => {
      return DUMMY_LISTINGS.map((listing: ItemListing) => ({
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
      const listing = DUMMY_LISTINGS.find((l: ItemListing) => l._id === args.id);
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
    // My Listings queries
    myListingsAll: (_parent: unknown, args: MyListingsArgs, _context: GraphContext) => {
      console.log('myListingsAll resolver called with args:', args);
      
      // Use mock data to get paginated listings
      const result = getMyListingsWithPagination(args);
      
      return result;
    },
    
  },
};

export default itemListingResolvers;