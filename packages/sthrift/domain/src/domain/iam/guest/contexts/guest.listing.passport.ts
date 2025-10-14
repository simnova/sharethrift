import type { ItemListingEntityReference } from '../../../contexts/listing/item/index.js';
import type { ListingPassport } from './../../../contexts/listing/listing.passport.js';
import type { ListingVisa } from '../../../contexts/listing/listing.visa.js';
import { GuestPassportBase } from '../guest.passport-base.js';

export class GuestListingPassport
	extends GuestPassportBase
	implements ListingPassport
{
	forItemListing(_root: ItemListingEntityReference): ListingVisa {
		return { determineIf: () => false };
	}
}
