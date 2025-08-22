import type { 
  ListingAllPage, 
  MyListingsAllQueryInput,
  ListingAllDTO,
  ListingStatus 
} from './my-listings.dto.ts';

// Mock service for now - will be replaced with actual repository calls
class MockListingService {
  private mockListings = [
    {
      id: '1',
      title: 'Cordless Drill',
      image: 'drill.jpg',
      publishedAt: new Date('2025-12-23'),
      reservationPeriod: {
        start: new Date('2020-11-08'),
        end: new Date('2020-12-23')
      },
      status: 'Paused' as ListingStatus,
      pendingRequestsCount: 0,
      sharer: 'currentUser'
    },
    {
      id: '2',
      title: 'City Bike',
      image: 'bike.jpg',
      publishedAt: new Date('2025-01-03'),
      reservationPeriod: {
        start: new Date('2020-11-08'),
        end: new Date('2020-12-23')
      },
      status: 'Active' as ListingStatus,
      pendingRequestsCount: 2,
      sharer: 'currentUser'
    },
    {
      id: '3',
      title: 'Sewing Kit',
      image: 'sewing.jpg',
      publishedAt: new Date('2025-01-12'),
      reservationPeriod: {
        start: new Date('2020-11-08'),
        end: new Date('2020-12-23')
      },
      status: 'Expired' as ListingStatus,
      pendingRequestsCount: 0,
      sharer: 'currentUser'
    },
    {
      id: '4',
      title: 'Monopoly Board Game',
      image: 'monopoly.jpg',
      publishedAt: new Date('2024-04-02'),
      reservationPeriod: {
        start: new Date('2020-11-08'),
        end: new Date('2020-12-23')
      },
      status: 'Blocked' as ListingStatus,
      pendingRequestsCount: 0,
      sharer: 'currentUser'
    },
    {
      id: '5',
      title: 'Camping Tent',
      image: 'tent.jpg',
      publishedAt: new Date('2024-02-22'),
      reservationPeriod: {
        start: new Date('2020-11-08'),
        end: new Date('2020-12-23')
      },
      status: 'Reserved' as ListingStatus,
      pendingRequestsCount: 1,
      sharer: 'currentUser'
    },
    {
      id: '6',
      title: 'Outdoor Table And Chairs',
      image: 'table.jpg',
      publishedAt: new Date('2022-05-17'),
      reservationPeriod: {
        start: new Date('2020-11-08'),
        end: new Date('2020-12-23')
      },
      status: 'Draft' as ListingStatus,
      pendingRequestsCount: 0,
      sharer: 'currentUser'
    }
  ];

  getMyListingsAll(input: MyListingsAllQueryInput): Promise<ListingAllPage> {
    let filteredListings = [...this.mockListings];

    // Filter by user
    filteredListings = filteredListings.filter(listing => listing.sharer === 'currentUser');

    // Apply search filter
    if (input.searchText) {
      const searchLower = input.searchText.toLowerCase();
      filteredListings = filteredListings.filter(listing =>
        listing.title.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (input.statusFilter && input.statusFilter.length > 0) {
      filteredListings = filteredListings.filter(listing =>
        input.statusFilter?.includes(listing.status)
      );
    }

    // Apply sorting
    if (input.sortBy) {
      filteredListings.sort((a, b) => {
        let comparison = 0;
        
        switch (input.sortBy) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'publishedAt':
            comparison = a.publishedAt.getTime() - b.publishedAt.getTime();
            break;
          case 'reservationPeriod':
            comparison = a.reservationPeriod.start.getTime() - b.reservationPeriod.start.getTime();
            break;
          case 'pendingRequestsCount':
            comparison = a.pendingRequestsCount - b.pendingRequestsCount;
            break;
        }
        
        return input.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // Calculate pagination
    const total = filteredListings.length;
    const skip = (input.page - 1) * input.pageSize;
    const paginatedListings = filteredListings.slice(skip, skip + input.pageSize);

    // Transform to DTOs
    const items: ListingAllDTO[] = paginatedListings.map(listing => ({
      id: listing.id,
      title: listing.title,
      image: listing.image,
      publishedAt: listing.publishedAt,
      reservationPeriod: listing.reservationPeriod,
      status: listing.status,
      pendingRequestsCount: listing.pendingRequestsCount
    }));

    return Promise.resolve({
      items,
      total,
      page: input.page,
      pageSize: input.pageSize
    });
  }
}

export class MyListingsAllQuery {
  private mockService = new MockListingService();

  execute(input: MyListingsAllQueryInput): Promise<ListingAllPage> {
    // TODO: Replace with actual repository calls when domain is implemented
    return this.mockService.getMyListingsAll(input);
  }
}