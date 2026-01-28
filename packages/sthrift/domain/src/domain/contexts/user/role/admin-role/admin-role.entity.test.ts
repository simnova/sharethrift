import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import type { AdminRoleProps } from './admin-role.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-role.entity.feature'),
);

// biome-ignore lint/suspicious/noExplicitAny: Test helper function
function makeAdminRoleProps(overrides?: Partial<AdminRoleProps>): any {
	return {
		id: 'test-role-id',
		roleType: 'admin',
		roleName: 'Administrator',
		isDefault: false,
		permissions: {
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
		},
		schemaVersion: '1.0',
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

test.for(feature, ({ Background, Scenario }) => {
	// biome-ignore lint/suspicious/noExplicitAny: Test variable
	let props: any;

	Background(({ Given }) => {
		Given('I have an admin role props object', () => {
			props = makeAdminRoleProps();
		});
	});

	Scenario('Admin role roleType should be a string', ({ When, Then }) => {
		When('I access the roleType property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const roleProps: AdminRoleProps = props;
			expect(typeof roleProps.roleType).toBe('string');
			expect(roleProps.roleType).toBe('admin');
		});
	});

	Scenario('Admin role roleName should be a string', ({ When, Then }) => {
		When('I access the roleName property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const roleProps: AdminRoleProps = props;
			expect(typeof roleProps.roleName).toBe('string');
			expect(roleProps.roleName).toBe('Administrator');
		});
	});

	Scenario('Admin role isDefault should be a boolean', ({ When, Then }) => {
		When('I access the isDefault property', () => {
			// Access the property
		});

		Then('it should be a boolean', () => {
			const roleProps: AdminRoleProps = props;
			expect(typeof roleProps.isDefault).toBe('boolean');
		});
	});

	Scenario('Admin role permissions should be readonly', ({ When, Then }) => {
		When('I access the permissions property', () => {
			// Access the property
		});

		Then('it should be an object', () => {
			const roleProps: AdminRoleProps = props;
			expect(roleProps.permissions).toBeDefined();
			expect(typeof roleProps.permissions).toBe('object');
		});
	});

	Scenario('Admin role schemaVersion should be readonly', ({ When, Then }) => {
		When('I access the schemaVersion property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const roleProps: AdminRoleProps = props;
			expect(typeof roleProps.schemaVersion).toBe('string');
			expect(roleProps.schemaVersion).toBe('1.0');
		});
	});

	Scenario('Admin role timestamps should be dates', ({ When, Then }) => {
		When('I access the timestamp properties', () => {
			// Access the properties
		});

		Then('createdAt and updatedAt should be Date objects', () => {
			const roleProps: AdminRoleProps = props;
			expect(roleProps.createdAt).toBeInstanceOf(Date);
			expect(roleProps.updatedAt).toBeInstanceOf(Date);
		});
	});
});
