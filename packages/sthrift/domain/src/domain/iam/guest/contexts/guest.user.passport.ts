import type { PersonalUserEntityReference } from '../../../contexts/user/personal-user/index.ts';
import type { AdminUserEntityReference } from '../../../contexts/user/admin-user/index.ts';
import type { AdminRoleEntityReference } from '../../../contexts/user/role/admin-role/admin-role.entity.ts';
import type { UserPassport } from '../../../contexts/user/user.passport.ts';
import type { UserVisa } from '../../../contexts/user/user.visa.ts';
import { GuestPassportBase } from '../guest.passport-base.ts';

export class GuestUserPassport
	extends GuestPassportBase
	implements UserPassport
{
	forPersonalUser(_root: PersonalUserEntityReference): UserVisa {
		return { determineIf: () => false };
	}

	forAdminUser(_root: AdminUserEntityReference): UserVisa {
		return { determineIf: () => false };
	}

	forAdminRole(_root: AdminRoleEntityReference): UserVisa {
		return { determineIf: () => false };
	}
}
