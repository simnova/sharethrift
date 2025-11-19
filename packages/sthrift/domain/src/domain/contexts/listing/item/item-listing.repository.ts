import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { ItemListing } from './item-listing.ts';
import type { ItemListingProps } from './item-listing.entity.ts';
import type { UserEntityReference } from '../../user/index.ts';

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
		sharer: UserEntityReference,
		fields: {
			title: string;
			description: string;
			category: string;
			location: string;
			sharingPeriodStart: Date;
			sharingPeriodEnd: Date;
			images?: string[];
			isDraft?: boolean;
		},
	): Promise<ItemListing<props>>;
}
