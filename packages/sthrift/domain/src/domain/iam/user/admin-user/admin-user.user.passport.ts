import { AdminUserPassportBase } from './admin-user.passport-base.ts';
import type { UserPassport } from '../../../contexts/user/user.passport.ts';
import type { AdminUserEntityReference } from '../../../contexts/user/admin-user/admin-user.entity.ts';
import type { PersonalUserEntityReference } from '../../../contexts/user/personal-user/personal-user.entity.ts';
import { AdminUserUserVisa } from './admin-user.user.visa.ts';
import type { UserVisa } from '../../../contexts/user/user.visa.ts';
import type { UserDomainPermissions } from '../../../contexts/user/user.domain-permissions.ts';

// Custom visa for admin operations on personal users
class AdminToPersonalUserVisa implements UserVisa {
	private readonly admin: AdminUserEntityReference;

	constructor(admin: AdminUserEntityReference, _root: PersonalUserEntityReference) {
		this.admin = admin;
	}

	determineIf(
		func: (permissions: Readonly<UserDomainPermissions>) => boolean,
	): boolean {
		const rolePermissions = this.admin.role?.permissions;
		const permissions: UserDomainPermissions = {
			canCreateUser: rolePermissions?.userPermissions?.canEditUsers ?? false,
			canBlockUsers: rolePermissions?.userPermissions?.canBlockUsers ?? false,
			canBlockListings: rolePermissions?.contentPermissions?.canModerateListings ?? false,
			canUnblockUsers: rolePermissions?.userPermissions?.canBlockUsers ?? false,
			canUnblockListings: rolePermissions?.contentPermissions?.canModerateListings ?? false,
			canRemoveListings: rolePermissions?.contentPermissions?.canDeleteContent ?? false,
			canViewListingReports: rolePermissions?.contentPermissions?.canViewReports ?? false,
			canViewUserReports: rolePermissions?.userPermissions?.canViewAllUsers ?? false,
			isEditingOwnAccount: false, // Admin is not editing their own personal account
			isSystemAccount: rolePermissions?.systemPermissions?.canManageRoles ?? false,
		};
		return func(permissions);
	}
}

export class AdminUserUserPassport
	extends AdminUserPassportBase
	implements UserPassport
{
	forPersonalUser(root: PersonalUserEntityReference): UserVisa {
		return new AdminToPersonalUserVisa(this._user, root);
	}

	forAdminUser(user: AdminUserEntityReference) {
		return new AdminUserUserVisa(user, this._user);
	}
}
