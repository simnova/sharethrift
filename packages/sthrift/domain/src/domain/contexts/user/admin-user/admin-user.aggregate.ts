import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { UserVisa } from '../user.visa.ts';
import { AdminUserAccount } from './admin-user-account.ts';
import { AdminRole } from '../role/admin-role/admin-role.aggregate.ts';
import type { AdminRoleEntityReference } from '../role/admin-role/admin-role.entity.ts';
import type {
	AdminUserEntityReference,
	AdminUserProps,
} from './admin-user.entity.ts';

export interface AdminUserAggregateRoot
	extends DomainSeedwork.RootEventRegistry {
	get isNew(): boolean;
}

export class AdminUser<props extends AdminUserProps>
	extends DomainSeedwork.AggregateRoot<props, Passport>
	implements AdminUserEntityReference, AdminUserAggregateRoot
{
	private _isNew: boolean = false;
	private readonly visa: UserVisa;
	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.user.forAdminUser(this);
	}

	public static getNewInstance<props extends AdminUserProps>(
		newProps: props,
		passport: Passport,
		email: string,
		username: string,
		firstName: string,
		lastName: string,
	): AdminUser<props> {
		const newInstance = new AdminUser(newProps, passport);
		newInstance.markAsNew();
		// Field assignments
		newInstance.account.email = email;
		newInstance.account.username = username;
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

	async loadRole(): Promise<AdminRoleEntityReference> {
		return await this.props.loadRole();
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
	get schemaVersion(): string {
		return this.props.schemaVersion;
	}
	get createdAt(): Date {
		return this.props.createdAt;
	}
	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	get account(): AdminUserAccount {
		return new AdminUserAccount(this.props.account, this.visa, this);
	}

	get role(): AdminRoleEntityReference {
		return new AdminRole(this.props.role, this.passport);
	}

	private set role(role: AdminRoleEntityReference) {
		if (role === null || role === undefined) {
			throw new DomainSeedwork.PermissionError(
				'role cannot be null or undefined',
			);
		}
		// Only admins with canManageUserRoles permission can change roles
		if (
			!this._isNew &&
			!this.visa.determineIf((permissions) => permissions.canManageUserRoles)
		) {
			throw new DomainSeedwork.PermissionError(
				'Unauthorized: Only admins with canManageUserRoles permission can change user roles',
			);
		}
		this.props.role = role;
	}

	set userType(value: string) {
		this.validateVisa();
		this.props.userType = value;
	}
	set isBlocked(value: boolean) {
		// Only admins with canBlockUsers permission can block/unblock admin users
		if (!this.visa.determineIf((permissions) => permissions.canBlockUsers)) {
			throw new DomainSeedwork.PermissionError(
				'Unauthorized: Only admins with canBlockUsers permission can block/unblock admin users',
			);
		}
		this.props.isBlocked = value;
	}
}
