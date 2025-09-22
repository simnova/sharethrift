/**
 * Domain permissions for the User bounded context.
 * Defines authorization capabilities for user-related operations.
 */
export interface UserDomainPermissions {
	// Admin Permissions
	canCreateUser: boolean;
	canBlockUsers: boolean;
	canBlockListings: boolean;
	canUnblockUsers: boolean;
	canUnblockListings: boolean;
	canRemoveListings: boolean;
	canViewListingReports: boolean;
	canViewUserReports: boolean;

	isEditingOwnAccount: boolean;
	isSystemAccount: boolean;
}
