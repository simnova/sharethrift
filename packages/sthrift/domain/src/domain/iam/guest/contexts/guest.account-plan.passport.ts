import type { AccountPlanEntityReference } from '../../../contexts/account-plan/account-plan/index.ts';
import type { AccountPlanPassport } from './../../../contexts/account-plan/account-plan.passport.ts';
import type { AccountPlanVisa } from '../../../contexts/account-plan/account-plan.visa.ts';
import { GuestPassportBase } from '../guest.passport-base.ts';

export class GuestAccountPlanPassport
	extends GuestPassportBase
	implements AccountPlanPassport
{
	forAccountPlan(_root: AccountPlanEntityReference): AccountPlanVisa {
		return { determineIf: () => false };
	}
}
