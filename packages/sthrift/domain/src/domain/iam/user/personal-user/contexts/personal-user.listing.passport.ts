import type { ItemListingEntityReference } from '../../../../contexts/listing/item/index.ts';
import type { ListingPassport } from '../../../../contexts/listing/listing.passport.ts';
import type { ListingVisa } from '../../../../contexts/listing/listing.visa.ts';
import type { ListingDomainPermissions } from '../../../../contexts/listing/listing.domain-permissions.ts';
import { PersonalUserPassportBase } from '../personal-user.passport-base.ts';

export class PersonalUserListingPassport
	extends PersonalUserPassportBase
	implements ListingPassport
{
	forItemListing(root: ItemListingEntityReference): ListingVisa {
		return {
			determineIf: (func: (permissions: Readonly<ListingDomainPermissions>) => boolean): boolean => {
				// Personal users can manage their own listings
				const isOwner = root.sharer.id === this._user.id;
				
				const permissions: ListingDomainPermissions = {
					canCreateItemListing: true, // All personal users can create listings
					canUpdateItemListing: isOwner,
					canDeleteItemListing: isOwner,
					canViewItemListing: true, // All users can view listings
					canPublishItemListing: isOwner,
					canUnpublishItemListing: isOwner,
				};

				return func(permissions);
			}
		};
	}
}