import { AdminUserPassportBase } from './admin-user.passport-base.ts';
import type { Passport } from '../../../contexts/passport.ts';
import type { UserPassport } from '../../../contexts/user/user.passport.ts';
import { AdminUserUserPassport } from './admin-user.user.passport.ts';
export class AdminUserPassport
	extends AdminUserPassportBase
	implements Passport
{
	private _userPassport: UserPassport | undefined;
	get user(): UserPassport {
		this._userPassport ??= new AdminUserUserPassport(this._user);
		return this._userPassport;
	}
	// Implement other properties as needed
	get listing(): never {
		throw new Error('Method not implemented.');
	}
	get conversation(): never {
		throw new Error('Method not implemented.');
	}
	get reservationRequest(): never {
		throw new Error('Method not implemented.');
	}
}
