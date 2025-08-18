import type { ItemListingVisa } from './item.visa.ts';
import type { ItemListingEntityReference } from './item.aggregate.ts';

export interface ItemListingPassport {
	forItemListing(root: ItemListingEntityReference): ItemListingVisa;
}