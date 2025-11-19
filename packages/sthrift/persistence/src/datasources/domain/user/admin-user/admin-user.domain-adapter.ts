import { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { AdminRoleDomainAdapter } from '../../role/admin-role/admin-role.domain-adapter.ts';
import { createStringAccessors } from '../user-adapter.helpers.ts';

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
	accountType!: string;
	email!: string;
	username!: string;

	constructor(props: Models.User.AdminUserAccount) {
		this.props = props;
		createStringAccessors(this, ['accountType', 'email', 'username']);
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
	firstName!: string;
	lastName!: string;
	aboutMe!: string;

	constructor(props: Models.User.AdminUserAccountProfile) {
		this.props = props;
		createStringAccessors(this, ['firstName', 'lastName', 'aboutMe']);
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
	readonly props: Models.User.AdminUserAccountProfileLocation;
	address1!: string;
	address2!: string | null;
	city!: string;
	state!: string;
	country!: string;
	zipCode!: string;

	constructor(props: Models.User.AdminUserAccountProfileLocation) {
		this.props = props;
		createStringAccessors(this, [
			'address1',
			'address2',
			'city',
			'state',
			'country',
			'zipCode',
		]);
	}
}
