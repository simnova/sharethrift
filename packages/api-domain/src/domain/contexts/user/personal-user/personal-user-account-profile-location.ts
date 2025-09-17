import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserVisa } from '../user.visa.ts';
import type { PersonalUserAggregateRoot } from './personal-user.ts';
import type {
	PersonalUserAccountProfileLocationEntityReference,
	PersonalUserAccountProfileLocationProps,
} from './personal-user-account-profile-location.entity.ts';

export class PersonalUserAccountProfileLocation
	extends DomainSeedwork.ValueObject<PersonalUserAccountProfileLocationProps>
	implements PersonalUserAccountProfileLocationEntityReference
{
	private readonly visa: UserVisa;
	private readonly root: PersonalUserAggregateRoot;
	constructor(
		props: PersonalUserAccountProfileLocationProps,
		visa: UserVisa,
		root: PersonalUserAggregateRoot,
	) {
		super(props);
		this.visa = visa;
		this.root = root;
	}
	// Primitive Field Getters
	get address1() {
		return this.props.address1;
	}
	get address2(): string | null {
		return this.props.address2;
	}
	get city() {
		return this.props.city;
	}
	get state() {
		return this.props.state;
	}
	get country() {
		return this.props.country;
	}
	get zipCode() {
		return this.props.zipCode;
	}

	// NestedPath Field Getters

	// PopulateDoc Field Getters

	// DocumentArray Field Getters

	private validateVisa(): void {
		if (
			!this.root.isNew &&
			!this.visa.determineIf((permissions) => permissions.canEditBillingInfo)
		) {
			throw new DomainSeedwork.PermissionError('Cannot set identity details');
		}
	}

	// Primitive Field Setters
	set address1(value: string) {
		this.validateVisa();
		this.props.address1 = value;
	}
	set address2(value: string) {
		this.validateVisa();
		this.props.address2 = value;
	}
	set city(value: string) {
		this.validateVisa();
		this.props.city = value;
	}
	set state(value: string) {
		this.validateVisa();
		this.props.state = value;
	}
	set country(value: string) {
		this.validateVisa();
		this.props.country = value;
	}
	set zipCode(value: string) {
		this.validateVisa();
		this.props.zipCode = value;
	}
}
