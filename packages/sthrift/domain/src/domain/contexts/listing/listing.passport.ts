import type { ListingVisa } from './listing.visa.js';
import type { ItemListingEntityReference } from './item/item-listing.entity.js';

export interface ListingPassport {
	forItemListing(root: ItemListingEntityReference): ListingVisa;
}
