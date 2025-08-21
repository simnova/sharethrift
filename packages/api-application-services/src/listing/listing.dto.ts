/**
 * DTOs for My Listings Dashboard backend
 */

import type { ItemListing, ItemListingProps } from '@sthrift/api-domain';

/**
 * Status enum matching frontend requirements
 */
export const ListingStatusDTO = {
	Active: 'Active',
	Paused: 'Paused', 
	Reserved: 'Reserved',
	Expired: 'Expired',
	Draft: 'Draft',
	Blocked: 'Blocked'
} as const;

export type ListingStatusDTO = typeof ListingStatusDTO[keyof typeof ListingStatusDTO];

/**
 * Request status enum for incoming requests
 */
export const RequestStatusDTO = {
	Accepted: 'Accepted',
	Rejected: 'Rejected',
	Closed: 'Closed',
	Pending: 'Pending',
	Closing: 'Closing'
} as const;

export type RequestStatusDTO = typeof RequestStatusDTO[keyof typeof RequestStatusDTO];

/**
 * Date range for reservation periods
 */
export interface DateRangeDTO {
	start: Date;
	end: Date;
}

/**
 * DTO for All Listings tab
 */
export interface ListingAllDTO {
	id: string;
	title: string;
	image?: string;
	publishedAt: Date;
	reservationPeriod: DateRangeDTO;
	status: ListingStatusDTO;
	pendingRequestsCount: number;
}

/**
 * DTO for Requests tab
 */
export interface ListingRequestDTO {
	id: string;
	title: string;
	image?: string;
	requestedBy: string; // username
	requestedOn: Date;
	reservationPeriod: DateRangeDTO;
	status: RequestStatusDTO;
}

/**
 * Paginated response for All Listings
 */
export interface ListingAllPage {
	items: ListingAllDTO[];
	total: number;
	page: number;
	pageSize: number;
}

/**
 * Paginated response for Requests  
 */
export interface ListingRequestPage {
	items: ListingRequestDTO[];
	total: number;
	page: number;
	pageSize: number;
}

/**
 * Maps domain listing status to DTO status
 */
export function mapListingStatus(domainStatus: string): ListingStatusDTO {
	switch (domainStatus) {
		case 'Published':
			return ListingStatusDTO.Active;
		case 'Paused':
			return ListingStatusDTO.Paused;
		case 'Cancelled':
		case 'Expired':
			return ListingStatusDTO.Expired;
		case 'Drafted':
			return ListingStatusDTO.Draft;
		case 'Blocked':
			return ListingStatusDTO.Blocked;
		default:
			return ListingStatusDTO.Draft;
	}
}

/**
 * Maps domain listing to ListingAllDTO
 */
export function mapToListingAllDTO<T extends ItemListingProps>(
	listing: ItemListing<T>,
	pendingRequestsCount: number = 0
): ListingAllDTO {
	return {
		id: listing.id,
		title: listing.title.valueOf(),
		...(listing.images?.[0] ? { image: listing.images[0] } : {}),
		publishedAt: listing.createdAt,
		reservationPeriod: {
			start: listing.sharingPeriodStart,
			end: listing.sharingPeriodEnd,
		},
		status: mapListingStatus(listing.state.valueOf()),
		pendingRequestsCount,
	};
}