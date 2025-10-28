/**
 * Domain permissions for the User bounded context.
 * Defines authorization capabilities for user-related operations.
 */
export interface UserDomainPermissions {
	// Users management permissions
	canCreateUser: boolean;
	canBlockUsers: boolean;
	canUnblockUsers: boolean;

	// runtime permissions
	isEditingOwnAccount: boolean;
	isSystemAccount: boolean;
}
