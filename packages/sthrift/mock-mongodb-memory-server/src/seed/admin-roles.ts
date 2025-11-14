import type { Models } from '@sthrift/data-sources-mongoose-models';

export const adminRoles = [
	{
		_id: '707f1f77bcf86cd799439031',
		roleType: 'admin-role',
		roleName: 'Super Admin',
		isDefault: false,
		permissions: {
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
			} as Models.Role.AdminRoleUserPermissions,
			conversationPermissions: {
				canModerateConversations: true,
			} as Models.Role.AdminRoleConversationPermissions,
			listingPermissions: {
				canModerateListings: true,
			} as Models.Role.AdminRoleListingPermissions,
			reservationRequestPermissions: {
				canModerateReservations: true,
			} as Models.Role.AdminRoleReservationRequestPermissions,
		} as Models.Role.AdminRolePermissions,
		schemaVersion: '1.0.0',
		createdAt: new Date('2023-01-01T09:00:00Z'),
		updatedAt: new Date('2023-01-01T09:00:00Z'),
	},
	{
		_id: '707f1f77bcf86cd799439032',
		roleType: 'admin-role',
		roleName: 'Content Moderator',
		isDefault: false,
		permissions: {
			userPermissions: {
				canBlockUsers: false,
				canViewAllUsers: true,
				canEditUsers: false,
				canDeleteUsers: false,
				canManageUserRoles: false,
				canAccessAnalytics: false,
				canManageRoles: false,
				canViewReports: true,
				canDeleteContent: false,
			} as Models.Role.AdminRoleUserPermissions,
			conversationPermissions: {
				canModerateConversations: true,
			} as Models.Role.AdminRoleConversationPermissions,
			listingPermissions: {
				canModerateListings: true,
			} as Models.Role.AdminRoleListingPermissions,
			reservationRequestPermissions: {
				canModerateReservations: true,
			} as Models.Role.AdminRoleReservationRequestPermissions,
		} as Models.Role.AdminRolePermissions,
		schemaVersion: '1.0.0',
		createdAt: new Date('2023-01-01T09:00:00Z'),
		updatedAt: new Date('2023-01-01T09:00:00Z'),
	},
	{
		_id: '707f1f77bcf86cd799439033',
		roleType: 'admin-role',
		roleName: 'Read Only Admin',
		isDefault: true,
		permissions: {
			userPermissions: {
				canBlockUsers: false,
				canViewAllUsers: true,
				canEditUsers: false,
				canDeleteUsers: false,
				canManageUserRoles: false,
				canAccessAnalytics: true,
				canManageRoles: false,
				canViewReports: true,
				canDeleteContent: false,
			} as Models.Role.AdminRoleUserPermissions,
			conversationPermissions: {
				canModerateConversations: false,
			} as Models.Role.AdminRoleConversationPermissions,
			listingPermissions: {
				canModerateListings: false,
			} as Models.Role.AdminRoleListingPermissions,
			reservationRequestPermissions: {
				canModerateReservations: false,
			} as Models.Role.AdminRoleReservationRequestPermissions,
		} as Models.Role.AdminRolePermissions,
		schemaVersion: '1.0.0',
		createdAt: new Date('2023-01-01T09:00:00Z'),
		updatedAt: new Date('2023-01-01T09:00:00Z'),
	},
] as unknown as Models.Role.AdminRole[];
