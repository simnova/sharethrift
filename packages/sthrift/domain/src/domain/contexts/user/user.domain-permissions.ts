/**
 * Domain permissions for the User bounded context.
 * Defines authorization capabilities for user-related operations.
 */
export interface UserDomainPermissions {
	// Admin Permissions
	canBlockUsers: boolean;
	canUnblockUsers: boolean;
	canUnblockListings: boolean;
	canRemoveListings: boolean;
	canViewListingReports: boolean;
	canViewUserReports: boolean;
	canManageUserRoles: boolean;

	// runtime permissions
	isEditingOwnAccount: boolean;
}
