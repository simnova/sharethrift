import type { ItemListingEntityReference } from '../../../../contexts/listing/item/index.ts';
import type { ListingVisa } from '../../../../contexts/listing/listing.visa.ts';
import type { ListingDomainPermissions } from '../../../../contexts/listing/listing.domain-permissions.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/index.ts';

export class PersonalUserListingVisa<root extends ItemListingEntityReference>
	implements ListingVisa
{
	private readonly root: root;
	private readonly user: PersonalUserEntityReference;

	constructor(root: root, user: PersonalUserEntityReference) {
		this.root = root;
		this.user = user;
	}

	determineIf(
		func: (permissions: Readonly<ListingDomainPermissions>) => boolean,
	): boolean {
		// Personal users can manage their own listings
		const isOwner = this.root.sharer.id === this.user.id;
		
		const permissions: ListingDomainPermissions = {
			canCreateItemListing: true, // All personal users can create listings
			canUpdateItemListing: isOwner,
			canDeleteItemListing: isOwner,
			canViewItemListing: true, // All users can view listings
			canPublishItemListing: isOwner,
			canUnpublishItemListing: isOwner,
            canViewBlockedItemListing: isOwner
		};

		return func(permissions);
	}
}