import type { ItemListingVisa } from '../../../contexts/listing/item.visa.ts';
import type { ItemListingPassportBase, ItemListingDomainPermissions } from '../item.passport-base.ts';

export class ItemListingItemListingVisa implements ItemListingVisa {
	private readonly passport: ItemListingPassportBase;

	constructor(passport: ItemListingPassportBase) {
		this.passport = passport;
	}

	determineIf(predicate: (permissions: ItemListingDomainPermissions) => boolean): boolean {
		return this.passport.determineIf(predicate);
	}
}