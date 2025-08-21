/**
 * Application queries for My Listings Dashboard
 */

import type { ItemListingRepository, ItemListingProps } from '@sthrift/api-domain';
import type { 
	ListingAllPage,
	ListingRequestPage,
	ListingAllDTO,
	ListingRequestDTO
} from './listing.dto.ts';
import { RequestStatusDTO, ListingStatusDTO } from './listing.dto.ts';

export interface PaginationParams {
	page: number;
	pageSize: number;
}

/**
 * Query to get paginated listings created by the logged-in user
 */
export class MyListingsAllQuery {
	private mockListingService: MockListingService;

	constructor(
		_listingRepository: ItemListingRepository<ItemListingProps>,
		mockListingService: MockListingService
	) {
		this.mockListingService = mockListingService;
	}

	async execute(userId: string, pagination: PaginationParams): Promise<ListingAllPage> {
		// For now, use mock data - in real implementation this would use the repository
		return await this.mockListingService.getMyListingsAll(userId, pagination);
	}
}

/**
 * Query to get paginated listings that have incoming requests
 */
export class MyListingsRequestsQuery {
	private mockListingService: MockListingService;

	constructor(
		_listingRepository: ItemListingRepository<ItemListingProps>,
		mockListingService: MockListingService
	) {
		this.mockListingService = mockListingService;
	}

	async execute(userId: string, pagination: PaginationParams): Promise<ListingRequestPage> {
		// For now, use mock data - in real implementation this would use the repository
		return await this.mockListingService.getMyListingRequests(userId, pagination);
	}
}

/**
 * Mock service for providing test data with pagination
 * This will be replaced with real repository calls in the future
 */
export class MockListingService {
	private readonly mockListings: ListingAllDTO[] = [
		{
			id: '1',
			title: 'Professional Camera Kit',
			image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
			publishedAt: new Date('2024-01-15'),
			reservationPeriod: { start: new Date('2024-02-01'), end: new Date('2024-02-28') },
			status: ListingStatusDTO.Active,
			pendingRequestsCount: 3
		},
		{
			id: '2', 
			title: 'Power Drill Set',
			image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400',
			publishedAt: new Date('2024-01-10'),
			reservationPeriod: { start: new Date('2024-01-20'), end: new Date('2024-03-20') },
			status: ListingStatusDTO.Paused,
			pendingRequestsCount: 1
		},
		{
			id: '3',
			title: 'Camping Tent for 4',
			image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400',
			publishedAt: new Date('2024-01-05'),
			reservationPeriod: { start: new Date('2024-03-01'), end: new Date('2024-03-31') },
			status: ListingStatusDTO.Active,
			pendingRequestsCount: 0
		},
		{
			id: '4',
			title: 'Mountain Bike',
			image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
			publishedAt: new Date('2024-01-03'),
			reservationPeriod: { start: new Date('2024-02-15'), end: new Date('2024-04-15') },
			status: ListingStatusDTO.Reserved,
			pendingRequestsCount: 0
		},
		{
			id: '5',
			title: 'Lawn Mower',
			image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
			publishedAt: new Date('2023-12-20'),
			reservationPeriod: { start: new Date('2024-01-01'), end: new Date('2024-01-15') },
			status: ListingStatusDTO.Expired,
			pendingRequestsCount: 0
		},
		{
			id: '6',
			title: 'Professional Mixer',
			image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
			publishedAt: new Date('2024-01-12'),
			reservationPeriod: { start: new Date('2024-02-10'), end: new Date('2024-02-25') },
			status: ListingStatusDTO.Draft,
			pendingRequestsCount: 0
		},
		{
			id: '7',
			title: 'Party Speakers',
			image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
			publishedAt: new Date('2024-01-08'),
			reservationPeriod: { start: new Date('2024-02-20'), end: new Date('2024-03-05') },
			status: ListingStatusDTO.Active,
			pendingRequestsCount: 2
		},
		{
			id: '8',
			title: 'Kayak',
			image: 'https://images.unsplash.com/photo-1544966503-7cc0d1d8ff15?w=400',
			publishedAt: new Date('2024-01-01'),
			reservationPeriod: { start: new Date('2024-04-01'), end: new Date('2024-06-30') },
			status: ListingStatusDTO.Active,
			pendingRequestsCount: 1
		},
		{
			id: '9',
			title: 'Gaming Setup',
			image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
			publishedAt: new Date('2023-12-15'),
			reservationPeriod: { start: new Date('2024-01-10'), end: new Date('2024-01-20') },
			status: ListingStatusDTO.Blocked,
			pendingRequestsCount: 0
		},
		{
			id: '10',
			title: 'BBQ Grill',
			image: 'https://images.unsplash.com/photo-1544966503-7cc0d1d8ff15?w=400',
			publishedAt: new Date('2024-01-06'),
			reservationPeriod: { start: new Date('2024-03-15'), end: new Date('2024-04-15') },
			status: ListingStatusDTO.Active,
			pendingRequestsCount: 0
		},
		{
			id: '11',
			title: 'Projector',
			image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
			publishedAt: new Date('2024-01-04'),
			reservationPeriod: { start: new Date('2024-02-05'), end: new Date('2024-02-12') },
			status: ListingStatusDTO.Paused,
			pendingRequestsCount: 0
		},
		{
			id: '12',
			title: 'Stand Mixer',
			image: 'https://images.unsplash.com/photo-1571197019453-0dbb9958b928?w=400',
			publishedAt: new Date('2024-01-02'),
			reservationPeriod: { start: new Date('2024-02-08'), end: new Date('2024-02-22') },
			status: ListingStatusDTO.Active,
			pendingRequestsCount: 1
		}
	];

