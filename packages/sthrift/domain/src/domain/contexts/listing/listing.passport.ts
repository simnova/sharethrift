import type { ListingVisa } from './listing.visa.ts';
import type { ItemListingEntityReference } from './item/item-listing.entity.ts';

export interface ListingPassport {
	forItemListing(root: ItemListingEntityReference): ListingVisa;
}
