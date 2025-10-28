import type { DomainSeedwork } from '@cellix/domain-seedwork';

export interface PersonalUserAccountProfileBillingTransactionsProps
	extends DomainSeedwork.DomainEntityProps {
	transactionId: string;
	amount: number;
	referenceId: string;
	status: string;
	completedAt: Date;
	errorMessage: string | null;
}

export interface PersonalUserAccountProfileBillingTransactionsEntityReference
	extends Readonly<PersonalUserAccountProfileBillingTransactionsProps> {}
