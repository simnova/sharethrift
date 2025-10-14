import type { PersonalUserEntityReference } from '../../contexts/user/personal-user/personal-user.entity.ts';
export class PersonalUserPassportBase {
	protected readonly _user: PersonalUserEntityReference;
	constructor(user: PersonalUserEntityReference) {
		this._user = user;
	}
}
