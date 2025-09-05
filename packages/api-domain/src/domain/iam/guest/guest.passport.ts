import type { ItemListingPassport } from '../../contexts/listing/item/item-listing.passport.ts';
import type { Passport } from '../../contexts/passport.ts';
import type { UserPassport } from '../../contexts/user/user.passport.ts';
import { GuestUserPassport } from './contexts/guest.user.passport.ts';
import { GuestItemListingPassport } from './contexts/guest.item-listing.passport.ts';

import { GuestPassportBase } from './guest.passport-base.ts';

export class GuestPassport extends GuestPassportBase implements Passport {
	private _userPassport: UserPassport | undefined;
	private _itemListingPassport: ItemListingPassport | undefined;

	public get user(): UserPassport {
		if (!this._userPassport) {
			this._userPassport = new GuestUserPassport();
		}
		return this._userPassport;
	}

	public get itemListing(): ItemListingPassport {
		if (!this._itemListingPassport) {
			this._itemListingPassport = new GuestItemListingPassport();
		}
		return this._itemListingPassport;
	}
}
