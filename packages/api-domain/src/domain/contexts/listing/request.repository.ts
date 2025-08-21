import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type {
	ListingRequest,
	ListingRequestProps,
} from './request.aggregate.ts';

export interface ListingRequestRepository<props extends ListingRequestProps>
	extends DomainSeedwork.Repository<ListingRequest<props>> {
	/**
	 * Get a listing request by ID, returns undefined if not found
	 */
	getById(id: string): Promise<ListingRequest<props> | undefined>;
	
	/**
	 * Get all requests for listings owned by a specific user
	 */
	getByListingOwner(listingOwnerId: string, options?: {
		state?: string;
		first?: number;
		after?: string;
		sortBy?: 'createdAt' | 'updatedAt' | 'reservationPeriodStart';
		sortOrder?: 'asc' | 'desc';
	}): Promise<{
		edges: Array<{
			node: ListingRequest<props>;
			cursor: string;
		}>;
		pageInfo: {
			hasNextPage: boolean;
			hasPreviousPage: boolean;
			startCursor?: string;
			endCursor?: string;
		};
		totalCount: number;
	}>;
	
	/**
	 * Get all requests made by a specific user
	 */
	getByRequester(requesterId: string): Promise<ListingRequest<props>[]>;
	
	/**
	 * Get all requests for a specific listing
	 */
	getByListingId(listingId: string): Promise<ListingRequest<props>[]>;

	/**
	 * Count pending requests for a specific listing
	 */
	countPendingRequestsForListing(listingId: string): Promise<number>;

	/**
	 * Count pending requests for listings owned by a user
	 */
	countPendingRequestsForListingOwner(listingOwnerId: string): Promise<number>;
}