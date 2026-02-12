import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserVisa } from '../user.visa.ts';
import type { PersonalUserAggregateRoot } from './personal-user.aggregate.ts';
import type {
	PersonalUserProfileEntityReference,
	PersonalUserProfileProps,
} from './personal-user-account-profile.entity.ts';
import { PersonalUserAccountProfileLocation } from './personal-user-account-profile-location.ts';
import { PersonalUserAccountProfileBilling } from './personal-user-account-profile-billing.ts';

export class PersonalUserProfile
	extends DomainSeedwork.ValueObject<PersonalUserProfileProps>
	implements PersonalUserProfileEntityReference
{
	private readonly visa: UserVisa;
	private readonly root: PersonalUserAggregateRoot;
	constructor(
		props: PersonalUserProfileProps,
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
				'Unauthorized to set account profile details',
			);
		}
	}

	// Primitive Field Getters
	get firstName() {
		return this.props.firstName;
	}
	get lastName() {
		return this.props.lastName;
	}
	get aboutMe() {
		return this.props.aboutMe;
	}

	// NestedPath Field Getters
	get location() {
		return new PersonalUserAccountProfileLocation(
			this.props.location,
			this.visa,
			this.root,
		);
	}
	get billing() {
		return new PersonalUserAccountProfileBilling(
			this.props.billing,
			this.visa,
			this.root,
		);
	}

	// PopulateDoc Field Getters

	// DocumentArray Field Getters

	// Primitive Field Setters
	set firstName(value: string) {
		this.validateVisa();
		this.props.firstName = value;
	}
	set lastName(value: string) {
		this.validateVisa();
		this.props.lastName = value;
	}
    set aboutMe(value: string) {
        this.validateVisa();
        this.props.aboutMe = value;
    }
}
