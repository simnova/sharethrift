import type { 
  ListingRequestPage, 
  MyListingsRequestsQueryInput,
  ListingRequestDTO,
  RequestStatus 
} from './my-listings.dto.ts';

// Mock service for reservation requests - will be replaced with actual repository calls
class MockReservationRequestService {
  private mockRequests = [
    {
      id: '1',
      listingId: '2', // City Bike
      title: 'City Bike',
      image: 'bike.jpg',
      requestedBy: '@patrickg',
      requestedOn: new Date('2025-12-23'),
      reservationPeriod: {
        start: new Date('2020-11-08'),
        end: new Date('2020-12-23')
      },
      status: 'Pending' as RequestStatus,
      listingSharer: 'currentUser'
    },
    {
      id: '2',
      listingId: '5', // Camping Tent
      title: 'Camping Tent',
      image: 'tent.jpg',
      requestedBy: '@jasonm',
      requestedOn: new Date('2025-01-03'),
      reservationPeriod: {
        start: new Date('2020-11-08'),
        end: new Date('2020-12-23')
      },
      status: 'Accepted' as RequestStatus,
      listingSharer: 'currentUser'
    },
    {
      id: '3',
      listingId: '5', // Camping Tent (another request)
      title: 'Camping Tent',
      image: 'tent.jpg',
      requestedBy: '@shannonj',
      requestedOn: new Date('2025-01-12'),
      reservationPeriod: {
        start: new Date('2020-11-08'),
        end: new Date('2020-12-23')
      },
      status: 'Rejected' as RequestStatus,
      listingSharer: 'currentUser'
    },
    {
      id: '4',
      listingId: '5', // Camping Tent (closed request)
      title: 'Camping Tent',
      image: 'tent.jpg',
      requestedBy: '@patrickg',
      requestedOn: new Date('2024-04-02'),
      reservationPeriod: {
        start: new Date('2020-11-08'),
        end: new Date('2020-12-23')
      },
      status: 'Closed' as RequestStatus,
      listingSharer: 'currentUser'
    },
    {
      id: '5',
      listingId: '2', // City Bike (cancelled request)
      title: 'City Bike',
      image: 'bike.jpg',
      requestedBy: '@jasonm',
      requestedOn: new Date('2024-02-22'),
      reservationPeriod: {
        start: new Date('2020-11-08'),
        end: new Date('2020-12-23')
      },
      status: 'Closed' as RequestStatus,
      listingSharer: 'currentUser'
    },
    {
      id: '6',
      listingId: '5', // Camping Tent (cancelled)
      title: 'Camping Tent',
      image: 'tent.jpg',
      requestedBy: '@kishore',
      requestedOn: new Date('2022-05-17'),
      reservationPeriod: {
        start: new Date('2020-11-08'),
        end: new Date('2020-12-23')
      },
      status: 'Closed' as RequestStatus,
      listingSharer: 'currentUser'
    }
  ];

  getMyListingsRequests(input: MyListingsRequestsQueryInput): Promise<ListingRequestPage> {
    let filteredRequests = [...this.mockRequests];

    // Filter by listing owner (current user)
    filteredRequests = filteredRequests.filter(request => request.listingSharer === 'currentUser');

    // Apply search filter (search in listing title and requester name)
    if (input.searchText) {
      const searchLower = input.searchText.toLowerCase();
      filteredRequests = filteredRequests.filter(request =>
        request.title.toLowerCase().includes(searchLower) ||
        request.requestedBy.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (input.statusFilter && input.statusFilter.length > 0) {
      filteredRequests = filteredRequests.filter(request =>
        input.statusFilter?.includes(request.status)
      );
    }

    // Apply sorting
    if (input.sortBy) {
      filteredRequests.sort((a, b) => {
        let comparison = 0;
        
        switch (input.sortBy) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'requestedBy':
            comparison = a.requestedBy.localeCompare(b.requestedBy);
            break;
          case 'requestedOn':
            comparison = a.requestedOn.getTime() - b.requestedOn.getTime();
            break;
          case 'reservationPeriod':
            comparison = a.reservationPeriod.start.getTime() - b.reservationPeriod.start.getTime();
            break;
        }
        
        return input.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // Calculate pagination
    const total = filteredRequests.length;
    const skip = (input.page - 1) * input.pageSize;
    const paginatedRequests = filteredRequests.slice(skip, skip + input.pageSize);

    // Transform to DTOs
    const items: ListingRequestDTO[] = paginatedRequests.map(request => ({
      id: request.id,
      title: request.title,
      image: request.image,
      requestedBy: request.requestedBy,
      requestedOn: request.requestedOn,
      reservationPeriod: request.reservationPeriod,
      status: request.status
    }));

    return Promise.resolve({
      items,
      total,
      page: input.page,
      pageSize: input.pageSize
    });
  }
}

export class MyListingsRequestsQuery {
  private mockService = new MockReservationRequestService();

  execute(input: MyListingsRequestsQueryInput): Promise<ListingRequestPage> {
    // TODO: Replace with actual repository calls when ReservationRequest domain is implemented
    return this.mockService.getMyListingsRequests(input);
  }
}