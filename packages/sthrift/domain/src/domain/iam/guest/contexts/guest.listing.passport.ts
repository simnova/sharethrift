import type { ItemListingEntityReference } from '../../../contexts/listing/item/index.ts';
import type { ListingPassport } from './../../../contexts/listing/listing.passport.ts';
import type { ListingVisa } from '../../../contexts/listing/listing.visa.ts';
import { GuestPassportBase } from '../guest.passport-base.ts';

export class GuestListingPassport
	extends GuestPassportBase
	implements ListingPassport
{
	forItemListing(_root: ItemListingEntityReference): ListingVisa {
		return { determineIf: () => false };
	}
}
