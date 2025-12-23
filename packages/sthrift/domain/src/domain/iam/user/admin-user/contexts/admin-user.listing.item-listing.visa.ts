import type { ItemListingEntityReference } from '../../../../contexts/listing/item/item-listing.entity.ts';
import type { ListingDomainPermissions } from '../../../../contexts/listing/listing.domain-permissions.ts';
import type { ListingVisa } from '../../../../contexts/listing/listing.visa.ts';
import type { AdminUserEntityReference } from '../../../../contexts/user/admin-user/admin-user.entity.ts';

export class AdminUserListingItemListingVisa<
	root extends ItemListingEntityReference,
> implements ListingVisa
{
	private readonly root: root;
	private readonly admin: AdminUserEntityReference;

	constructor(root: root, admin: AdminUserEntityReference) {
		this.root = root;
		this.admin = admin;
	}

	determineIf(
		func: (permissions: Readonly<ListingDomainPermissions>) => boolean,
	): boolean {
		// AdminUser permissions based on their role
		const rolePermissions = this.admin.role?.permissions;

		const updatedPermissions: ListingDomainPermissions = {
			// Admins can create listings if they have content creation permission
			canCreateItemListing:
				rolePermissions?.userPermissions?.canEditUsers ?? false,
			// Admins can update any listing if they have moderation permission
			canUpdateItemListing:
				rolePermissions?.listingPermissions?.canModerateListings ?? false,
			// Admins can delete listings if they have delete content permission
			canDeleteItemListing:
				rolePermissions?.userPermissions?.canDeleteContent ?? false,
			// Admins can view all listings
			canViewItemListing: true,
			// Admins can view blocked listings
			canViewBlockedItemListing: true,
			// Admins can publish listings if they have moderation permission
			canPublishItemListing:
				rolePermissions?.listingPermissions?.canModerateListings ?? false,
			// Admins can unpublish listings if they have moderation permission
			canUnpublishItemListing:
				rolePermissions?.listingPermissions?.canModerateListings ?? false,
		};

		return func(updatedPermissions);
	}
}
