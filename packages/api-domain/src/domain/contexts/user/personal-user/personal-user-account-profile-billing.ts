import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserVisa } from '../user.visa.ts';
import type { PersonalUserAggregateRoot } from './personal-user.ts';

export interface PersonalUserAccountProfileBillingProps
	extends DomainSeedwork.ValueObjectProps {
	subscriptionId: string | undefined;
	cybersourceCustomerId: string | undefined;
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
}
