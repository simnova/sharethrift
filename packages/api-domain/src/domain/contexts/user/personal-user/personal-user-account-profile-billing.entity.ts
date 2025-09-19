import type { DomainSeedwork } from '@cellix/domain-seedwork';

export interface PersonalUserAccountProfileBillingProps
	extends DomainSeedwork.ValueObjectProps {
	subscriptionId: string | null;
	cybersourceCustomerId: string | null;
	paymentState: string | undefined;
	lastTransactionId: string | undefined;
	lastPaymentAmount: number | undefined;
}

export interface PersonalUserAccountProfileBillingEntityReference
	extends Readonly<PersonalUserAccountProfileBillingProps> {}
