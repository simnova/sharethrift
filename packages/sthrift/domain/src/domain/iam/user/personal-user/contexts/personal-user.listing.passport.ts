import type { ItemListingEntityReference } from '../../../../contexts/listing/item/item-listing.entity.ts';
import type { ListingPassport } from '../../../../contexts/listing/listing.passport.ts';
import type { ListingVisa } from '../../../../contexts/listing/listing.visa.ts';
import { PersonalUserPassportBase } from '../personal-user.passport-base.ts';
import { PersonalUserListingItemListingVisa } from './personal-user.listing.item-listing.visa.ts';

export class PersonalUserListingPassport
	extends PersonalUserPassportBase
	implements ListingPassport
{
	forItemListing(root: ItemListingEntityReference): ListingVisa {
		return new PersonalUserListingItemListingVisa(root, this._user);
	}
}
