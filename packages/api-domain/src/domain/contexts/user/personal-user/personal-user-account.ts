import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserVisa } from '../user.visa.ts';
import type { PersonalUserAggregateRoot } from './personal-user.ts';
import {
	PersonalUserProfile,
	type PersonalUserProfileProps,
	type PersonalUserProfileEntityReference,
} from './personal-user-account-profile.ts';

export interface PersonalUserAccountProps
	extends DomainSeedwork.ValueObjectProps {
	accountType: string;
	email: string;
	username: string;

	readonly profile: PersonalUserProfileProps;
}

export interface PersonalUserAccountEntityReference
	extends Readonly<Omit<PersonalUserAccountProps, 'profile'>> {
	readonly profile: PersonalUserProfileEntityReference;
}

export class PersonalUserAccount
	extends DomainSeedwork.ValueObject<PersonalUserAccountProps>
	implements PersonalUserAccountEntityReference
{
	private readonly visa: UserVisa;
	private readonly root: PersonalUserAggregateRoot;
	constructor(
		props: PersonalUserAccountProps,
		visa: UserVisa,
		root: PersonalUserAggregateRoot,
	) {
		super(props);
		this.visa = visa;
		this.root = root;
	}

	private validateVisa(): void {
		if (
			!this.root.isNew
			// &&
			// !this.visa.determineIf(
			// 	(permissions) => permissions.canEditAccountSettings, //TODO: Adjust permissions as needed
			// )
		) {
			throw new DomainSeedwork.PermissionError(
				'Cannot set user account details',
			);
		}
	}
	// Primitive Field Getters
	get accountType() {
		return this.props.accountType;
	}
	get email() {
		return this.props.email;
	}
	get username() {
		return this.props.username;
	}

	// NestedPath Field Getters
	get profile() {
		return new PersonalUserProfile(this.props.profile, this.visa, this.root);
	}

	set accountType(value: string) {
		this.validateVisa();
		this.props.accountType = value;
	}
	set email(value: string) {
		this.validateVisa();
		this.props.email = value;
	}
	set username(value: string) {
		this.validateVisa();
		this.props.username = value;
	}
}
