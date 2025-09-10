import { DomainSeedwork } from '@cellix/domain-seedwork';
import { VOString } from '@lucaspaganini/value-objects';
import type { UserVisa } from '../user.visa.ts';
import type { PersonalUserAggregateRoot } from './personal-user.ts';

/**
 * Payment status enumeration
 */
export const PaymentStateEnum = {
    Pending: 'PENDING',
    Succeeded: 'SUCCEEDED',
    Failed: 'FAILED',
    Refunded: 'REFUNDED'
} as const;

export class PaymentState extends VOString({
    trim: true,
    minLength: 6,
    maxLength: 9,
}) {
    static Pending = new PaymentState(PaymentStateEnum.Pending);
    static Succeeded = new PaymentState(PaymentStateEnum.Succeeded);
    static Failed = new PaymentState(PaymentStateEnum.Failed);
    static Refunded = new PaymentState(PaymentStateEnum.Refunded);
}

export interface PersonalUserAccountProfileBillingProps
	extends DomainSeedwork.ValueObjectProps {
	subscriptionId?: string | undefined;
	cybersourceCustomerId?: string | undefined;
	lastTransactionId?: string | undefined;
	paymentState?: string | undefined;
	lastPaymentAmount?: number | undefined;
}

export interface PersonalUserAccountProfileBillingEntityReference
	extends Readonly<PersonalUserAccountProfileBillingProps> {}

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
	get subscriptionId(): string | undefined {
		return this.props.subscriptionId;
	}
	get cybersourceCustomerId(): string | undefined {
		return this.props.cybersourceCustomerId;
	}
	get lastTransactionId(): string | undefined {
		return this.props.lastTransactionId;
	}
	get paymentState(): string | undefined {
		return this.props.paymentState;
	}
	get lastPaymentAmount(): number | undefined {
		return this.props.lastPaymentAmount;
	}

	private validateVisa(): void {
		if (
			!this.root.isNew &&
			!this.visa.determineIf((permissions) => permissions.canEditUserProfile)
		) {
			throw new DomainSeedwork.PermissionError('Cannot set email');
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
	set lastTransactionId(value: string) {
		this.validateVisa();
		this.props.lastTransactionId = value;
	}
	set paymentState(value: string) {
		this.validateVisa();
		this.props.paymentState = value;
	}
	set lastPaymentAmount(value: number) {
		this.validateVisa();
		this.props.lastPaymentAmount = value;
	}
}
