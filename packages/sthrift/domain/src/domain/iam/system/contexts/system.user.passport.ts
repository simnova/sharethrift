import type { AdminUserEntityReference } from '../../../contexts/user/admin-user/index.ts';
import type { PersonalUserEntityReference } from '../../../contexts/user/personal-user/index.ts';
import type { UserDomainPermissions } from '../../../contexts/user/user.domain-permissions.ts';
import type { UserPassport } from '../../../contexts/user/user.passport.ts';
import type { UserVisa } from '../../../contexts/user/user.visa.ts';
import { SystemPassportBase } from '../system.passport-base.ts';

export class SystemUserPassport
	extends SystemPassportBase
	implements UserPassport
{
	forPersonalUser(_root: PersonalUserEntityReference): UserVisa {
		const permissions = this.permissions as UserDomainPermissions;
		return { determineIf: (func) => func(permissions) };
	}

	forAdminUser(_root: AdminUserEntityReference): UserVisa {
		const permissions = this.permissions as UserDomainPermissions;
		return { determineIf: (func) => func(permissions) };
	}
}
