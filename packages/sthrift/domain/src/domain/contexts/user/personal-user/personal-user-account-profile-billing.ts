import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserVisa } from '../user.visa.ts';
import type { PersonalUserAggregateRoot } from './personal-user.ts';
import type {
	PersonalUserAccountProfileBillingEntityReference,
	PersonalUserAccountProfileBillingProps,
} from './personal-user-account-profile-billing.entity.ts';

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
	get subscriptionId(): string | null {
		return this.props.subscriptionId;
	}
	get cybersourceCustomerId(): string | null {
		return this.props.cybersourceCustomerId;
	}
	get lastTransactionId(): string | null {
		return this.props.lastTransactionId;
	}
	get paymentState(): string {
		return this.props.paymentState;
	}
	get lastPaymentAmount(): number | null {
		return this.props.lastPaymentAmount;
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

	set subscriptionId(value: string) {
		this.validateVisa();
		this.props.subscriptionId = value;
	}
	set cybersourceCustomerId(value: string) {
		this.validateVisa();
		this.props.cybersourceCustomerId = value;
	}
	set lastTransactionId(value: string | null) {
		this.validateVisa();
		this.props.lastTransactionId = value;
	}
	set paymentState(value: string) {
		this.validateVisa();
		this.props.paymentState = value;
	}
	set lastPaymentAmount(value: number | null) {
		this.validateVisa();
		this.props.lastPaymentAmount = value;
	}
}
