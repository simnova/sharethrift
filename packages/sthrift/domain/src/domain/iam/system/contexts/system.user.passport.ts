import type { PersonalUserEntityReference } from '../../../contexts/user/personal-user/index.js';
import type { UserPassport } from '../../../contexts/user/user.passport.js';
import type { UserVisa } from '../../../contexts/user/user.visa.js';
import { SystemPassportBase } from '../system.passport-base.js';
import type { UserDomainPermissions } from '../../../contexts/user/user.domain-permissions.js';

export class SystemUserPassport
	extends SystemPassportBase
	implements UserPassport
{
	forPersonalUser(_root: PersonalUserEntityReference): UserVisa {
		const permissions = this.permissions as UserDomainPermissions;
		return { determineIf: (func) => func(permissions) };
	}
}
