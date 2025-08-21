import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type {
	ItemListing,
	ItemListingProps,
} from './item.aggregate.ts';

export interface ItemListingRepository<props extends ItemListingProps>
	extends DomainSeedwork.Repository<ItemListing<props>> {
	/**
	 * Get a listing by ID, returns undefined if not found
	 */
	getById(id: string): Promise<ItemListing<props> | undefined>;
	
	/**
	 * Find active listings with optional filtering and pagination
	 */
	findActiveListings(options: {
		search?: string;
		category?: string;
		first?: number;
		after?: string;
	}): Promise<{
		edges: Array<{
			node: ItemListing<props>;
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
	 * Get listings by sharer ID with enhanced filtering and pagination
	 */
	getBySharerID(sharerId: string, options?: {
		search?: string;
		status?: string;
		first?: number;
		after?: string;
		sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'sharingPeriodStart';
		sortOrder?: 'asc' | 'desc';
	}): Promise<{
		edges: Array<{
			node: ItemListing<props>;
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
}