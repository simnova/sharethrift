import type { ItemListingEntityReference } from '../../listing/item/item-listing.entity.ts';
import type { BaseAppealRequestProps } from '../base-appeal-request.entity.ts';

export interface ListingAppealRequestProps extends BaseAppealRequestProps {
	listing: Readonly<ItemListingEntityReference>;
	loadListing: () => Promise<Readonly<ItemListingEntityReference>>;
}

export interface ListingAppealRequestEntityReference
	extends Readonly<ListingAppealRequestProps> {}
