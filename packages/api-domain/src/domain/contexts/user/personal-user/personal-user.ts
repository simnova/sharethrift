import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { UserVisa } from '../user.visa.ts';
import { PersonalUserAccount } from './personal-user-account.ts';
import { PersonalUserRole } from '../../role/personal-user-role/personal-user-role.ts';
import type { PersonalUserRoleEntityReference } from '../../role/personal-user-role/personal-user-role.entity.ts';
import type {
	PersonalUserEntityReference,
	PersonalUserProps,
} from './personal-user.entity.ts';

export interface PersonalUserAggregateRoot
	extends DomainSeedwork.RootEventRegistry {
	get isNew(): boolean;
}

export class PersonalUser<props extends PersonalUserProps>
	extends DomainSeedwork.AggregateRoot<props, Passport>
	implements PersonalUserEntityReference, PersonalUserAggregateRoot
{
	private _isNew: boolean = false;
	private readonly visa: UserVisa;
	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.user.forPersonalUser(this);
	}
	public static getNewInstance<props extends PersonalUserProps>(
		newProps: props,
		passport: Passport,
		email: string,
		firstName: string,
		lastName: string,
	): PersonalUser<props> {
		const newInstance = new PersonalUser(newProps, passport);
		newInstance.markAsNew();
		newInstance._isNew = true;
		//field assignments
		newInstance.account.email = email;
		newInstance.account.profile.firstName = firstName;
		newInstance.account.profile.lastName = lastName;
		newInstance._isNew = false;
		return newInstance;
	}

	private markAsNew(): void {
		this._isNew = true;
	}

	private validateVisa(): void {
		if (
			!this._isNew &&
			!this.visa.determineIf((permissions) => permissions.isEditingOwnAccount)
		) {
			throw new DomainSeedwork.PermissionError('Unauthorized to modify user');
		}
	}

	get isNew() {
		return this._isNew;
	}

	get userType(): string {
		return this.props.userType;
	}
	get isBlocked(): boolean {
		return this.props.isBlocked;
	}
	get hasCompletedOnboarding(): boolean {
		return this.props.hasCompletedOnboarding;
	}
	get schemaVersion(): string {
		return this.props.schemaVersion;
	}
	get createdAt(): Date {
		return this.props.createdAt;
	}
	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	get account(): PersonalUserAccount {
		return new PersonalUserAccount(this.props.account, this.visa, this);
	}

	get role(): PersonalUserRoleEntityReference {
		return new PersonalUserRole(this.props.role, this.passport);
	}

	async loadRole(): Promise<PersonalUserRoleEntityReference> {
		return await this.props.loadRole();
	}

	private set role(role: PersonalUserRoleEntityReference) {
		if (
			!this.isNew &&
			!this.visa.determineIf(
				(domainPermissions) => domainPermissions.canCreateUser,
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'You do not have permission to change the sharer of this conversation',
			);
		}
		if (role === null || role === undefined) {
			throw new DomainSeedwork.PermissionError(
				'sharer cannot be null or undefined',
			);
		}
		this.props.role = role;
	}

	set userType(value: string) {
		this.validateVisa();
		this.props.userType = value;
	}
	set isBlocked(value: boolean) {
		this.validateVisa();
		this.props.isBlocked = value;
	}
	set hasCompletedOnboarding(value: boolean) {
		if (this.props.hasCompletedOnboarding) {
			throw new DomainSeedwork.PermissionError(
				'Users can only be onboarded once.',
			);
		}

		this.props.hasCompletedOnboarding = value;
	}
}
