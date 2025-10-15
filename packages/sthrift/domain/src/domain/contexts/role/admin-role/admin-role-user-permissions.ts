import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface AdminRoleUserPermissionsProps
	extends DomainSeedwork.ValueObjectProps {
	canBlockUsers: boolean;
	canViewAllUsers: boolean;
	canEditUsers: boolean;
	canDeleteUsers: boolean;
	canManageUserRoles: boolean;
}

export interface AdminRoleUserPermissionsEntityReference
	extends Readonly<AdminRoleUserPermissionsProps> {}

export class AdminRoleUserPermissions
	extends DomainSeedwork.ValueObject<AdminRoleUserPermissionsProps>
	implements AdminRoleUserPermissionsEntityReference
{
	get canBlockUsers(): boolean {
		return this.props.canBlockUsers;
	}
	set canBlockUsers(value: boolean) {
		this.props.canBlockUsers = value;
	}

	get canViewAllUsers(): boolean {
		return this.props.canViewAllUsers;
	}
	set canViewAllUsers(value: boolean) {
		this.props.canViewAllUsers = value;
	}

	get canEditUsers(): boolean {
		return this.props.canEditUsers;
	}
	set canEditUsers(value: boolean) {
		this.props.canEditUsers = value;
	}

	get canDeleteUsers(): boolean {
		return this.props.canDeleteUsers;
	}
	set canDeleteUsers(value: boolean) {
		this.props.canDeleteUsers = value;
	}

	get canManageUserRoles(): boolean {
		return this.props.canManageUserRoles;
	}
	set canManageUserRoles(value: boolean) {
		this.props.canManageUserRoles = value;
	}
}
