import type { ItemListingVisa } from '../../../contexts/item-listing/item-listing.visa.ts';
import type { ItemListingPassportBase, ItemListingDomainPermissions } from '../item-listing.passport-base.ts';

export class ItemListingItemListingVisa implements ItemListingVisa {
	private readonly passport: ItemListingPassportBase;

	constructor(passport: ItemListingPassportBase) {
		this.passport = passport;
	}

	determineIf(predicate: (permissions: ItemListingDomainPermissions) => boolean): boolean {
		return this.passport.determineIf(predicate);
	}
}