import type { ItemListingEntityReference } from '../../../../contexts/listing/item/item-listing.entity.ts';
import type { ListingPassport } from '../../../../contexts/listing/listing.passport.ts';
import type { ListingVisa } from '../../../../contexts/listing/listing.visa.ts';
import { AdminUserPassportBase } from '../admin-user.passport-base.ts';
import { AdminUserListingItemListingVisa } from './admin-user.listing.item-listing.visa.ts';

export class AdminUserListingPassport
	extends AdminUserPassportBase
	implements ListingPassport
{
	forItemListing(root: ItemListingEntityReference): ListingVisa {
		return new AdminUserListingItemListingVisa(root, this._user);
	}
}
