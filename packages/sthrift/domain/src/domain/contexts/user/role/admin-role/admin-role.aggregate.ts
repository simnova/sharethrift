import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../../passport.ts';
import type { UserVisa } from '../../user.visa.ts';
import { AdminRolePermissions } from './admin-role-permissions.ts';
import * as ValueObjects from './admin-role.value-objects.ts';
import type {
	AdminRoleEntityReference,
	AdminRoleProps,
} from './admin-role.entity.ts';

export class AdminRole<props extends AdminRoleProps>
	extends DomainSeedwork.AggregateRoot<props, Passport>
	implements AdminRoleEntityReference
{
	private isNew: boolean = false;
	private readonly visa: UserVisa;

	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.user.forAdminRole(this);
	}

	public static getNewInstance<props extends AdminRoleProps>(
		newProps: props,
		passport: Passport,
		roleName: string,
		isDefault: boolean,
	): AdminRole<props> {
		const role = new AdminRole(newProps, passport);
		role.isNew = true;
		role.roleName = roleName;
		role.isDefault = isDefault;
		role.isNew = false;
		return role;
	}

	private validateVisa(): void {
		if (
			!this.isNew &&
			!this.visa.determineIf(
				(permissions) =>
					permissions.canManageUserRoles
			)
		) {
			throw new DomainSeedwork.PermissionError(
				'Unauthorized to modify role',
			);
		}
	}

	get roleName() {
		return this.props.roleName;
	}
	set roleName(roleName: string) {
		this.validateVisa();
		this.props.roleName = new ValueObjects.RoleName(roleName).valueOf();
	}

	get isDefault() {
		return this.props.isDefault;
	}
	set isDefault(isDefault: boolean) {
		this.validateVisa();
		this.props.isDefault = isDefault;
	}

	get permissions() {
		return new AdminRolePermissions(this.props.permissions);
	}

	get roleType() {
		return this.props.roleType;
	}
	get createdAt() {
		return this.props.createdAt;
	}
	get updatedAt() {
		return this.props.updatedAt;
	}
	get schemaVersion() {
		return this.props.schemaVersion;
	}
}
