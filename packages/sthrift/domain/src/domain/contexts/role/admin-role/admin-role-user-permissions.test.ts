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

	const makeUserPermissionsAllFalse = () =>
		new AdminRoleUserPermissions({
			canBlockUsers: false,
			canViewAllUsers: false,
			canEditUsers: false,
			canDeleteUsers: false,
			canManageUserRoles: false,
			canAccessAnalytics: false,
			canManageRoles: false,
			canViewReports: false,
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

	Scenario(
		'Admin role user permissions should have canAccessAnalytics',
		({ Given, When, Then }) => {
			let permissions: AdminRoleUserPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role user permissions', () => {
				permissions = makeUserPermissions();
			});

			When('I access the canAccessAnalytics property', () => {
				value = permissions.canAccessAnalytics;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role user permissions should have canManageRoles',
		({ Given, When, Then }) => {
			let permissions: AdminRoleUserPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role user permissions', () => {
				permissions = makeUserPermissions();
			});

			When('I access the canManageRoles property', () => {
				value = permissions.canManageRoles;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role user permissions should have canViewReports',
		({ Given, When, Then }) => {
			let permissions: AdminRoleUserPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role user permissions', () => {
				permissions = makeUserPermissions();
			});

			When('I access the canViewReports property', () => {
				value = permissions.canViewReports;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role user permissions should have canDeleteContent',
		({ Given, When, Then }) => {
			let permissions: AdminRoleUserPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role user permissions', () => {
				permissions = makeUserPermissions();
			});

			When('I access the canDeleteContent property', () => {
				value = permissions.canDeleteContent;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Setting canBlockUsers should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleUserPermissions;

			Given('I have admin role user permissions with canBlockUsers false', () => {
				permissions = makeUserPermissionsAllFalse();
			});

			When('I set canBlockUsers to true', () => {
				permissions.canBlockUsers = true;
			});

			Then('canBlockUsers should be true', () => {
				expect(permissions.canBlockUsers).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canViewAllUsers should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleUserPermissions;

			Given(
				'I have admin role user permissions with canViewAllUsers false',
				() => {
					permissions = makeUserPermissionsAllFalse();
				},
			);

			When('I set canViewAllUsers to true', () => {
				permissions.canViewAllUsers = true;
			});

			Then('canViewAllUsers should be true', () => {
				expect(permissions.canViewAllUsers).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canEditUsers should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleUserPermissions;

			Given('I have admin role user permissions with canEditUsers false', () => {
				permissions = makeUserPermissionsAllFalse();
			});

			When('I set canEditUsers to true', () => {
				permissions.canEditUsers = true;
			});

			Then('canEditUsers should be true', () => {
				expect(permissions.canEditUsers).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canDeleteUsers should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleUserPermissions;

			Given(
				'I have admin role user permissions with canDeleteUsers false',
				() => {
					permissions = makeUserPermissionsAllFalse();
				},
			);

			When('I set canDeleteUsers to true', () => {
				permissions.canDeleteUsers = true;
			});

			Then('canDeleteUsers should be true', () => {
				expect(permissions.canDeleteUsers).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canManageUserRoles should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleUserPermissions;

			Given(
				'I have admin role user permissions with canManageUserRoles false',
				() => {
					permissions = makeUserPermissionsAllFalse();
				},
			);

			When('I set canManageUserRoles to true', () => {
				permissions.canManageUserRoles = true;
			});

			Then('canManageUserRoles should be true', () => {
				expect(permissions.canManageUserRoles).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canAccessAnalytics should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleUserPermissions;

			Given(
				'I have admin role user permissions with canAccessAnalytics false',
				() => {
					permissions = makeUserPermissionsAllFalse();
				},
			);

			When('I set canAccessAnalytics to true', () => {
				permissions.canAccessAnalytics = true;
			});

			Then('canAccessAnalytics should be true', () => {
				expect(permissions.canAccessAnalytics).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canManageRoles should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleUserPermissions;

			Given(
				'I have admin role user permissions with canManageRoles false',
				() => {
					permissions = makeUserPermissionsAllFalse();
				},
			);

			When('I set canManageRoles to true', () => {
				permissions.canManageRoles = true;
			});

			Then('canManageRoles should be true', () => {
				expect(permissions.canManageRoles).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canViewReports should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleUserPermissions;

			Given(
				'I have admin role user permissions with canViewReports false',
				() => {
					permissions = makeUserPermissionsAllFalse();
				},
			);

			When('I set canViewReports to true', () => {
				permissions.canViewReports = true;
			});

			Then('canViewReports should be true', () => {
				expect(permissions.canViewReports).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canDeleteContent should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleUserPermissions;

			Given(
				'I have admin role user permissions with canDeleteContent false',
				() => {
					permissions = makeUserPermissionsAllFalse();
				},
			);

			When('I set canDeleteContent to true', () => {
				permissions.canDeleteContent = true;
			});

			Then('canDeleteContent should be true', () => {
				expect(permissions.canDeleteContent).toBe(true);
			});
		},
	);
});