	private readonly mockRequests: ListingRequestDTO[] = [
		{
			id: '1',
			title: 'Professional Camera Kit',
			image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
			requestedBy: 'john_doe',
			requestedOn: new Date('2024-01-20'),
			reservationPeriod: { start: new Date('2024-02-01'), end: new Date('2024-02-07') },
			status: RequestStatusDTO.Pending
		},
		{
			id: '2',
			title: 'Professional Camera Kit',
			image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
			requestedBy: 'jane_smith',
			requestedOn: new Date('2024-01-18'),
			reservationPeriod: { start: new Date('2024-02-10'), end: new Date('2024-02-17') },
			status: RequestStatusDTO.Pending
		},
		{
			id: '3',
			title: 'Professional Camera Kit',
			image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
			requestedBy: 'mike_wilson',
			requestedOn: new Date('2024-01-16'),
			reservationPeriod: { start: new Date('2024-02-20'), end: new Date('2024-02-25') },
			status: RequestStatusDTO.Accepted
		},
		{
			id: '4',
			title: 'Power Drill Set',
			image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400',
			requestedBy: 'sarah_jones',
			requestedOn: new Date('2024-01-19'),
			reservationPeriod: { start: new Date('2024-02-15'), end: new Date('2024-02-22') },
			status: RequestStatusDTO.Pending
		},
		{
			id: '5',
			title: 'Party Speakers',
			image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
			requestedBy: 'alex_brown',
			requestedOn: new Date('2024-01-17'),
			reservationPeriod: { start: new Date('2024-02-20'), end: new Date('2024-02-27') },
			status: RequestStatusDTO.Pending
		},
		{
			id: '6',
			title: 'Party Speakers',
			image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
			requestedBy: 'chris_davis',
			requestedOn: new Date('2024-01-15'),
			reservationPeriod: { start: new Date('2024-03-01'), end: new Date('2024-03-03') },
			status: RequestStatusDTO.Rejected
		},
		{
			id: '7',
			title: 'Kayak',
			image: 'https://images.unsplash.com/photo-1544966503-7cc0d1d8ff15?w=400',
			requestedBy: 'emily_taylor',
			requestedOn: new Date('2024-01-14'),
			reservationPeriod: { start: new Date('2024-04-05'), end: new Date('2024-04-12') },
			status: RequestStatusDTO.Pending
		},
		{
			id: '8',
			title: 'Stand Mixer',
			image: 'https://images.unsplash.com/photo-1571197019453-0dbb9958b928?w=400',
			requestedBy: 'david_miller',
			requestedOn: new Date('2024-01-13'),
			reservationPeriod: { start: new Date('2024-02-08'), end: new Date('2024-02-15') },
			status: RequestStatusDTO.Pending
		}
	];

	async getMyListingsAll(_userId: string, pagination: PaginationParams): Promise<ListingAllPage> {
		// Simulate async operation
		await new Promise(resolve => setTimeout(resolve, 10));

		const { page, pageSize } = pagination;
		const startIndex = (page - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		
		const paginatedItems = this.mockListings.slice(startIndex, endIndex);

		return {
			items: paginatedItems,
			total: this.mockListings.length,
			page,
			pageSize
		};
	}

	async getMyListingRequests(_userId: string, pagination: PaginationParams): Promise<ListingRequestPage> {
		// Simulate async operation
		await new Promise(resolve => setTimeout(resolve, 10));

		const { page, pageSize } = pagination;
		const startIndex = (page - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		
		const paginatedItems = this.mockRequests.slice(startIndex, endIndex);

		return {
			items: paginatedItems,
			total: this.mockRequests.length,
			page,
			pageSize
		};
	}
}