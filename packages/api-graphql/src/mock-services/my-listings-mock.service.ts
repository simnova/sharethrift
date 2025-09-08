// Extended listing interface for My Listings dashboard
export interface MyListing {
    id: string;
    sharer: string;
    title: string;
    description: string;
    category: string;
    location: string;
    sharingPeriodStart: Date;
    sharingPeriodEnd: Date;
    publishedAt: Date;
    status: 'Active' | 'Paused' | 'Reserved' | 'Expired' | 'Draft' | 'Blocked';
    pendingRequestsCount: number;
    images: string[]; // Changed to array to support multiple images
    createdAt: Date;
    updatedAt: Date;
}

// Request interface for the Requests tab
export interface ListingRequest {
    id: string;
    listingId: string;
    listing: {
        id: string;
        title: string;
        images: string[];
    };
    requestedBy: string; // username
    requestedByUserId: string;
    requestedOn: Date;
    reservationPeriodStart: Date;
    reservationPeriodEnd: Date;
    status:
        | 'Accepted'
        | 'Rejected'
        | 'Closed'
        | 'Pending'
        | 'Closing'
        | 'Cancelled';
    createdAt: Date;
    updatedAt: Date;
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

// Status color mapping
export const STATUS_COLORS = {
    Active: 'green',
    Paused: 'orange', // yellow shows poorly, using orange instead
    Reserved: 'blue',
    Draft: 'default',
    Cancelled: 'default',
    Closed: 'default',
    Blocked: 'purple',
    Expired: 'red',
    // Request statuses
    Accepted: 'green',
    Rejected: 'red',
    Pending: 'orange',
    Closing: 'orange',
} as const;

export type StatusColor = (typeof STATUS_COLORS)[keyof typeof STATUS_COLORS];

export class MyListingsMockService {
    private mockListings: MyListing[] = [
        {
            id: '6324a3f1e3e4e1e6a8e1d8b1',
            sharer: 'currentUser',
            title: 'Cordless Drill',
            description:
                'Professional grade cordless drill with multiple attachments.',
            category: 'Tools & Equipment',
            location: 'Philadelphia, PA',
            sharingPeriodStart: new Date('2020-11-08'),
            sharingPeriodEnd: new Date('2020-12-23'),
            publishedAt: new Date('2025-12-23'),
            status: 'Paused',
            pendingRequestsCount: 0,
            images: ['/assets/item-images/projector.png'],
            createdAt: new Date('2025-12-20'),
            updatedAt: new Date('2025-12-22'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d8b7',
            sharer: 'currentUser',
            title: 'Electric Guitar',
            description: 'Fender Stratocaster, perfect for gigs and practice.',
            category: 'Music & Instruments',
            location: 'Philadelphia, PA',
            sharingPeriodStart: new Date('2025-09-01'),
            sharingPeriodEnd: new Date('2025-09-30'),
            publishedAt: new Date('2025-08-30'),
            status: 'Active',
            pendingRequestsCount: 3,
            images: ['/assets/item-images/projector.png'],
            createdAt: new Date('2025-08-28'),
            updatedAt: new Date('2025-08-30'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d8b8',
            sharer: 'currentUser',
            title: 'Stand Mixer',
            description: 'KitchenAid stand mixer, great for baking.',
            category: 'Home & Kitchen',
            location: 'Philadelphia, PA',
            sharingPeriodStart: new Date('2025-10-01'),
            sharingPeriodEnd: new Date('2025-10-15'),
            publishedAt: new Date('2025-09-28'),
            status: 'Reserved',
            pendingRequestsCount: 1,
            images: ['/assets/item-images/sewing-machine.png'],
            createdAt: new Date('2025-09-25'),
            updatedAt: new Date('2025-09-28'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d8b9',
            sharer: 'currentUser',
            title: 'Bubble Chair',
            description: 'Modern bubble chair, transparent acrylic.',
            category: 'Furniture',
            location: 'Philadelphia, PA',
            sharingPeriodStart: new Date('2025-11-01'),
            sharingPeriodEnd: new Date('2025-11-15'),
            publishedAt: new Date('2025-10-30'),
            status: 'Draft',
            pendingRequestsCount: 0,
            images: ['/assets/item-images/bubble-chair.png'],
            createdAt: new Date('2025-10-28'),
            updatedAt: new Date('2025-10-30'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d8c0',
            sharer: 'currentUser',
            title: 'Projector',
            description: 'HD projector, great for movie nights.',
            category: 'Electronics',
            location: 'Philadelphia, PA',
            sharingPeriodStart: new Date('2025-12-01'),
            sharingPeriodEnd: new Date('2025-12-10'),
            publishedAt: new Date('2025-11-28'),
            status: 'Blocked',
            pendingRequestsCount: 0,
            images: ['/assets/item-images/projector.png'],
            createdAt: new Date('2025-11-25'),
            updatedAt: new Date('2025-11-28'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d8b2',
            sharer: 'currentUser',
            title: 'City Bike',
            description: 'Perfect city bike for commuting and leisure rides.',
            category: 'Vehicles & Transportation',
            location: 'Philadelphia, PA',
            sharingPeriodStart: new Date('2020-11-08'),
            sharingPeriodEnd: new Date('2020-12-23'),
            publishedAt: new Date('2025-01-03'),
            status: 'Active',
            pendingRequestsCount: 2,
            images: ['/assets/item-images/bike.png'],
            createdAt: new Date('2024-12-20'),
            updatedAt: new Date('2025-01-02'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d8b3',
            sharer: 'currentUser',
            title: 'Sewing Kit',
            description:
                'Complete sewing kit with threads, needles, and accessories.',
            category: 'Home & Garden',
            location: 'Philadelphia, PA',
            sharingPeriodStart: new Date('2020-11-08'),
            sharingPeriodEnd: new Date('2020-12-23'),
            publishedAt: new Date('2025-01-12'),
            status: 'Expired',
            pendingRequestsCount: 0,
            images: ['/assets/item-images/sewing-machine.png'],
            createdAt: new Date('2025-01-10'),
            updatedAt: new Date('2025-01-12'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d8b4',
            sharer: 'currentUser',
            title: 'Monopoly Board Game',
            description: 'Classic board game for family game nights.',
            category: 'Books & Media',
            location: 'Philadelphia, PA',
            sharingPeriodStart: new Date('2020-11-08'),
            sharingPeriodEnd: new Date('2020-12-23'),
            publishedAt: new Date('2024-04-02'),
            status: 'Blocked',
            pendingRequestsCount: 0,
            images: ['/assets/item-images/bubble-chair.png'],
            createdAt: new Date('2024-03-30'),
            updatedAt: new Date('2024-04-01'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d8b5',
            sharer: 'currentUser',
            title: 'Camping Tent',
            description: '4-person camping tent with easy setup.',
            category: 'Sports & Outdoors',
            location: 'Philadelphia, PA',
            sharingPeriodStart: new Date('2020-11-08'),
            sharingPeriodEnd: new Date('2020-12-23'),
            publishedAt: new Date('2024-02-22'),
            status: 'Reserved',
            pendingRequestsCount: 1,
            images: ['/assets/item-images/tent.png'],
            createdAt: new Date('2024-02-20'),
            updatedAt: new Date('2024-02-22'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d8b6',
            sharer: 'currentUser',
            title: 'Outdoor Table And Chairs',
            description: 'Perfect for outdoor dining and gatherings.',
            category: 'Home & Garden',
            location: 'Philadelphia, PA',
            sharingPeriodStart: new Date('2020-11-08'),
            sharingPeriodEnd: new Date('2020-12-23'),
            publishedAt: new Date('2022-05-17'),
            status: 'Draft',
            pendingRequestsCount: 0,
            images: ['/assets/item-images/armchair.png'],
            createdAt: new Date('2022-05-15'),
            updatedAt: new Date('2022-05-17'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d8c1',
            sharer: 'currentUser',
            title: 'GoPro Hero 9',
            description: 'Action camera, waterproof, 4K video.',
            category: 'Electronics',
            location: 'Philadelphia, PA',
            sharingPeriodStart: new Date('2025-09-10'),
            sharingPeriodEnd: new Date('2025-09-20'),
            publishedAt: new Date('2025-09-09'),
            status: 'Active',
            pendingRequestsCount: 4,
            images: ['/assets/item-images/projector.png'],
            createdAt: new Date('2025-09-08'),
            updatedAt: new Date('2025-09-09'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d8c2',
            sharer: 'currentUser',
            title: 'Inflatable Kayak',
            description: '2-person kayak, includes paddles and pump.',
            category: 'Sports & Outdoors',
            location: 'Philadelphia, PA',
            sharingPeriodStart: new Date('2025-07-01'),
            sharingPeriodEnd: new Date('2025-07-10'),
            publishedAt: new Date('2025-06-28'),
            status: 'Paused',
            pendingRequestsCount: 1,
            images: ['/assets/item-images/tent.png'],
            createdAt: new Date('2025-06-25'),
            updatedAt: new Date('2025-06-28'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d8c3',
            sharer: 'currentUser',
            title: 'Vintage Typewriter',
            description: 'Classic Remington, fully functional.',
            category: 'Books & Media',
            location: 'Philadelphia, PA',
            sharingPeriodStart: new Date('2025-03-01'),
            sharingPeriodEnd: new Date('2025-03-15'),
            publishedAt: new Date('2025-02-28'),
            status: 'Blocked',
            pendingRequestsCount: 0,
            images: ['/assets/item-images/armchair.png'],
            createdAt: new Date('2025-02-25'),
            updatedAt: new Date('2025-02-28'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d8c4',
            sharer: 'currentUser',
            title: 'Yoga Mat',
            description: 'Eco-friendly, non-slip, extra thick.',
            category: 'Sports & Outdoors',
            location: 'Philadelphia, PA',
            sharingPeriodStart: new Date('2025-05-01'),
            sharingPeriodEnd: new Date('2025-05-10'),
            publishedAt: new Date('2025-04-28'),
            status: 'Draft',
            pendingRequestsCount: 0,
            images: ['/assets/item-images/bubble-chair.png'],
            createdAt: new Date('2025-04-25'),
            updatedAt: new Date('2025-04-28'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d8c5',
            sharer: 'currentUser',
            title: 'Bluetooth Speaker',
            description: 'Portable JBL speaker, waterproof.',
            category: 'Electronics',
            location: 'Philadelphia, PA',
            sharingPeriodStart: new Date('2025-08-01'),
            sharingPeriodEnd: new Date('2025-08-05'),
            publishedAt: new Date('2025-07-30'),
            status: 'Reserved',
            pendingRequestsCount: 2,
            images: ['/assets/item-images/projector.png'],
            createdAt: new Date('2025-07-28'),
            updatedAt: new Date('2025-07-30'),
        },
    ];

    private mockRequests: ListingRequest[] = [
        {
            id: '6324a3f1e3e4e1e6a8e1d9b1',
            listingId: '6324a3f1e3e4e1e6a8e1d8b2',
            listing: {
                id: '6324a3f1e3e4e1e6a8e1d8b2',
                title: 'City Bike',
                images: ['/assets/item-images/bike.png'],
            },
            requestedBy: '@patrickg',
            requestedByUserId: 'patrick123',
            requestedOn: new Date('2025-12-23'),
            reservationPeriodStart: new Date('2020-11-08'),
            reservationPeriodEnd: new Date('2020-12-23'),
            status: 'Pending',
            createdAt: new Date('2025-12-20'),
            updatedAt: new Date('2025-12-22'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d9b7',
            listingId: '6324a3f1e3e4e1e6a8e1d8b7',
            listing: {
                id: '6324a3f1e3e4e1e6a8e1d8b7',
                title: 'Electric Guitar',
                images: ['/assets/item-images/projector.png'],
            },
            requestedBy: '@musicfan',
            requestedByUserId: 'musicfan007',
            requestedOn: new Date('2025-09-02'),
            reservationPeriodStart: new Date('2025-09-05'),
            reservationPeriodEnd: new Date('2025-09-10'),
            status: 'Accepted',
            createdAt: new Date('2025-09-01'),
            updatedAt: new Date('2025-09-02'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d9b8',
            listingId: '6324a3f1e3e4e1e6a8e1d8b8',
            listing: {
                id: '6324a3f1e3e4e1e6a8e1d8b8',
                title: 'Stand Mixer',
                images: ['/assets/item-images/sewing-machine.png'],
            },
            requestedBy: '@bakerella',
            requestedByUserId: 'bakequeen',
            requestedOn: new Date('2025-10-02'),
            reservationPeriodStart: new Date('2025-10-03'),
            reservationPeriodEnd: new Date('2025-10-07'),
            status: 'Pending',
            createdAt: new Date('2025-10-01'),
            updatedAt: new Date('2025-10-02'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d9b9',
            listingId: '6324a3f1e3e4e1e6a8e1d8b9',
            listing: {
                id: '6324a3f1e3e4e1e6a8e1d8b9',
                title: 'Bubble Chair',
                images: ['/assets/item-images/bubble-chair.png'],
            },
            requestedBy: '@lounger',
            requestedByUserId: 'loungerx',
            requestedOn: new Date('2025-11-02'),
            reservationPeriodStart: new Date('2025-11-03'),
            reservationPeriodEnd: new Date('2025-11-10'),
            status: 'Rejected',
            createdAt: new Date('2025-11-01'),
            updatedAt: new Date('2025-11-02'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d9c0',
            listingId: '6324a3f1e3e4e1e6a8e1d8c0',
            listing: {
                id: '6324a3f1e3e4e1e6a8e1d8c0',
                title: 'Projector',
                images: ['/assets/item-images/projector.png'],
            },
            requestedBy: '@movienight',
            requestedByUserId: 'movielover',
            requestedOn: new Date('2025-12-02'),
            reservationPeriodStart: new Date('2025-12-03'),
            reservationPeriodEnd: new Date('2025-12-05'),
            status: 'Pending',
            createdAt: new Date('2025-12-01'),
            updatedAt: new Date('2025-12-02'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d9b2',
            listingId: '6324a3f1e3e4e1e6a8e1d8b5',
            listing: {
                id: '6324a3f1e3e4e1e6a8e1d8b5',
                title: 'Camping Tent',
                images: ['/assets/item-images/tent.png'],
            },
            requestedBy: '@jasonm',
            requestedByUserId: 'jason456',
            requestedOn: new Date('2025-01-03'),
            reservationPeriodStart: new Date('2020-11-08'),
            reservationPeriodEnd: new Date('2020-12-23'),
            status: 'Accepted',
            createdAt: new Date('2025-01-01'),
            updatedAt: new Date('2025-01-02'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d9b3',
            listingId: '6324a3f1e3e4e1e6a8e1d8b5',
            listing: {
                id: '6324a3f1e3e4e1e6a8e1d8b5',
                title: 'Camping Tent',
                images: ['/assets/item-images/tent.png'],
            },
            requestedBy: '@shannonj',
            requestedByUserId: 'shannon789',
            requestedOn: new Date('2025-01-12'),
            reservationPeriodStart: new Date('2020-11-08'),
            reservationPeriodEnd: new Date('2020-12-23'),
            status: 'Rejected',
            createdAt: new Date('2025-01-10'),
            updatedAt: new Date('2025-01-12'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d9b4',
            listingId: '6324a3f1e3e4e1e6a8e1d8b5',
            listing: {
                id: '6324a3f1e3e4e1e6a8e1d8b5',
                title: 'Camping Tent',
                images: ['/assets/item-images/tent.png'],
            },
            requestedBy: '@patrickg',
            requestedByUserId: 'patrick123',
            requestedOn: new Date('2024-04-02'),
            reservationPeriodStart: new Date('2020-11-08'),
            reservationPeriodEnd: new Date('2020-12-23'),
            status: 'Closed',
            createdAt: new Date('2024-03-30'),
            updatedAt: new Date('2024-04-01'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d9b5',
            listingId: '6324a3f1e3e4e1e6a8e1d8b2',
            listing: {
                id: '6324a3f1e3e4e1e6a8e1d8b2',
                title: 'City Bike',
                images: ['/assets/item-images/bike.png'],
            },
            requestedBy: '@jasonm',
            requestedByUserId: 'jason456',
            requestedOn: new Date('2024-02-22'),
            reservationPeriodStart: new Date('2020-11-08'),
            reservationPeriodEnd: new Date('2020-12-23'),
            status: 'Cancelled',
            createdAt: new Date('2024-02-20'),
            updatedAt: new Date('2024-02-22'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d9b6',
            listingId: '6324a3f1e3e4e1e6a8e1d8b2',
            listing: {
                id: '6324a3f1e3e4e1e6a8e1d8b2',
                title: 'City Bike',
                images: ['/assets/item-images/bike.png'],
            },
            requestedBy: '@kisharg',
            requestedByUserId: 'kishar999',
            requestedOn: new Date('2022-05-17'),
            reservationPeriodStart: new Date('2020-11-08'),
            reservationPeriodEnd: new Date('2020-12-23'),
            status: 'Cancelled',
            createdAt: new Date('2022-05-15'),
            updatedAt: new Date('2022-05-17'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d9c1',
            listingId: '6324a3f1e3e4e1e6a8e1d8c1',
            listing: {
                id: '6324a3f1e3e4e1e6a8e1d8c1',
                title: 'GoPro Hero 9',
                images: ['/assets/item-images/projector.png'],
            },
            requestedBy: '@adventuregal',
            requestedByUserId: 'adventuregal',
            requestedOn: new Date('2025-09-11'),
            reservationPeriodStart: new Date('2025-09-12'),
            reservationPeriodEnd: new Date('2025-09-15'),
            status: 'Pending',
            createdAt: new Date('2025-09-10'),
            updatedAt: new Date('2025-09-11'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d9c2',
            listingId: '6324a3f1e3e4e1e6a8e1d8c2',
            listing: {
                id: '6324a3f1e3e4e1e6a8e1d8c2',
                title: 'Inflatable Kayak',
                images: ['/assets/item-images/tent.png'],
            },
            requestedBy: '@riverdude',
            requestedByUserId: 'riverdude',
            requestedOn: new Date('2025-07-02'),
            reservationPeriodStart: new Date('2025-07-03'),
            reservationPeriodEnd: new Date('2025-07-07'),
            status: 'Accepted',
            createdAt: new Date('2025-07-01'),
            updatedAt: new Date('2025-07-02'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d9c3',
            listingId: '6324a3f1e3e4e1e6a8e1d8c3',
            listing: {
                id: '6324a3f1e3e4e1e6a8e1d8c3',
                title: 'Vintage Typewriter',
                images: ['/assets/item-images/armchair.png'],
            },
            requestedBy: '@writerlife',
            requestedByUserId: 'writerlife',
            requestedOn: new Date('2025-03-02'),
            reservationPeriodStart: new Date('2025-03-03'),
            reservationPeriodEnd: new Date('2025-03-10'),
            status: 'Rejected',
            createdAt: new Date('2025-03-01'),
            updatedAt: new Date('2025-03-02'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d9c4',
            listingId: '6324a3f1e3e4e1e6a8e1d8c4',
            listing: {
                id: '6324a3f1e3e4e1e6a8e1d8c4',
                title: 'Yoga Mat',
                images: ['/assets/item-images/bubble-chair.png'],
            },
            requestedBy: '@yogini',
            requestedByUserId: 'yogini',
            requestedOn: new Date('2025-05-02'),
            reservationPeriodStart: new Date('2025-05-03'),
            reservationPeriodEnd: new Date('2025-05-05'),
            status: 'Closed',
            createdAt: new Date('2025-05-01'),
            updatedAt: new Date('2025-05-02'),
        },
        {
            id: '6324a3f1e3e4e1e6a8e1d9c5',
            listingId: '6324a3f1e3e4e1e6a8e1d8c5',
            listing: {
                id: '6324a3f1e3e4e1e6a8e1d8c5',
                title: 'Bluetooth Speaker',
                images: ['/assets/item-images/projector.png'],
            },
            requestedBy: '@musicfan',
            requestedByUserId: 'musicfan007',
            requestedOn: new Date('2025-08-02'),
            reservationPeriodStart: new Date('2025-08-03'),
            reservationPeriodEnd: new Date('2025-08-04'),
            status: 'Pending',
            createdAt: new Date('2025-08-01'),
            updatedAt: new Date('2025-08-02'),
        },
    ];

    /**
     * Get paginated listings for a user
     */
    getMyListings(options: PaginationOptions): PageResult<MyListing> {
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
        if (sorter?.field) {
            filteredListings.sort((a, b) => {
                const fieldA = a[sorter.field as keyof MyListing];
                const fieldB = b[sorter.field as keyof MyListing];

                // Handle undefined cases for sorting
                if (fieldA === undefined || fieldA === null)
                    return sorter.order === 'ascend' ? -1 : 1;
                if (fieldB === undefined || fieldB === null)
                    return sorter.order === 'ascend' ? 1 : -1;

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
    getMyListingRequests(
        options: PaginationOptions,
    ): PageResult<ListingRequest> {
        const { page, pageSize, searchText, statusFilters, sorter } = options;
        let filteredRequests = this.mockRequests;

        // Apply search text filter
        if (searchText) {
            filteredRequests = filteredRequests.filter((request) =>
                request.listing.title
                    .toLowerCase()
                    .includes(searchText.toLowerCase()),
            );
        }

        // Apply status filters
        if (statusFilters && statusFilters.length > 0) {
            filteredRequests = filteredRequests.filter((request) =>
                statusFilters.includes(request.status),
            );
        }

        // Apply sorter
        if (sorter?.field) {
            filteredRequests.sort((a, b) => {
                const fieldA =
                    sorter.field === 'title'
                        ? a.listing.title
                        : a[sorter.field as keyof ListingRequest];
                const fieldB =
                    sorter.field === 'title'
                        ? b.listing.title
                        : b[sorter.field as keyof ListingRequest];

                // Handle undefined cases for sorting
                if (fieldA === undefined || fieldA === null)
                    return sorter.order === 'ascend' ? -1 : 1;
                if (fieldB === undefined || fieldB === null)
                    return sorter.order === 'ascend' ? 1 : -1;

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