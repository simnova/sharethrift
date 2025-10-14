import type { ItemListingEntityReference } from '../../../contexts/listing/item/item-listing.entity.js';
import type { ListingPassport } from '../../../contexts/listing/listing.passport.js';
import { SystemPassportBase } from '../system.passport-base.js';
import type { ListingVisa } from '../../../contexts/listing/listing.visa.js';
import type { ListingDomainPermissions } from '../../../contexts/listing/listing.domain-permissions.js';

export class SystemListingPassport
	extends SystemPassportBase
	implements ListingPassport
{
	forItemListing(_root: ItemListingEntityReference): ListingVisa {
		const permissions = this.permissions as ListingDomainPermissions;
		return { determineIf: (func) => func(permissions) };
	}
}
