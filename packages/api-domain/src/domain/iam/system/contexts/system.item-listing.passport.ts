import type { ItemListingEntityReference } from '../../../contexts/listing/item/item-listing.ts';
import type { ItemListingPassport } from '../../../contexts/listing/item/item-listing.passport.ts';
import { SystemPassportBase } from '../system.passport-base.ts';
import type { ItemListingVisa } from '../../../contexts/listing/item/item-listing.visa.ts';
export class SystemListingPassport
	extends SystemPassportBase
	implements ItemListingPassport
{
	forItemListing(_root: ItemListingEntityReference): ItemListingVisa {
		return { determineIf: () => true };
	}
}
