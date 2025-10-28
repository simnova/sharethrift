import type { PassportSeedwork } from '@cellix/domain-seedwork';
import type { AccountPlanDomainPermissions } from './account-plan.domain-permissions.ts';

export interface AccountPlanVisa
	extends PassportSeedwork.Visa<AccountPlanDomainPermissions> {
	determineIf(
		func: (permissions: Readonly<AccountPlanDomainPermissions>) => boolean,
	): boolean;
}
