import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { ItemListing } from './item-listing.ts';
import type { ItemListingProps } from './item-listing.entity.ts';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.entity.ts';

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

	/**
	 * Hard delete a listing by ID, bypassing domain aggregate loading.
	 */
	hardDeleteById(id: string): Promise<boolean>;
}
