import type { Passport } from '../../contexts/passport.ts';
import { ItemListingPassportBase, type AuthenticatedPrincipal, type ItemListingDomainPermissions } from './item-listing.passport-base.ts';
import { ItemListingItemListingVisa } from './contexts/item-listing.item-listing.visa.ts';
import type { ItemListingVisa } from '../../contexts/item-listing/item-listing.visa.ts';

export class ItemListingPassport extends ItemListingPassportBase implements Passport {
	private readonly _itemListingVisa: ItemListingVisa;

	constructor(principal: AuthenticatedPrincipal, permissions: ItemListingDomainPermissions) {
		super(principal, permissions);
		this._itemListingVisa = new ItemListingItemListingVisa();
	}

	public get itemListing(): ItemListingVisa {
		return this._itemListingVisa;
	}

	// Required by Passport interface - will be expanded as other contexts are added
	[key: string]: unknown;
}