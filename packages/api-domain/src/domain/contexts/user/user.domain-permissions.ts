/**
 * Domain permissions for the User bounded context.
 * Defines authorization capabilities for user-related operations.
 */
export interface UserDomainPermissions {
	// User aggregate permissions
	canCreateUser: boolean;
	canManageUser: boolean;
	canViewUserProfile: boolean;
	canEditUserProfile: boolean;
	
	// User moderation permissions (admin)
	canBlockUser: boolean;
	canUnblockUser: boolean;
	canViewAllUsers: boolean;
	canViewUserReports: boolean;
	
	// Profile-specific permissions
	canViewPrivateProfile: boolean;
	canEditAccountSettings: boolean;
	canViewBillingInfo: boolean;
	canEditBillingInfo: boolean;
	
	// System permissions
	isSystemAccount: boolean;
	isUserOwner: boolean;
	isAdmin: boolean;
}