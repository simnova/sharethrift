import type { PersonalUserRolePermissionsProps } from './personal-user-role/personal-user-role-permissions.ts';
import { PersonalUserRolePermissions } from './personal-user-role/personal-user-role-permissions.ts';

/**
 * Default permission values with all permissions enabled
 */
export const DEFAULT_PERMISSIONS_PROPS: Readonly<PersonalUserRolePermissionsProps> = {
	listingPermissions: {
		canCreateItemListing: true,
		canUpdateItemListing: true,
		canDeleteItemListing: true,
		canViewItemListing: true,
		canPublishItemListing: true,
		canUnpublishItemListing: true,
		canReserveItemListing: true,
	},
	conversationPermissions: {
		canCreateConversation: true,
		canManageConversation: true,
		canViewConversation: true,
	},
	reservationRequestPermissions: {
		canCreateReservationRequest: true,
		canManageReservationRequest: true,
		canViewReservationRequest: true,
	},
};

/**
 * Creates a default PersonalUserRolePermissions object with all permissions enabled.
 * Use this factory in tests to reduce duplication.
 * 
 * @param overrides - Optional overrides for specific permissions
 * @returns PersonalUserRolePermissions instance with all permissions set to true by default
 */
export function createDefaultRolePermissions(
	overrides: Partial<PersonalUserRolePermissionsProps> = {},
): PersonalUserRolePermissions {
	return new PersonalUserRolePermissions({
		...DEFAULT_PERMISSIONS_PROPS,
		...overrides,
	});
}
