import type { ItemListingEntityReference } from '../../../../contexts/listing/item/item-listing.entity.ts';
import type { ListingDomainPermissions } from '../../../../contexts/listing/listing.domain-permissions.ts';
import type { ListingVisa } from '../../../../contexts/listing/listing.visa.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';
export class PersonalUserListingItemListingVisa<
	root extends ItemListingEntityReference,
> implements ListingVisa
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
		const updatedPermissions: ListingDomainPermissions = {
			canCreateItemListing: this.user.isBlocked === false,
			canUpdateItemListing: this.user.id === this.root.sharer.id,
			canDeleteItemListing: this.user.id === this.root.sharer.id,
			canViewItemListing: true,
			canViewBlockedItemListing: true,
			canPublishItemListing: this.user.id === this.root.sharer.id,
			canUnpublishItemListing: this.user.id === this.root.sharer.id,
		};

		return func(updatedPermissions);
	}
}
