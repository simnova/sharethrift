import type { ItemListingEntityReference } from '../../../contexts/listing/item/item-listing.ts';
import type { ListingPassport } from '../../../contexts/listing/listing.passport.ts';
import { SystemPassportBase } from '../system.passport-base.ts';
import type { ListingVisa } from '../../../contexts/listing/listing.visa.ts';
import type { ListingDomainPermissions } from '../../../contexts/listing/listing.domain-permissions.ts';

export class SystemListingPassport
	extends SystemPassportBase
	implements ListingPassport
{
	forItemListing(_root: ItemListingEntityReference): ListingVisa {
		const permissions = this.permissions as ListingDomainPermissions;
		return { determineIf: (func) => func(permissions) };
	}
}
