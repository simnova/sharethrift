import { PersonalUserUserVisa } from './personal-user.user.visa.ts';
import { PersonalUserPassportBase } from '../personal-user.passport-base.ts';
import type { UserPassport } from '../../../../contexts/user/user.passport.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';
import type { AdminUserEntityReference } from '../../../../contexts/user/admin-user/admin-user.entity.ts';
import type { UserVisa } from '../../../../contexts/user/user.visa.ts';
import type { UserDomainPermissions } from '../../../../contexts/user/user.domain-permissions.ts';

// Restrictive visa for when PersonalUser tries to access AdminUser (should not have permissions)
class PersonalToAdminUserVisa implements UserVisa {
	determineIf(
		_func: (permissions: Readonly<UserDomainPermissions>) => boolean,
	): boolean {
		// PersonalUser has no permissions for admin operations
		return false;
	}
}

export class PersonalUserUserPassport
	extends PersonalUserPassportBase
	implements UserPassport
{
	forPersonalUser(root: PersonalUserEntityReference): UserVisa {
		return new PersonalUserUserVisa(root, this._user);
	}

	forAdminUser(_root: AdminUserEntityReference): UserVisa {
		return new PersonalToAdminUserVisa();
	}
}
