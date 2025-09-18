import type { DomainSeedwork } from '@cellix/domain-seedwork';

export interface PersonalUserAccountProfileBillingProps
	extends DomainSeedwork.ValueObjectProps {
	subscriptionId: string | undefined;
	cybersourceCustomerId: string | undefined;
	paymentState: string | undefined;
	lastTransactionId: string | undefined;
	lastPaymentAmount: number | undefined;
}

export interface PersonalUserAccountProfileBillingEntityReference
	extends Readonly<PersonalUserAccountProfileBillingProps> {}
