import { PersonalUserPassportBase } from './personal-user.passport-base.ts';
import type { Passport } from '../../../contexts/passport.ts';
import type { UserPassport } from '../../../contexts/user/user.passport.ts';
import type { AccountPlanPassport } from '../../../contexts/account-plan/account-plan.passport.ts';
import { PersonalUserUserPassport } from './contexts/personal-user.user.passport.ts';
import { PersonalUserAccountPlanPassport } from './contexts/personal-user.account-plan.passport.ts';
export class PersonalUserPassport
	extends PersonalUserPassportBase
	implements Passport
{
	private _userPassport: UserPassport | undefined;
	private _accountPlanPassport: AccountPlanPassport | undefined;
	get user(): UserPassport {
		this._userPassport ??= new PersonalUserUserPassport(this._user);
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
	get accountPlan(): AccountPlanPassport {
		this._accountPlanPassport ??= new PersonalUserAccountPlanPassport(
			this._user,
		);
		return this._accountPlanPassport;
	}
}
