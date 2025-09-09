import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { ItemListing, ItemListingProps } from './item-listing.ts';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.ts';

export interface ItemListingRepository<props extends ItemListingProps>
	extends DomainSeedwork.Repository<ItemListing<props>> {
	/**
	 * Get a listing by ID, returns undefined if not found
	 */
	getById(id: string): Promise<ItemListing<props> | undefined>;

	getActiveItemListings(): Promise<ItemListing<props>[]>;

	/**
	 * Get listings by sharer ID
	 */
	getBySharerID(sharerId: string): Promise<ItemListing<props>[]>;

	getNewInstance(
		sharer: PersonalUserEntityReference,
	): Promise<ItemListing<props>>;
}
