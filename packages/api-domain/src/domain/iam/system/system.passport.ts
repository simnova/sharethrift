import type { Passport } from '../../contexts/passport.ts';
import type { UserPassport } from '../../contexts/user/user.passport.ts';
import { SystemUserPassport } from './contexts/system.user.passport.ts';
import { SystemPassportBase } from './system.passport-base.ts';

export class SystemPassport extends SystemPassportBase implements Passport {
	private _userPassport: UserPassport | undefined;

	public get user(): UserPassport {
		if (!this._userPassport) {
			this._userPassport = new SystemUserPassport();
		}
		return this._userPassport;
	}
}
