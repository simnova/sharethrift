import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserVisa } from '../user.visa.ts';
import type { PersonalUserAggregateRoot } from './personal-user.ts';
import type {
	PersonalUserAccountProfileBillingSubscriptionEntityReference,
	PersonalUserAccountProfileBillingSubscriptionProps,
} from './personal-user-account-profile-billing-subscription.entity.ts';

export class PersonalUserAccountProfileBillingSubscription
	extends DomainSeedwork.ValueObject<PersonalUserAccountProfileBillingSubscriptionProps>
	implements PersonalUserAccountProfileBillingSubscriptionEntityReference
{
	private readonly visa: UserVisa;
	private readonly root: PersonalUserAggregateRoot;

	public constructor(
		props: PersonalUserAccountProfileBillingSubscriptionProps,
		visa: UserVisa,
		root: PersonalUserAggregateRoot,
	) {
		super(props);
		this.visa = visa;
		this.root = root;
	}

	get subscriptionCode(): string {
		return this.props.subscriptionCode;
	}
	get planCode(): string {
		return this.props.planCode;
	}
	get status(): string {
		return this.props.status;
	}
	get startDate(): Date {
		return this.props.startDate;
	}

	private validateVisa(): void {
		if (
			!this.root.isNew &&
			!this.visa.determineIf((permissions) => permissions.isEditingOwnAccount)
		) {
			throw new DomainSeedwork.PermissionError(
				'Unauthorized to set subscription info',
			);
		}
	}

	set subscriptionCode(value: string) {
		this.validateVisa();
		this.props.subscriptionCode = value;
	}
	set planCode(value: string) {
		this.validateVisa();
		this.props.planCode = value;
	}
	set status(value: string) {
		this.validateVisa();
		this.props.status = value;
	}
	set startDate(value: Date) {
		this.validateVisa();
		this.props.startDate = value;
	}
}
