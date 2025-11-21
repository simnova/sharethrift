import type { AdminRolePermissionsProps } from './admin-role/admin-role-permissions.ts';
import { AdminRolePermissions } from './admin-role/admin-role-permissions.ts';

/**
 * Default permission values with all permissions enabled
 */
export const DEFAULT_PERMISSIONS_PROPS: Readonly<AdminRolePermissionsProps> = {
	listingPermissions: {
		canViewAllListings: true,
		canManageAllListings: true,
		canEditListings: true,
		canDeleteListings: true,
		canApproveListings: true,
		canRejectListings: true,
		canBlockListings: true,
		canUnblockListings: true,
		canModerateListings: true,
	},
	conversationPermissions: {
		canViewAllConversations: true,
		canEditConversations: true,
		canDeleteConversations: true,
		canCloseConversations: true,
		canModerateConversations: true,
	},
	reservationRequestPermissions: {
		canViewAllReservations: true,
		canApproveReservations: true,
		canRejectReservations: true,
		canCancelReservations: true,
		canEditReservations: true,
		canModerateReservations: true,
	},
	userPermissions: {
		canBlockUsers: true,
		canViewAllUsers: true,
		canEditUsers: true,
		canDeleteUsers: true,
		canManageUserRoles: true,
		canAccessAnalytics: true,
		canManageRoles: true,
		canViewReports: true,
		canDeleteContent: true,
	},
};

/**
 * Creates a default AdminRolePermissions object with all permissions enabled.
 * Use this factory in tests to reduce duplication.
 * 
 * @param overrides - Optional overrides for specific permissions
 * @returns AdminRolePermissions instance with all permissions set to true by default
 */
export function createDefaultRolePermissions(
	overrides: Partial<AdminRolePermissionsProps> = {},
): AdminRolePermissions {
	return new AdminRolePermissions({
		...DEFAULT_PERMISSIONS_PROPS,
		...overrides,
	});
}
