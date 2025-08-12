import type { ItemListingRepository } from './item-listing.repository.ts';
import type { ItemListingProps } from './item-listing.aggregate.ts';

/**
 * Represents the Unit of Work interface for the ItemListing domain.
 * Provides simple interface without extending DomainSeedwork.UnitOfWork for now.
 */
export interface ItemListingUnitOfWork<props extends ItemListingProps> {
	/**
	 * Get the repository for ItemListing operations
	 */
	itemListingRepository: ItemListingRepository<props>;
	
	/**
	 * Execute operations within a transaction
	 */
	withTransaction<T>(
		func: (uow: ItemListingUnitOfWork<props>) => Promise<T>,
	): Promise<T>;
}
