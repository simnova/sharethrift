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

	get conversationPermissions(): Domain.Contexts.Role.AdminRole.AdminRoleConversationPermissionsProps {
		if (!this.props.conversationPermissions) {
			this.props.set('conversationPermissions', {});
		}
		return new AdminRoleConversationPermissionsDomainAdapter(
			this.props.conversationPermissions,
		);
	}

	get listingPermissions(): Domain.Contexts.Role.AdminRole.AdminRoleListingPermissionsProps {
		if (!this.props.listingPermissions) {
			this.props.set('listingPermissions', {});
		}
		return new AdminRoleListingPermissionsDomainAdapter(
			this.props.listingPermissions,
		);
	}

	get reservationRequestPermissions(): Domain.Contexts.Role.AdminRole.AdminRoleReservationRequestPermissionsProps {
		if (!this.props.reservationRequestPermissions) {
			this.props.set('reservationRequestPermissions', {});
		}
		return new AdminRoleReservationRequestPermissionsDomainAdapter(
			this.props.reservationRequestPermissions,
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

	get canViewReports(): boolean {
		return this.props.canViewReports;
	}
	set canViewReports(value: boolean) {
		this.props.canViewReports = value;
	}

	get canDeleteContent(): boolean {
		return this.props.canDeleteContent;
	}
	set canDeleteContent(value: boolean) {
		this.props.canDeleteContent = value;
	}
}

export class AdminRoleConversationPermissionsDomainAdapter
	implements
		Domain.Contexts.Role.AdminRole.AdminRoleConversationPermissionsProps
{
	public readonly props: Models.Role.AdminRoleConversationPermissions;
	constructor(props: Models.Role.AdminRoleConversationPermissions) {
		this.props = props;
	}

	get canModerateConversations(): boolean {
		return this.props.canModerateConversations;
	}
	set canModerateConversations(value: boolean) {
		this.props.canModerateConversations = value;
	}
}

export class AdminRoleListingPermissionsDomainAdapter
	implements Domain.Contexts.Role.AdminRole.AdminRoleListingPermissionsProps
{
	public readonly props: Models.Role.AdminRoleListingPermissions;
	constructor(props: Models.Role.AdminRoleListingPermissions) {
		this.props = props;
	}

	get canModerateListings(): boolean {
		return this.props.canModerateListings;
	}
	set canModerateListings(value: boolean) {
		this.props.canModerateListings = value;
	}
}

export class AdminRoleReservationRequestPermissionsDomainAdapter
	implements
		Domain.Contexts.Role.AdminRole.AdminRoleReservationRequestPermissionsProps
{
	public readonly props: Models.Role.AdminRoleReservationRequestPermissions;
	constructor(props: Models.Role.AdminRoleReservationRequestPermissions) {
		this.props = props;
	}

	get canModerateReservations(): boolean {
		return this.props.canModerateReservations;
	}
	set canModerateReservations(value: boolean) {
		this.props.canModerateReservations = value;
	}
}
