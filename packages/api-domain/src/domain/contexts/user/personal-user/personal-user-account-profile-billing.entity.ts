import type { DomainSeedwork } from '@cellix/domain-seedwork';

export interface PersonalUserAccountProfileBillingProps
	extends DomainSeedwork.ValueObjectProps {
	subscriptionId?: string | undefined;
	cybersourceCustomerId?: string | undefined;
}

export interface PersonalUserAccountProfileBillingEntityReference
	extends Readonly<PersonalUserAccountProfileBillingProps> {}
