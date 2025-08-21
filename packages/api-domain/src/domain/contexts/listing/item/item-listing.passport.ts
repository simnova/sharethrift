import type { ItemListingVisa } from './item-listing.visa.ts';
import type { ItemListingEntityReference } from './item-listing.ts';

export interface ItemListingPassport {
	forItemListing(root: ItemListingEntityReference): ItemListingVisa;
}