import type { DomainSeedwork } from '@cellix/domain-seedwork';
export interface PersonalUserAccountProfileBillingProps
	extends DomainSeedwork.ValueObjectProps {
	subscriptionId: string | null;
	cybersourceCustomerId: string | null;
	paymentState: string;
	lastTransactionId: string | null;
	lastPaymentAmount: number | null;
}

export interface PersonalUserAccountProfileBillingEntityReference
	extends Readonly<PersonalUserAccountProfileBillingProps> {}
