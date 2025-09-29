import type { DomainSeedwork } from '@cellix/domain-seedwork';

export interface PersonalUserAccountProfileBillingSubscriptionProps
	extends DomainSeedwork.ValueObjectProps {
	subscriptionCode: string;
	planCode: string;
	status: string;
	startDate: Date;
}

export interface PersonalUserAccountProfileBillingSubscriptionEntityReference
	extends Readonly<PersonalUserAccountProfileBillingSubscriptionProps> {}
