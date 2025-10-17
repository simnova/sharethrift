import { AdminUserPassportBase } from './admin-user.passport-base.ts';
import type { UserPassport } from '../../contexts/user/user.passport.ts';
import type { AdminUserEntityReference } from '../../contexts/user/admin-user/admin-user.entity.ts';
import { AdminUserUserVisa } from './admin-user.user.visa.ts';

export class AdminUserUserPassport
	extends AdminUserPassportBase
	implements UserPassport
{
	forPersonalUser(): never {
		throw new Error('Method not implemented.');
	}

	forAdminUser(user: AdminUserEntityReference) {
		return new AdminUserUserVisa(user, this._user);
	}
}
