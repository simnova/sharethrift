import { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { AdminRoleDomainAdapter } from '../../role/admin-role/admin-role.domain-adapter.ts';

export class AdminUserConverter extends MongooseSeedwork.MongoTypeConverter<
	Models.User.AdminUser,
	AdminUserDomainAdapter,
	Domain.Passport,
	Domain.Contexts.User.AdminUser.AdminUser<AdminUserDomainAdapter>
> {
	constructor() {
		super(
			AdminUserDomainAdapter,
			Domain.Contexts.User.AdminUser.AdminUser<AdminUserDomainAdapter>,
		);
	}
}

export class AdminUserDomainAdapter
	extends MongooseSeedwork.MongooseDomainAdapter<Models.User.AdminUser>
	implements Domain.Contexts.User.AdminUser.AdminUserProps
{
	get userType() {
		return this.doc.userType;
	}
	set userType(value: string) {
		this.doc.userType = value;
	}

	get isBlocked() {
		return this.doc.isBlocked;
	}
	set isBlocked(value: boolean) {
		this.doc.isBlocked = value;
	}

	get role(): Domain.Contexts.Role.AdminRole.AdminRoleProps {
		if (!this.doc.role) {
			throw new Error('role is not populated');
		}
		// Check if role is actually populated (has role properties) vs just an ObjectId reference
		if (!('roleName' in this.doc.role)) {
			throw new TypeError(
				'role is not populated or is not of the correct type',
			);
		}
		return new AdminRoleDomainAdapter(this.doc.role);
	}

	async loadRole(): Promise<Domain.Contexts.Role.AdminRole.AdminRoleProps> {
		if (!this.doc.role) {
			throw new Error('role is not populated');
		}
		if (this.doc.role instanceof MongooseSeedwork.ObjectId) {
			await this.doc.populate('role');
		}
		return new AdminRoleDomainAdapter(this.doc.role as Models.Role.AdminRole);
	}

	set role(role:
		| Domain.Contexts.Role.AdminRole.AdminRoleEntityReference
		| Domain.Contexts.Role.AdminRole.AdminRole<AdminRoleDomainAdapter>,) {
		if (role instanceof Domain.Contexts.Role.AdminRole.AdminRole) {
			this.doc.set('role', role.props.doc);
			return;
		}
		if (!role?.id) {
			throw new Error('role reference is missing id');
		}
		this.doc.set('role', new MongooseSeedwork.ObjectId(String(role.id)));
	}

	get account() {
		if (!this.doc.account) {
			this.doc.set('account', {});
		}
		return new AdminUserAccountDomainAdapter(this.doc.account);
	}
}

/**
 * Admin User Account Domain Adapter
 */
export class AdminUserAccountDomainAdapter
	implements Domain.Contexts.User.AdminUser.AdminUserAccountProps
{
	private readonly props: Models.User.AdminUserAccount;

	constructor(props: Models.User.AdminUserAccount) {
		this.props = props;
	}

	get accountType() {
		return this.props.accountType;
	}
	set accountType(value: string) {
		this.props.accountType = value;
	}

	get email() {
		return this.props.email;
	}
	set email(value: string) {
		this.props.email = value;
	}

	get username() {
		return this.props.username;
	}
	set username(value: string) {
		this.props.username = value;
	}

	get profile() {
		if (!this.props.profile) {
			this.props.set('profile', {});
		}
		return new AdminUserAccountProfileDomainAdapter(this.props.profile);
	}
}

/**
 * Admin User Account Profile Domain Adapter
 */
export class AdminUserAccountProfileDomainAdapter
	implements Domain.Contexts.User.AdminUser.AdminUserProfileProps
{
	private readonly props: Models.User.AdminUserAccountProfile;

	constructor(props: Models.User.AdminUserAccountProfile) {
		this.props = props;
	}

	get firstName() {
		return this.props.firstName;
	}
	set firstName(value: string) {
		this.props.firstName = value;
	}

	get lastName() {
		return this.props.lastName;
	}
	set lastName(value: string) {
		this.props.lastName = value;
	}

	get aboutMe() {
		return this.props.aboutMe;
	}
	set aboutMe(value: string) {
		this.props.aboutMe = value;
	}

	get location() {
		if (!this.props.location) {
			this.props.set('location', {});
		}
		return new AdminUserAccountProfileLocationDomainAdapter(
			this.props.location,
		);
	}
}

/**
 * Admin User Account Profile Location Domain Adapter
 */
export class AdminUserAccountProfileLocationDomainAdapter
	implements Domain.Contexts.User.AdminUser.AdminUserAccountProfileLocationProps
{
	private readonly props: Models.User.AdminUserAccountProfileLocation;

	constructor(props: Models.User.AdminUserAccountProfileLocation) {
		this.props = props;
	}

	get address1() {
		return this.props.address1;
	}
	set address1(value: string) {
		this.props.address1 = value;
	}

	get address2() {
		return this.props.address2;
	}
	set address2(value: string | null) {
		this.props.address2 = value;
	}

	get city() {
		return this.props.city;
	}
	set city(value: string) {
		this.props.city = value;
	}

	get state() {
		return this.props.state;
	}
	set state(value: string) {
		this.props.state = value;
	}

	get country() {
		return this.props.country;
	}
	set country(value: string) {
		this.props.country = value;
	}

	get zipCode() {
		return this.props.zipCode;
	}
	set zipCode(value: string) {
		this.props.zipCode = value;
	}
}
