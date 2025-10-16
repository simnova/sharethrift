import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { Domain } from '@sthrift/domain';

export class AdminRoleConverter extends MongooseSeedwork.MongoTypeConverter<
	Models.Role.AdminRole,
	AdminRoleDomainAdapter,
	Domain.Passport,
	Domain.Contexts.Role.AdminRole.AdminRole<AdminRoleDomainAdapter>
> {
	constructor() {
		super(AdminRoleDomainAdapter, Domain.Contexts.Role.AdminRole.AdminRole);
	}
}

export class AdminRoleDomainAdapter
	extends MongooseSeedwork.MongooseDomainAdapter<Models.Role.AdminRole>
	implements Domain.Contexts.Role.AdminRole.AdminRoleProps
{
	get roleName(): string {
		return this.doc.roleName;
	}
	set roleName(roleName: string) {
		this.doc.roleName = roleName;
	}

	get isDefault(): boolean {
		return this.doc.isDefault;
	}
	set isDefault(value: boolean) {
		this.doc.isDefault = value;
	}

	get permissions(): Domain.Contexts.Role.AdminRole.AdminRolePermissionsProps {
		if (!this.doc.permissions) {
			this.doc.set('permissions', {} as Models.Role.AdminRolePermissions);
		}
		return new AdminRolePermissionsDomainAdapter(this.doc.permissions);
	}

	get roleType(): string {
		return this.doc.roleType;
	}
}

export class AdminRolePermissionsDomainAdapter
	implements Domain.Contexts.Role.AdminRole.AdminRolePermissionsProps
{
	public readonly props: Models.Role.AdminRolePermissions;
	constructor(props: Models.Role.AdminRolePermissions) {
		this.props = props;
	}

	get userPermissions(): Domain.Contexts.Role.AdminRole.AdminRoleUserPermissionsProps {
		if (!this.props.userPermissions) {
			this.props.set('userPermissions', {});
		}
		return new AdminRoleUserPermissionsDomainAdapter(
			this.props.userPermissions,
		);
	}

	get contentPermissions(): Domain.Contexts.Role.AdminRole.AdminRoleContentPermissionsProps {
		if (!this.props.contentPermissions) {
			this.props.set('contentPermissions', {});
		}
		return new AdminRoleContentPermissionsDomainAdapter(
			this.props.contentPermissions,
		);
	}

	get systemPermissions(): Domain.Contexts.Role.AdminRole.AdminRoleSystemPermissionsProps {
		if (!this.props.systemPermissions) {
			this.props.set('systemPermissions', {});
		}
		return new AdminRoleSystemPermissionsDomainAdapter(
			this.props.systemPermissions,
		);
	}
}

export class AdminRoleUserPermissionsDomainAdapter
	implements Domain.Contexts.Role.AdminRole.AdminRoleUserPermissionsProps
{
	public readonly props: Models.Role.AdminRoleUserPermissions;
	constructor(props: Models.Role.AdminRoleUserPermissions) {
		this.props = props;
	}

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

export class AdminRoleContentPermissionsDomainAdapter
	implements Domain.Contexts.Role.AdminRole.AdminRoleContentPermissionsProps
{
	public readonly props: Models.Role.AdminRoleContentPermissions;
	constructor(props: Models.Role.AdminRoleContentPermissions) {
		this.props = props;
	}

	get canViewReports(): boolean {
		return this.props.canViewReports;
	}
	set canViewReports(value: boolean) {
		this.props.canViewReports = value;
	}

	get canModerateListings(): boolean {
		return this.props.canModerateListings;
	}
	set canModerateListings(value: boolean) {
		this.props.canModerateListings = value;
	}

	get canModerateConversations(): boolean {
		return this.props.canModerateConversations;
	}
	set canModerateConversations(value: boolean) {
		this.props.canModerateConversations = value;
	}

	get canModerateReservations(): boolean {
		return this.props.canModerateReservations;
	}
	set canModerateReservations(value: boolean) {
		this.props.canModerateReservations = value;
	}

	get canDeleteContent(): boolean {
		return this.props.canDeleteContent;
	}
	set canDeleteContent(value: boolean) {
		this.props.canDeleteContent = value;
	}
}

export class AdminRoleSystemPermissionsDomainAdapter
	implements Domain.Contexts.Role.AdminRole.AdminRoleSystemPermissionsProps
{
	public readonly props: Models.Role.AdminRoleSystemPermissions;
	constructor(props: Models.Role.AdminRoleSystemPermissions) {
		this.props = props;
	}

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
