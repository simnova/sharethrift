import { PersonalUserUserVisa } from './personal-user.user.visa.ts';
import { PersonalUserPassportBase } from './personal-user.passport-base.ts';
import type { UserPassport } from '../../../contexts/user/user.passport.ts';
import type { PersonalUserEntityReference } from '../../../contexts/user/personal-user/personal-user.entity.ts';
import type { UserVisa } from '../../../contexts/user/user.visa.ts';

export class PersonalUserUserPassport
	extends PersonalUserPassportBase
	implements UserPassport
{
	forPersonalUser(root: PersonalUserEntityReference): UserVisa {
		return new PersonalUserUserVisa(root, this._user);
	}
}
