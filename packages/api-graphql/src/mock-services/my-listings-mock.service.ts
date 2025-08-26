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
      id: '1',
      title: 'Cordless Drill',
      image: 'https://example.com/drill.jpg',
      publishedAt: '2025-12-23',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Paused',
      pendingRequestsCount: 0,
    },
    {
      id: '2',
      title: 'City Bike',
      image: 'https://example.com/bike.jpg',
      publishedAt: '2025-01-03',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Active',
      pendingRequestsCount: 2,
    },
    {
      id: '3',
      title: 'Sewing Kit',
      image: 'https://example.com/sewing.jpg',
      publishedAt: '2025-01-12',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Expired',
      pendingRequestsCount: 0,
    },
    {
      id: '4',
      title: 'Monopoly Board Game',
      image: 'https://example.com/monopoly.jpg',
      publishedAt: '2024-04-02',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Blocked',
      pendingRequestsCount: 0,
    },
    {
      id: '5',
      title: 'Camping Tent',
      image: 'https://example.com/tent.jpg',
      publishedAt: '2024-02-22',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Reserved',
      pendingRequestsCount: 1,
    },
    {
      id: '6',
      title: 'Outdoor Table And Chairs',
      image: 'https://example.com/table.jpg',
      publishedAt: '2022-05-17',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Draft',
      pendingRequestsCount: 0,
    },
    {
      id: '7',
      title: 'Digital Camera',
      image: 'https://example.com/camera.jpg',
      publishedAt: '2024-08-15',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Active',
      pendingRequestsCount: 3,
    },
    {
      id: '8',
      title: 'Electric Guitar',
      image: 'https://example.com/guitar.jpg',
      publishedAt: '2024-06-10',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Paused',
      pendingRequestsCount: 1,
    },
    {
      id: '9',
      title: 'Vacuum Cleaner',
      image: 'https://example.com/vacuum.jpg',
      publishedAt: '2024-03-28',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Active',
      pendingRequestsCount: 0,
    },
    {
      id: '10',
      title: 'Lawn Mower',
      image: 'https://example.com/mower.jpg',
      publishedAt: '2024-07-14',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Expired',
      pendingRequestsCount: 0,
    },
    {
      id: '11',
      title: 'Power Tools Set',
      image: 'https://example.com/tools.jpg',
      publishedAt: '2024-05-20',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Draft',
      pendingRequestsCount: 0,
    },
    {
      id: '12',
      title: 'Kitchen Mixer',
      image: 'https://example.com/mixer.jpg',
      publishedAt: '2024-09-05',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Active',
      pendingRequestsCount: 2,
    },
    {
      id: '13',
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
      id: '2',
      title: 'City Bike',
      image: 'https://example.com/bike.jpg',
      requestedBy: '@patrickg',
      requestedOn: '2025-12-23',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Pending',
    },
    {
      id: '5',
      title: 'Camping Tent',
      image: 'https://example.com/tent.jpg',
      requestedBy: '@jasonm',
      requestedOn: '2025-01-03',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Accepted',
    },
    {
      id: '5',
      title: 'Camping Tent',
      image: 'https://example.com/tent.jpg',
      requestedBy: '@shannonj',
      requestedOn: '2025-01-12',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Rejected',
    },
    {
      id: '5',
      title: 'Camping Tent',
      image: 'https://example.com/tent.jpg',
      requestedBy: '@patrickg',
      requestedOn: '2024-04-02',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Closed',
    },
    {
      id: '2',
      title: 'City Bike',
      image: 'https://example.com/bike.jpg',
      requestedBy: '@jasonm',
      requestedOn: '2024-02-22',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Cancelled',
    },
    {
      id: '5',
      title: 'Camping Tent',
      image: 'https://example.com/tent.jpg',
      requestedBy: '@kishorg',
      requestedOn: '2022-05-17',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Cancelled',
    },
    {
      id: '7',
      title: 'Digital Camera',
      image: 'https://example.com/camera.jpg',
      requestedBy: '@patrickg',
      requestedOn: '2024-08-15',
      reservationPeriod: '2020-11-08 - 2020-12-23',
      status: 'Pending',
    },
    {
      id: '12',
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
    const { page, pageSize } = options;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const items = this.mockListings.slice(startIndex, endIndex);
    
    return {
      items,
      total: this.mockListings.length,
      page,
      pageSize,
    };
  }

  /**
   * Get paginated listing requests for a user
   */
  getMyListingRequests(options: PaginationOptions): PageResult<MockListingRequest> {
    const { page, pageSize } = options;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const items = this.mockRequests.slice(startIndex, endIndex);
    
    return {
      items,
      total: this.mockRequests.length,
      page,
      pageSize,
    };
  }
}

// Singleton instance
export const myListingsMockService = new MyListingsMockService();