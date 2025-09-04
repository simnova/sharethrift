export interface MockListing {
  id: string;
  title: string;
  image?: string;
  publishedAt: string;
  reservationPeriod: string;
  status: string;
  pendingRequestsCount: number;
}

export interface MockListingRequest {
  id: string;
  title: string;
  image?: string;
  requestedBy: string;
  requestedOn: string;
  reservationPeriod: string;
  status: string;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
  searchText?: string | undefined;
  statusFilters?: string[] | undefined;
  sorter?:
    | {
        field: string;
        order: 'ascend' | 'descend';
      }
    | undefined;
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export class MyListingsMockService {
  private mockListings: MockListing[] = [
    {
      id: '6324a3f1e3e4e1e6a8e1d8a1',
      title: 'Cordless Drill',
      image: 'https://example.com/drill.jpg',
      publishedAt: '2025-12-23',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Paused',
      pendingRequestsCount: 0,
    },
    {
      id: '6324a3f1e3e4e1e6a8e1d8a2',
      title: 'City Bike',
      image: 'https://example.com/bike.jpg',
      publishedAt: '2025-01-03',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Active',
      pendingRequestsCount: 2,
    },
    {
      id: '6324a3f1e3e4e1e6a8e1d8a3',
      title: 'Sewing Kit',
      image: 'https://example.com/sewing.jpg',
      publishedAt: '2025-01-12',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Expired',
      pendingRequestsCount: 0,
    },
    {
      id: '6324a3f1e3e4e1e6a8e1d8a4',
      title: 'Monopoly Board Game',
      image: 'https://example.com/monopoly.jpg',
      publishedAt: '2024-04-02',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Blocked',
      pendingRequestsCount: 0,
    },
    {
      id: '6324a3f1e3e4e1e6a8e1d8a5',
      title: 'Camping Tent',
      image: 'https://example.com/tent.jpg',
      publishedAt: '2024-02-22',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Reserved',
      pendingRequestsCount: 1,
    },
    {
      id: '6324a3f1e3e4e1e6a8e1d8a6',
      title: 'Outdoor Table And Chairs',
      image: 'https://example.com/table.jpg',
      publishedAt: '2022-05-17',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Draft',
      pendingRequestsCount: 0,
    },
    {
      id: '6324a3f1e3e4e1e6a8e1d8a7',
      title: 'Digital Camera',
      image: 'https://example.com/camera.jpg',
      publishedAt: '2024-08-15',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Active',
      pendingRequestsCount: 3,
    },
    {
      id: '6324a3f1e3e4e1e6a8e1d8a8',
      title: 'Electric Guitar',
      image: 'https://example.com/guitar.jpg',
      publishedAt: '2024-06-10',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Paused',
      pendingRequestsCount: 1,
    },
    {
      id: '6324a3f1e3e4e1e6a8e1d8a9',
      title: 'Vacuum Cleaner',
      image: 'https://example.com/vacuum.jpg',
      publishedAt: '2024-03-28',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Active',
      pendingRequestsCount: 0,
    },
    {
      id: '6324a3f1e3e4e1e6a8e1d8b0',
      title: 'Lawn Mower',
      image: 'https://example.com/mower.jpg',
      publishedAt: '2024-07-14',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Expired',
      pendingRequestsCount: 0,
    },
    {
      id: '6324a3f1e3e4e1e6a8e1d8b1',
      title: 'Power Tools Set',
      image: 'https://example.com/tools.jpg',
      publishedAt: '2024-05-20',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Draft',
      pendingRequestsCount: 0,
    },
    {
      id: '6324a3f1e3e4e1e6a8e1d8b2',
      title: 'Kitchen Mixer',
      image: 'https://example.com/mixer.jpg',
      publishedAt: '2024-09-05',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Active',
      pendingRequestsCount: 2,
    },
    {
      id: '6324a3f1e3e4e1e6a8e1d8b3',
      title: 'Gaming Console',
      image: 'https://example.com/console.jpg',
      publishedAt: '2024-04-18',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Blocked',
      pendingRequestsCount: 0,
    }
  ];

  private mockRequests: MockListingRequest[] = [
    {
      id: '6324a3f1e3e4e1e6a8e1d8a2',
      title: 'City Bike',
      image: 'https://example.com/bike.jpg',
      requestedBy: '@patrickg',
      requestedOn: '2025-12-23',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Pending',
    },
    {
      id: '6324a3f1e3e4e1e6a8e1d8a5',
      title: 'Camping Tent',
      image: 'https://example.com/tent.jpg',
      requestedBy: '@jasonm',
      requestedOn: '2025-01-03',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Accepted',
    },
    {
      id: '6324a3f1e3e4e1e6a8e1d8a5',
      title: 'Camping Tent',
      image: 'https://example.com/tent.jpg',
      requestedBy: '@shannonj',
      requestedOn: '2025-01-12',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Rejected',
    },
    {
      id: '6324a3f1e3e4e1e6a8e1d8a5',
      title: 'Camping Tent',
      image: 'https://example.com/tent.jpg',
      requestedBy: '@patrickg',
      requestedOn: '2024-04-02',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Closed',
    },
    {
      id: '6324a3f1e3e4e1e6a8e1d8a2',
      title: 'City Bike',
      image: 'https://example.com/bike.jpg',
      requestedBy: '@jasonm',
      requestedOn: '2024-02-22',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Cancelled',
    },
    {
      id: '6324a3f1e3e4e1e6a8e1d8a5',
      title: 'Camping Tent',
      image: 'https://example.com/tent.jpg',
      requestedBy: '@kishorg',
      requestedOn: '2022-05-17',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Cancelled',
    },
    {
      id: '6324a3f1e3e4e1e6a8e1d8a7',
      title: 'Digital Camera',
      image: 'https://example.com/camera.jpg',
      requestedBy: '@patrickg',
      requestedOn: '2024-08-15',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Pending',
    },
    {
      id: '6324a3f1e3e4e1e6a8e1d8b2',
      title: 'Kitchen Mixer',
      image: 'https://example.com/mixer.jpg',
      requestedBy: '@jasonm',
      requestedOn: '2024-06-10',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Accepted',
    }
  ];

  /**
   * Get paginated listings for a user
   */
  getMyListings(options: PaginationOptions): PageResult<MockListing> {
    const { page, pageSize, searchText, statusFilters, sorter } = options;
    let filteredListings = this.mockListings;

    // Apply search text filter
    if (searchText) {
      filteredListings = filteredListings.filter((listing) =>
        listing.title.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    // Apply status filters
    if (statusFilters && statusFilters.length > 0) {
      filteredListings = filteredListings.filter((listing) =>
        statusFilters.includes(listing.status),
      );
    }

    // Apply sorter
    if (sorter && sorter.field) {
      filteredListings.sort((a, b) => {
        const fieldA = a[sorter.field as keyof MockListing];
        const fieldB = b[sorter.field as keyof MockListing];

        // Handle undefined cases for sorting
        if (fieldA === undefined || fieldA === null) return sorter.order === 'ascend' ? -1 : 1;
        if (fieldB === undefined || fieldB === null) return sorter.order === 'ascend' ? 1 : -1;

        if (fieldA < fieldB) {
          return sorter.order === 'ascend' ? -1 : 1;
        }
        if (fieldA > fieldB) {
          return sorter.order === 'ascend' ? 1 : -1;
        }
        return 0;
      });
    }

    const total = filteredListings.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = filteredListings.slice(startIndex, endIndex);

    return {
      items,
      total,
      page,
      pageSize,
    };
  }

  /**
   * Get paginated listing requests for a user
   */
  getMyListingRequests(options: PaginationOptions): PageResult<MockListingRequest> {
    const { page, pageSize, searchText, statusFilters, sorter } = options;
    let filteredRequests = this.mockRequests;

    // Apply search text filter
    if (searchText) {
      filteredRequests = filteredRequests.filter((request) =>
        request.title.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    // Apply status filters
    if (statusFilters && statusFilters.length > 0) {
      filteredRequests = filteredRequests.filter((request) =>
        statusFilters.includes(request.status),
      );
    }

    // Apply sorter
    if (sorter && sorter.field) {
      filteredRequests.sort((a, b) => {
        const fieldA = a[sorter.field as keyof MockListingRequest];
        const fieldB = b[sorter.field as keyof MockListingRequest];

        // Handle undefined cases for sorting
        if (fieldA === undefined || fieldA === null) return sorter.order === 'ascend' ? -1 : 1;
        if (fieldB === undefined || fieldB === null) return sorter.order === 'ascend' ? 1 : -1;

        if (fieldA < fieldB) {
          return sorter.order === 'ascend' ? -1 : 1;
        }
        if (fieldA > fieldB) {
          return sorter.order === 'ascend' ? 1 : -1;
        }
        return 0;
      });
    }

    const total = filteredRequests.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = filteredRequests.slice(startIndex, endIndex);

    return {
      items,
      total,
      page,
      pageSize,
    };
  }
}

// Singleton instance
export const myListingsMockService = new MyListingsMockService();