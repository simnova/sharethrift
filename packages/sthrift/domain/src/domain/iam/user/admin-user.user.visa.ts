import type { UserVisa } from '../../contexts/user/user.visa.ts';
import type { UserDomainPermissions } from '../../contexts/user/user.domain-permissions.ts';
import type { AdminUserEntityReference } from '../../contexts/user/admin-user/admin-user.entity.ts';

export class AdminUserUserVisa implements UserVisa {
	private readonly _user: AdminUserEntityReference;
	private readonly _executingUser: AdminUserEntityReference;

	constructor(
		user: AdminUserEntityReference,
		executingUser: AdminUserEntityReference,
	) {
		this._user = user;
		this._executingUser = executingUser;
	}

	determineIf(
		func: (permissions: Readonly<UserDomainPermissions>) => boolean,
	): boolean {
		const permissions = this.getPermissions();
		return func(permissions);
	}

	private getPermissions(): UserDomainPermissions {
		const isSelf = this._user.id === this._executingUser.id;
		const rolePermissions = this._executingUser.role?.permissions;

		return {
			canCreateUser: rolePermissions?.userPermissions?.canEditUsers ?? false,
			canBlockUsers: rolePermissions?.userPermissions?.canBlockUsers ?? false,
			canBlockListings: rolePermissions?.contentPermissions?.canModerateListings ?? false,
			canUnblockUsers: rolePermissions?.userPermissions?.canBlockUsers ?? false,
			canUnblockListings: rolePermissions?.contentPermissions?.canModerateListings ?? false,
			canRemoveListings: rolePermissions?.contentPermissions?.canDeleteContent ?? false,
			canViewListingReports: rolePermissions?.contentPermissions?.canViewReports ?? false,
			canViewUserReports: rolePermissions?.userPermissions?.canViewAllUsers ?? false,
			isEditingOwnAccount: isSelf,
			isSystemAccount: rolePermissions?.systemPermissions?.canManageRoles ?? false,
		};
	}
}
