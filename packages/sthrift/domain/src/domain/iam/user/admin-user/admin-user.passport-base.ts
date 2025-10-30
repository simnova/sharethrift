import type { AdminUserEntityReference } from '../../../contexts/user/admin-user/admin-user.entity.ts';
export class AdminUserPassportBase {
	protected readonly _user: AdminUserEntityReference;
	constructor(user: AdminUserEntityReference) {
		this._user = user;
	}
}
