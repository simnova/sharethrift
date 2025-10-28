import type { AccountPlanEntityReference } from '../../../contexts/account-plan/account-plan/account-plan.entity.ts';
import type { AccountPlanPassport } from '../../../contexts/account-plan/account-plan.passport.ts';
import { SystemPassportBase } from '../system.passport-base.ts';
import type { AccountPlanVisa } from '../../../contexts/account-plan/account-plan.visa.ts';
import type { AccountPlanDomainPermissions } from '../../../contexts/account-plan/account-plan.domain-permissions.ts';
export class SystemAccountPlanPassport
	extends SystemPassportBase
	implements AccountPlanPassport
{
	forAccountPlan(_root: AccountPlanEntityReference): AccountPlanVisa {
		const permissions = this.permissions as AccountPlanDomainPermissions;
		return { determineIf: (func) => func(permissions) };
	}
}
