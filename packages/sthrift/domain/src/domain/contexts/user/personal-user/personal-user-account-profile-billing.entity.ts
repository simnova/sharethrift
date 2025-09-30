import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type {
	PersonalUserAccountProfileBillingTransactionsEntityReference,
	PersonalUserAccountProfileBillingTransactionsProps,
} from './personal-user-account-profile-billing-transactions.entity.ts';
import type {
	PersonalUserAccountProfileBillingSubscriptionEntityReference,
	PersonalUserAccountProfileBillingSubscriptionProps,
} from './personal-user-account-profile-billing-subscription.entity.ts';

export interface PersonalUserAccountProfileBillingProps
	extends DomainSeedwork.ValueObjectProps {
	cybersourceCustomerId: string | null;
	subscription: PersonalUserAccountProfileBillingSubscriptionProps;
	transactions: DomainSeedwork.PropArray<PersonalUserAccountProfileBillingTransactionsProps>;
}

export interface PersonalUserAccountProfileBillingEntityReference
	extends Readonly<
		Omit<
			PersonalUserAccountProfileBillingProps,
			'subscription' | 'transactions'
		>
	> {
	readonly subscription: PersonalUserAccountProfileBillingSubscriptionEntityReference;
	readonly transactions: ReadonlyArray<PersonalUserAccountProfileBillingTransactionsEntityReference>;
}
