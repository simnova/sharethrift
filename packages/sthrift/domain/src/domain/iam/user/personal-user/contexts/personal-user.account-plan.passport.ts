import { PersonalUserAccountPlanVisa } from './personal-user.account-plan.visa.ts';
import { PersonalUserPassportBase } from '../personal-user.passport-base.ts';
import type { AccountPlanPassport } from '../../../../contexts/account-plan/account-plan.passport.ts';
import type { AccountPlanVisa } from '../../../../contexts/account-plan/account-plan.visa.ts';
import type { AccountPlanEntityReference } from '../../../../contexts/account-plan/account-plan/account-plan.entity.ts';

export class PersonalUserAccountPlanPassport
	extends PersonalUserPassportBase
	implements AccountPlanPassport
{
	forAccountPlan(root: AccountPlanEntityReference): AccountPlanVisa {
		return new PersonalUserAccountPlanVisa(root, this._user);
	}
}
