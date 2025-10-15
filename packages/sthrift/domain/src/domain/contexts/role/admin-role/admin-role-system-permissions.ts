import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface AdminRoleSystemPermissionsProps
	extends DomainSeedwork.ValueObjectProps {
	canAccessAnalytics: boolean;
	canManageRoles: boolean;
	canViewSystemLogs: boolean;
	canManageSystemSettings: boolean;
	canAccessDatabaseTools: boolean;
}

export interface AdminRoleSystemPermissionsEntityReference
	extends Readonly<AdminRoleSystemPermissionsProps> {}

export class AdminRoleSystemPermissions
	extends DomainSeedwork.ValueObject<AdminRoleSystemPermissionsProps>
	implements AdminRoleSystemPermissionsEntityReference
{
	get canAccessAnalytics(): boolean {
		return this.props.canAccessAnalytics;
	}
	set canAccessAnalytics(value: boolean) {
		this.props.canAccessAnalytics = value;
	}

	get canManageRoles(): boolean {
		return this.props.canManageRoles;
	}
	set canManageRoles(value: boolean) {
		this.props.canManageRoles = value;
	}

	get canViewSystemLogs(): boolean {
		return this.props.canViewSystemLogs;
	}
	set canViewSystemLogs(value: boolean) {
		this.props.canViewSystemLogs = value;
	}

	get canManageSystemSettings(): boolean {
		return this.props.canManageSystemSettings;
	}
	set canManageSystemSettings(value: boolean) {
		this.props.canManageSystemSettings = value;
	}

	get canAccessDatabaseTools(): boolean {
		return this.props.canAccessDatabaseTools;
	}
	set canAccessDatabaseTools(value: boolean) {
		this.props.canAccessDatabaseTools = value;
	}
}
