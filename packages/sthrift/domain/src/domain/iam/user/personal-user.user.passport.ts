import { PersonalUserUserVisa } from './personal-user.user.visa.js';
import { PersonalUserPassportBase } from './personal-user.passport-base.js';
import type { UserPassport } from '../../contexts/user/user.passport.js';
import type { PersonalUserEntityReference } from '../../contexts/user/personal-user/personal-user.entity.js';
import type { UserVisa } from '../../contexts/user/user.visa.js';

export class PersonalUserUserPassport
	extends PersonalUserPassportBase
	implements UserPassport
{
	forPersonalUser(root: PersonalUserEntityReference): UserVisa {
		return new PersonalUserUserVisa(root, this._user);
	}
}
