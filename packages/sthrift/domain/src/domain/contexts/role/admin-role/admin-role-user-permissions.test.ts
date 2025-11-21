import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { AdminRoleUserPermissions } from './admin-role-user-permissions.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-role-user-permissions.feature'),
);

test.for(feature, ({ Scenario }) => {
	const makeUserPermissions = () =>
		new AdminRoleUserPermissions({
			canBlockUsers: true,
			canViewAllUsers: true,
			canEditUsers: true,
			canDeleteUsers: false,
			canManageUserRoles: true,
			canAccessAnalytics: true,
			canManageRoles: true,
			canViewReports: true,
			canDeleteContent: false,
		});

	Scenario(
		'Admin role user permissions should have canBlockUsers',
		({ Given, When, Then }) => {
			let permissions: AdminRoleUserPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role user permissions', () => {
				permissions = makeUserPermissions();
			});

			When('I access the canBlockUsers property', () => {
				value = permissions.canBlockUsers;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role user permissions should have canViewAllUsers',
		({ Given, When, Then }) => {
			let permissions: AdminRoleUserPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role user permissions', () => {
				permissions = makeUserPermissions();
			});

			When('I access the canViewAllUsers property', () => {
				value = permissions.canViewAllUsers;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role user permissions should have canEditUsers',
		({ Given, When, Then }) => {
			let permissions: AdminRoleUserPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role user permissions', () => {
				permissions = makeUserPermissions();
			});

			When('I access the canEditUsers property', () => {
				value = permissions.canEditUsers;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role user permissions should have canDeleteUsers',
		({ Given, When, Then }) => {
			let permissions: AdminRoleUserPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role user permissions', () => {
				permissions = makeUserPermissions();
			});

			When('I access the canDeleteUsers property', () => {
				value = permissions.canDeleteUsers;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role user permissions should have canManageUserRoles',
		({ Given, When, Then }) => {
			let permissions: AdminRoleUserPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role user permissions', () => {
				permissions = makeUserPermissions();
			});

			When('I access the canManageUserRoles property', () => {
				value = permissions.canManageUserRoles;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);
});
