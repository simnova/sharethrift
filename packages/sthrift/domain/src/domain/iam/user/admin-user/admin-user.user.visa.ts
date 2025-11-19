import type { UserVisa } from '../../../contexts/user/user.visa.ts';
import type { UserDomainPermissions } from '../../../contexts/user/user.domain-permissions.ts';
import type { AdminUserEntityReference } from '../../../contexts/user/admin-user/admin-user.entity.ts';

export class AdminUserUserVisa implements UserVisa {
	private readonly root: AdminUserEntityReference;
	private readonly admin: AdminUserEntityReference;

	constructor(
		user: AdminUserEntityReference,
		executingUser: AdminUserEntityReference,
	) {
		this.root = user;
		this.admin = executingUser;
	}

	determineIf(
		func: (permissions: Readonly<UserDomainPermissions>) => boolean,
	): boolean {
		const permissions = this.getPermissions();
		return func(permissions);
	}

	private getPermissions(): UserDomainPermissions {
		const isSelf = this.root.id === this.admin.id;
		const rolePermissions = this.admin.role?.permissions;

		return {
			canBlockUsers: rolePermissions?.userPermissions?.canBlockUsers ?? false,
			canBlockListings:
				rolePermissions?.listingPermissions?.canModerateListings ?? false,
			canUnblockUsers: rolePermissions?.userPermissions?.canBlockUsers ?? false,
			canUnblockListings:
				rolePermissions?.listingPermissions?.canModerateListings ?? false,
			canRemoveListings:
				rolePermissions?.userPermissions?.canDeleteContent ?? false,
			canViewListingReports:
				rolePermissions?.userPermissions?.canViewReports ?? false,
			canViewUserReports:
				rolePermissions?.userPermissions?.canViewAllUsers ?? false,
			canManageUserRoles:
				rolePermissions?.userPermissions?.canManageUserRoles ?? false,
			isEditingOwnAccount: isSelf,
		};
	}
}
