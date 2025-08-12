import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type {
	ItemListing,
	ItemListingEntityReference,
	ItemListingProps,
} from './item-listing.aggregate.ts';

export interface ItemListingRepository<props extends ItemListingProps>
	extends DomainSeedwork.Repository<ItemListing<props>> {
	/**
	 * Get a specific listing by ID
	 */
	get(id: string): Promise<ItemListing<props>>;
	
	/**
	 * Save a listing (create or update)
	 */
	save(listing: ItemListing<props>): Promise<ItemListing<props>>;
	
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
	 * Get listings by sharer ID
	 */
	getBySharerID(sharerId: string): Promise<ItemListing<props>[]>;
	
	/**
	 * Save and get entity reference for the listing
	 */
	saveAndGetReference(
		listing: ItemListing<props>,
	): Promise<ItemListingEntityReference>;
}