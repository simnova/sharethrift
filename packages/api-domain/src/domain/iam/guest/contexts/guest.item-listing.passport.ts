import type { ItemListingEntityReference } from '../../../contexts/listing/item/index.ts';
import type { ItemListingPassport } from './../../../contexts/listing/item/item-listing.passport.ts';
import type { ItemListingVisa } from '../../../contexts/listing/item/item-listing.visa.ts';
import { GuestPassportBase } from '../guest.passport-base.ts';

export class GuestItemListingPassport
	extends GuestPassportBase
	implements ItemListingPassport
{
	forItemListing(_root: ItemListingEntityReference): ItemListingVisa {
		return { determineIf: () => false };
	}
}
