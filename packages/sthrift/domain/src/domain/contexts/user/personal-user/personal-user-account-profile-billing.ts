import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserVisa } from '../user.visa.ts';
import type { PersonalUserAggregateRoot } from './personal-user.ts';
import type {
	PersonalUserAccountProfileBillingEntityReference,
	PersonalUserAccountProfileBillingProps,
} from './personal-user-account-profile-billing.entity.ts';

import { PersonalUserAccountProfileBillingSubscription } from './personal-user-account-profile-billing-subscription.ts';

import { PersonalUserAccountProfileBillingTransactions } from './personal-user-account-profile-billing-transactions.ts';
export class PersonalUserAccountProfileBilling
	extends DomainSeedwork.ValueObject<PersonalUserAccountProfileBillingProps>
	implements PersonalUserAccountProfileBillingEntityReference
{
	private readonly visa: UserVisa;
	private readonly root: PersonalUserAggregateRoot;
	public constructor(
		props: PersonalUserAccountProfileBillingProps,
		visa: UserVisa,
		root: PersonalUserAggregateRoot,
	) {
		super(props);
		this.visa = visa;
		this.root = root;
	}

	private validateVisa(): void {
		if (
			!this.root.isNew &&
			!this.visa.determineIf((permissions) => permissions.isEditingOwnAccount)
		) {
			throw new DomainSeedwork.PermissionError(
				'Unauthorized to set billing info',
			);
		}
	}

	get cybersourceCustomerId(): string | null {
		return this.props.cybersourceCustomerId;
	}
	get subscription() {
		return new PersonalUserAccountProfileBillingSubscription(
			this.props.subscription,
			this.visa,
			this.root,
		);
	}
	get transactions(): ReadonlyArray<PersonalUserAccountProfileBillingTransactions> {
		return this.props.transactions.items.map(
			(transaction) =>
				new PersonalUserAccountProfileBillingTransactions(
					transaction,
					this.visa,
					this.root,
				),
		);
	}

	set cybersourceCustomerId(value: string | null) {
		this.validateVisa();
		this.props.cybersourceCustomerId = value;
	}
}
