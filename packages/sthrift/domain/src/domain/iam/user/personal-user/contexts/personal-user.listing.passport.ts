import type { ItemListingEntityReference } from '../../../../contexts/listing/item/index.ts';
import type { ListingPassport } from '../../../../contexts/listing/listing.passport.ts';
import type { ListingVisa } from '../../../../contexts/listing/listing.visa.ts';
import { PersonalUserPassportBase } from '../personal-user.passport-base.ts';
import { PersonalUserListingVisa } from './personal-user.listing.visa.ts';

export class PersonalUserListingPassport
	extends PersonalUserPassportBase
	implements ListingPassport
{
	forItemListing(root: ItemListingEntityReference): ListingVisa {
		return new PersonalUserListingVisa(root, this._user);
	}
}