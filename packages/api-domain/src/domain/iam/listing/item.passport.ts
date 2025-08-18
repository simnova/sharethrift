import type { Passport } from '../../contexts/passport.ts';
import { ItemListingPassportBase, type AuthenticatedPrincipal, type ItemListingDomainPermissions } from './item.passport-base.ts';
import { ItemListingItemListingVisa } from './contexts/item.listing.visa.ts';
import type { ItemListingVisa } from '../../contexts/listing/item.visa.ts';
import type { ItemListingPassport as ItemListingPassportInterface } from '../../contexts/listing/item.passport.ts';

export class ItemListingPassport extends ItemListingPassportBase implements Passport {
	private readonly _itemListingVisa: ItemListingVisa;

	constructor(principal: AuthenticatedPrincipal, permissions: ItemListingDomainPermissions) {
		super(principal, permissions);
		this._itemListingVisa = new ItemListingItemListingVisa(this);
	}

	public get itemListing(): ItemListingPassportInterface {
		return {
			forItemListing: () => this._itemListingVisa
		};
	}

	// Required by Passport interface - will be expanded as other contexts are added
	[key: string]: unknown;
}