import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserVisa } from '../user.visa.js';
import type { PersonalUserAggregateRoot } from './personal-user.js';
import type {
	PersonalUserAccountProfileLocationEntityReference,
	PersonalUserAccountProfileLocationProps,
} from './personal-user-account-profile-location.entity.js';

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
		console.log(this.visa); // Temporary added to avoid unused variable error
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

	private validateVisa(): void {
		if (
			!this.root.isNew &&
			!this.visa.determineIf((permissions) => permissions.isEditingOwnAccount)
		) {
			throw new DomainSeedwork.PermissionError(
				'Unauthorized to set location info',
			);
		}
	}

	// Primitive Field Setters
	set address1(value: string) {
		this.validateVisa();
		this.props.address1 = value;
	}
	set address2(value: string | null) {
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
