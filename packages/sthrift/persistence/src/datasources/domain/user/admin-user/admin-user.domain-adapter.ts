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

	get adminLevel(): Domain.Contexts.User.AdminUser.AdminLevel {
		return this.doc.adminLevel as Domain.Contexts.User.AdminUser.AdminLevel;
	}
	set adminLevel(value: Domain.Contexts.User.AdminUser.AdminLevel) {
		this.doc.adminLevel = value;
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
		if (this.doc.role instanceof MongooseSeedwork.ObjectId) {
			throw new Error('role is not populated or is not of the correct type');
		}
		return new AdminRoleDomainAdapter(this.doc.role as Models.Role.AdminRole);
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

	set role(
		role:
			| Domain.Contexts.Role.AdminRole.AdminRoleEntityReference
			| Domain.Contexts.Role.AdminRole.AdminRole<AdminRoleDomainAdapter>,
	) {
		if (role instanceof Domain.Contexts.Role.AdminRole.AdminRole) {
			this.doc.set('role', role.props.doc);
			return;
		}
		if (!role?.id) {
			throw new Error('role reference is missing id');
		}
		this.doc.set('role', new MongooseSeedwork.ObjectId(role.id));
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
 * Simpler than PersonalUser - no nested Profile/Location/Billing
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
}
