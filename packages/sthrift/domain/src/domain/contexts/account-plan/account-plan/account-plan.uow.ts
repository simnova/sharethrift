import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { AccountPlan } from './account-plan.ts';
import type { AccountPlanRepository } from './account-plan.repository.ts';
import type { AccountPlanProps } from './account-plan.entity.ts';

export interface AccountPlanUnitOfWork
	extends DomainSeedwork.UnitOfWork<
			Passport,
			AccountPlanProps,
			AccountPlan<AccountPlanProps>,
			AccountPlanRepository<AccountPlanProps>
		>,
		DomainSeedwork.InitializedUnitOfWork<
			Passport,
			AccountPlanProps,
			AccountPlan<AccountPlanProps>,
			AccountPlanRepository<AccountPlanProps>
		> {}
