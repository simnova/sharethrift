import type { AccountPlanEntityReference } from './account-plan/account-plan.entity.ts';
import type { AccountPlanVisa } from './account-plan.visa.ts';

export interface AccountPlanPassport {
	forAccountPlan(root: AccountPlanEntityReference): AccountPlanVisa;
}
