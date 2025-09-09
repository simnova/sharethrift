import type { GraphContext } from '../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';

interface MyListingRequestsArgs {
	page: number;
	pageSize: number;
	searchText?: string;
	statusFilters?: string[];
	sorter?: { field: string; order: 'ascend' | 'descend' };
}

// Mock data for My Listing Requests (will be moved to proper domain layer later)
const MOCK_MY_LISTING_REQUESTS = [
  {
    id: '6324a3f1e3e4e1e6a8e1d9b1',
    title: 'City Bike',
    image: '/assets/item-images/bike.png',
    requestedBy: '@patrickg',
    requestedOn: '2025-12-23',
    reservationPeriod: '2020-11-08 - 2020-12-23',
    status: 'Pending',
  },
  {
    id: '6324a3f1e3e4e1e6a8e1d9b7',
    title: 'Electric Guitar',
    image: '/assets/item-images/projector.png',
    requestedBy: '@musicfan',
    requestedOn: '2025-09-02',
    reservationPeriod: '2025-09-05 - 2025-09-10',
    status: 'Accepted',
  },
  {
    id: '6324a3f1e3e4e1e6a8e1d9b8',
    title: 'Stand Mixer',
    image: '/assets/item-images/sewing-machine.png',
    requestedBy: '@bakerella',
    requestedOn: '2025-10-02',
    reservationPeriod: '2025-10-03 - 2025-10-07',
    status: 'Pending',
  },
  {
    id: '6324a3f1e3e4e1e6a8e1d9b9',
    title: 'Bubble Chair',
    image: '/assets/item-images/bubble-chair.png',
    requestedBy: '@lounger',
    requestedOn: '2025-11-02',
    reservationPeriod: '2025-11-03 - 2025-11-10',
    status: 'Rejected',
  },
  {
    id: '6324a3f1e3e4e1e6a8e1d9c0',
    title: 'Projector',
    image: '/assets/item-images/projector.png',
    requestedBy: '@movienight',
    requestedOn: '2025-12-02',
    reservationPeriod: '2025-12-03 - 2025-12-05',
    status: 'Pending',
  },
];

function getMyListingRequestsWithPagination(options: MyListingRequestsArgs) {
  let filteredRequests = [...MOCK_MY_LISTING_REQUESTS];

  // Apply search text filter
  if (options.searchText) {
    filteredRequests = filteredRequests.filter((request) =>
      request.title.toLowerCase().includes(options.searchText?.toLowerCase() || ''),
    );
  }

  // Apply status filters
  if (options.statusFilters && options.statusFilters.length > 0) {
    filteredRequests = filteredRequests.filter((request) =>
      options.statusFilters?.includes(request.status),
    );
  }

  // Apply sorter
  if (options.sorter?.field) {
    filteredRequests.sort((a, b) => {
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

  const total = filteredRequests.length;
  const startIndex = (options.page - 1) * options.pageSize;
  const endIndex = startIndex + options.pageSize;
  const items = filteredRequests.slice(startIndex, endIndex);

  return {
    items,
    total,
    page: options.page,
    pageSize: options.pageSize,
  };
}

const reservationRequest = {
	Query: {
		myActiveReservations: async (
			_parent: unknown,
			args: { userId: string },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			return await context.applicationServices.ReservationRequest.ReservationRequest.queryActiveByReserverId({
                reserverId: args.userId
            });
		},
		myPastReservations: async (
			_parent: unknown,
			args: { userId: string },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			return await context.applicationServices.ReservationRequest.ReservationRequest.queryPastByReserverId({
                reserverId: args.userId
            });
		},
		myListingsRequests: (_parent: unknown, args: MyListingRequestsArgs, _context: GraphContext) => {
			console.log('myListingsRequests resolver called with args:', args);
			
			// Use mock data to get paginated reservation requests
			const result = getMyListingRequestsWithPagination(args);
			
			return result;
		},
	},
};

export default reservationRequest;
