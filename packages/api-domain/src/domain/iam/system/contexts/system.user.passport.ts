import type { PersonalUserEntityReference } from '../../../contexts/user/personal-user/index.ts';
import type { UserPassport } from '../../../contexts/user/user.passport.ts';
import type { UserVisa } from '../../../contexts/user/user.visa.ts';
import { SystemPassportBase } from '../system.passport-base.ts';

export class SystemUserPassport
	extends SystemPassportBase
	implements UserPassport
{
	forPersonalUser(_root: PersonalUserEntityReference): UserVisa {
		return { determineIf: () => true };
	}
}
