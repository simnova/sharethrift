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

class AdminRolePermissionsDomainAdapter
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

class AdminRoleUserPermissionsDomainAdapter
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

class AdminRoleConversationPermissionsDomainAdapter
	implements
		Domain.Contexts.Role.AdminRole.AdminRoleConversationPermissionsProps
{
	public readonly props: Models.Role.AdminRoleConversationPermissions;
	constructor(props: Models.Role.AdminRoleConversationPermissions) {
		this.props = props;
	}

	get canViewAllConversations(): boolean {
		return this.props.canViewAllConversations;
	}
	set canViewAllConversations(value: boolean) {
		this.props.canViewAllConversations = value;
	}

	get canEditConversations(): boolean {
		return this.props.canEditConversations;
	}
	set canEditConversations(value: boolean) {
		this.props.canEditConversations = value;
	}

	get canDeleteConversations(): boolean {
		return this.props.canDeleteConversations;
	}
	set canDeleteConversations(value: boolean) {
		this.props.canDeleteConversations = value;
	}

	get canCloseConversations(): boolean {
		return this.props.canCloseConversations;
	}
	set canCloseConversations(value: boolean) {
		this.props.canCloseConversations = value;
	}

	get canModerateConversations(): boolean {
		return this.props.canModerateConversations;
	}
	set canModerateConversations(value: boolean) {
		this.props.canModerateConversations = value;
	}
}

class AdminRoleListingPermissionsDomainAdapter
	implements Domain.Contexts.Role.AdminRole.AdminRoleListingPermissionsProps
{
	public readonly props: Models.Role.AdminRoleListingPermissions;
	constructor(props: Models.Role.AdminRoleListingPermissions) {
		this.props = props;
	}

	get canViewAllListings(): boolean {
		return this.props.canViewAllListings;
	}
	set canViewAllListings(value: boolean) {
		this.props.canViewAllListings = value;
	}

	get canManageAllListings(): boolean {
		return this.props.canManageAllListings;
	}
	set canManageAllListings(value: boolean) {
		this.props.canManageAllListings = value;
	}

	get canEditListings(): boolean {
		return this.props.canEditListings;
	}
	set canEditListings(value: boolean) {
		this.props.canEditListings = value;
	}

	get canDeleteListings(): boolean {
		return this.props.canDeleteListings;
	}
	set canDeleteListings(value: boolean) {
		this.props.canDeleteListings = value;
	}

	get canApproveListings(): boolean {
		return this.props.canApproveListings;
	}
	set canApproveListings(value: boolean) {
		this.props.canApproveListings = value;
	}

	get canRejectListings(): boolean {
		return this.props.canRejectListings;
	}
	set canRejectListings(value: boolean) {
		this.props.canRejectListings = value;
	}

	get canBlockListings(): boolean {
		return this.props.canBlockListings;
	}
	set canBlockListings(value: boolean) {
		this.props.canBlockListings = value;
	}

	get canUnblockListings(): boolean {
		return this.props.canUnblockListings;
	}
	set canUnblockListings(value: boolean) {
		this.props.canUnblockListings = value;
	}

	get canModerateListings(): boolean {
		return this.props.canModerateListings;
	}
	set canModerateListings(value: boolean) {
		this.props.canModerateListings = value;
	}
}

class AdminRoleReservationRequestPermissionsDomainAdapter
	implements
		Domain.Contexts.Role.AdminRole.AdminRoleReservationRequestPermissionsProps
{
	public readonly props: Models.Role.AdminRoleReservationRequestPermissions;
	constructor(props: Models.Role.AdminRoleReservationRequestPermissions) {
		this.props = props;
	}

	get canViewAllReservations(): boolean {
		return this.props.canViewAllReservations;
	}
	set canViewAllReservations(value: boolean) {
		this.props.canViewAllReservations = value;
	}

	get canApproveReservations(): boolean {
		return this.props.canApproveReservations;
	}
	set canApproveReservations(value: boolean) {
		this.props.canApproveReservations = value;
	}

	get canRejectReservations(): boolean {
		return this.props.canRejectReservations;
	}
	set canRejectReservations(value: boolean) {
		this.props.canRejectReservations = value;
	}

	get canCancelReservations(): boolean {
		return this.props.canCancelReservations;
	}
	set canCancelReservations(value: boolean) {
		this.props.canCancelReservations = value;
	}

	get canEditReservations(): boolean {
		return this.props.canEditReservations;
	}
	set canEditReservations(value: boolean) {
		this.props.canEditReservations = value;
	}

	get canModerateReservations(): boolean {
		return this.props.canModerateReservations;
	}
	set canModerateReservations(value: boolean) {
		this.props.canModerateReservations = value;
	}
}
