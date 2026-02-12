import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserVisa } from '../user.visa.ts';
import type { PersonalUserAggregateRoot } from './personal-user.aggregate.ts';
import type {
	PersonalUserAccountProfileBillingTransactionsEntityReference,
	PersonalUserAccountProfileBillingTransactionsProps,
} from './personal-user-account-profile-billing-transactions.entity.ts';

export class PersonalUserAccountProfileBillingTransactions
	extends DomainSeedwork.DomainEntity<PersonalUserAccountProfileBillingTransactionsProps>
	implements PersonalUserAccountProfileBillingTransactionsEntityReference
{
	private readonly visa: UserVisa;
	private readonly root: PersonalUserAggregateRoot;

	public constructor(
		props: PersonalUserAccountProfileBillingTransactionsProps,
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
				'Unauthorized to set transaction info',
			);
		}
	}

	get transactionId(): string {
		return this.props.transactionId;
	}
	get amount(): number {
		return this.props.amount;
	}
	get referenceId(): string {
		return this.props.referenceId;
	}
	get status(): string {
		return this.props.status;
	}
	get completedAt(): Date {
		return this.props.completedAt;
	}
	get errorMessage(): string | null {
		return this.props.errorMessage;
	}

	set transactionId(value: string) {
		this.validateVisa();
		this.props.transactionId = value;
	}
	set amount(value: number) {
		this.validateVisa();
		this.props.amount = value;
	}
	set referenceId(value: string) {
		this.validateVisa();
		this.props.referenceId = value;
	}
	set status(value: string) {
		this.validateVisa();
		this.props.status = value;
	}
	set completedAt(value: Date) {
		this.validateVisa();
		this.props.completedAt = value;
	}
	set errorMessage(value: string | null) {
		this.validateVisa();
		this.props.errorMessage = value;
	}
}
