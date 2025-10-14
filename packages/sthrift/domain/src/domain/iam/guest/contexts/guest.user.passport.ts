import type { PersonalUserEntityReference } from '../../../contexts/user/personal-user/index.js';
import type { UserPassport } from '../../../contexts/user/user.passport.js';
import type { UserVisa } from '../../../contexts/user/user.visa.js';
import { GuestPassportBase } from '../guest.passport-base.js';

export class GuestUserPassport
	extends GuestPassportBase
	implements UserPassport
{
	forPersonalUser(_root: PersonalUserEntityReference): UserVisa {
		return { determineIf: () => false };
	}
}
