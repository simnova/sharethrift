import type { DomainSeedwork } from '@cellix/domain-seedwork';

export interface PersonalUserAccountProfileBillingProps
	extends DomainSeedwork.ValueObjectProps {
	subscriptionId: string | null;
	cybersourceCustomerId: string | null;
}

export interface PersonalUserAccountProfileBillingEntityReference
	extends Readonly<PersonalUserAccountProfileBillingProps> {}
