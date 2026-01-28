import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { AccountPlan } from './account-plan.aggregate.ts';
import type { AccountPlanProps } from './account-plan.entity.ts';

export interface AccountPlanRepository<props extends AccountPlanProps>
	extends DomainSeedwork.Repository<AccountPlan<props>> {
	getNewInstance(planInfo: {
		name: string;
		description: string;
		billingPeriodLength: number;
		billingPeriodUnit: string;
		billingCycles: number;
		billingAmount: number;
		currency: string;
		setupFee: number;
		feature: {
			activeReservations: number;
			bookmarks: number;
			itemsToShare: number;
			friends: number;
		};
	}): Promise<AccountPlan<props>>;
	getById(id: string): Promise<AccountPlan<props> | undefined>;
	getAll(): Promise<AccountPlan<props>[]>;
}
