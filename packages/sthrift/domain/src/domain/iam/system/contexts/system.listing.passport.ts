import type { ItemListingEntityReference } from '../../../contexts/listing/item/item-listing.entity.ts';
import type { ListingDomainPermissions } from '../../../contexts/listing/listing.domain-permissions.ts';
import type { ListingPassport } from '../../../contexts/listing/listing.passport.ts';
import type { ListingVisa } from '../../../contexts/listing/listing.visa.ts';
import { SystemPassportBase } from '../system.passport-base.ts';

export class SystemListingPassport
	extends SystemPassportBase
	implements ListingPassport
{
	forItemListing(_root: ItemListingEntityReference): ListingVisa {
		const permissions = this.permissions as ListingDomainPermissions;
		return { determineIf: (func) => func(permissions) };
	}
}
