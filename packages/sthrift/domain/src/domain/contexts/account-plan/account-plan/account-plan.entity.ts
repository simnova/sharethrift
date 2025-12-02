import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type {
	AccountPlanFeatureProps,
	AccountPlanFeatureEntityReference,
} from './account-plan-feature.entity.ts';

export interface AccountPlanProps extends DomainSeedwork.DomainEntityProps {
	name: string;
	description: string;
	billingPeriodLength: number;
	billingPeriodUnit: string;
	billingCycles: number;
	billingAmount: number;
	currency: string;
	setupFee: number;
	status: string;
	cybersourcePlanId: string;

	readonly feature: AccountPlanFeatureProps;

	get createdAt(): Date;
	get updatedAt(): Date;
	get schemaVersion(): string;
}

export interface AccountPlanEntityReference
	extends Readonly<Omit<AccountPlanProps, 'feature'>> {
	readonly feature: AccountPlanFeatureEntityReference;
}
