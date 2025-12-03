import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { AdminRolePermissions } from './admin-role-permissions.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-role-permissions.feature'),
);

test.for(feature, ({ Scenario }) => {
	const makePermissions = () =>
		new AdminRolePermissions({
			userPermissions: {
				canBlockUsers: true,
				canViewAllUsers: true,
				canEditUsers: true,
				canDeleteUsers: false,
				canManageUserRoles: true,
				canAccessAnalytics: true,
				canManageRoles: true,
				canViewReports: true,
				canDeleteContent: false,
			},
			conversationPermissions: {
				canViewAllConversations: true,
				canEditConversations: false,
				canDeleteConversations: false,
				canCloseConversations: true,
				canModerateConversations: true,
			},
			listingPermissions: {
				canViewAllListings: true,
				canManageAllListings: true,
				canEditListings: true,
				canDeleteListings: false,
				canApproveListings: true,
				canRejectListings: true,
				canBlockListings: true,
				canUnblockListings: true,
				canModerateListings: true,
			},
			reservationRequestPermissions: {
				canViewAllReservations: true,
				canApproveReservations: true,
				canRejectReservations: true,
				canCancelReservations: true,
				canEditReservations: false,
				canModerateReservations: true,
			},
		});

	Scenario(
		'Admin role permissions should contain user permissions',
		({ Given, When, Then }) => {
			let permissions: AdminRolePermissions;

			Given('I have admin role permissions', () => {
				permissions = makePermissions();
			});

			When('I access the userPermissions property', () => {
				// Access the property
			});

			Then('it should be defined', () => {
				expect(permissions.userPermissions).toBeDefined();
			});
		},
	);

	Scenario(
		'Admin role permissions should contain conversation permissions',
		({ Given, When, Then }) => {
			let permissions: AdminRolePermissions;

			Given('I have admin role permissions', () => {
				permissions = makePermissions();
			});

			When('I access the conversationPermissions property', () => {
				// Access the property
			});

			Then('it should be defined', () => {
				expect(permissions.conversationPermissions).toBeDefined();
			});
		},
	);

	Scenario(
		'Admin role permissions should contain listing permissions',
		({ Given, When, Then }) => {
			let permissions: AdminRolePermissions;

			Given('I have admin role permissions', () => {
				permissions = makePermissions();
			});

			When('I access the listingPermissions property', () => {
				// Access the property
			});

			Then('it should be defined', () => {
				expect(permissions.listingPermissions).toBeDefined();
			});
		},
	);

	Scenario(
		'Admin role permissions should contain reservation request permissions',
		({ Given, When, Then }) => {
			let permissions: AdminRolePermissions;

			Given('I have admin role permissions', () => {
				permissions = makePermissions();
			});

			When('I access the reservationRequestPermissions property', () => {
				// Access the property
			});

			Then('it should be defined', () => {
				expect(permissions.reservationRequestPermissions).toBeDefined();
			});
		},
	);
});
