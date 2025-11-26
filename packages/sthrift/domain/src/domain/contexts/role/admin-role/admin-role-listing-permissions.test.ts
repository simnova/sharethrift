import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { AdminRoleListingPermissions } from './admin-role-listing-permissions.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-role-listing-permissions.feature'),
);

test.for(feature, ({ Scenario }) => {
	const makeListingPermissions = () =>
		new AdminRoleListingPermissions({
			canViewAllListings: true,
			canManageAllListings: true,
			canEditListings: true,
			canDeleteListings: false,
			canApproveListings: true,
			canRejectListings: true,
			canBlockListings: true,
			canUnblockListings: true,
			canModerateListings: true,
		});

	const makeListingPermissionsAllFalse = () =>
		new AdminRoleListingPermissions({
			canViewAllListings: false,
			canManageAllListings: false,
			canEditListings: false,
			canDeleteListings: false,
			canApproveListings: false,
			canRejectListings: false,
			canBlockListings: false,
			canUnblockListings: false,
			canModerateListings: false,
		});

	Scenario(
		'Admin role listing permissions should have canViewAllListings',
		({ Given, When, Then }) => {
			let permissions: AdminRoleListingPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role listing permissions', () => {
				permissions = makeListingPermissions();
			});

			When('I access the canViewAllListings property', () => {
				value = permissions.canViewAllListings;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role listing permissions should have canManageAllListings',
		({ Given, When, Then }) => {
			let permissions: AdminRoleListingPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role listing permissions', () => {
				permissions = makeListingPermissions();
			});

			When('I access the canManageAllListings property', () => {
				value = permissions.canManageAllListings;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role listing permissions should have canEditListings',
		({ Given, When, Then }) => {
			let permissions: AdminRoleListingPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role listing permissions', () => {
				permissions = makeListingPermissions();
			});

			When('I access the canEditListings property', () => {
				value = permissions.canEditListings;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role listing permissions should have canDeleteListings',
		({ Given, When, Then }) => {
			let permissions: AdminRoleListingPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role listing permissions', () => {
				permissions = makeListingPermissions();
			});

			When('I access the canDeleteListings property', () => {
				value = permissions.canDeleteListings;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role listing permissions should have canApproveListings',
		({ Given, When, Then }) => {
			let permissions: AdminRoleListingPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role listing permissions', () => {
				permissions = makeListingPermissions();
			});

			When('I access the canApproveListings property', () => {
				value = permissions.canApproveListings;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role listing permissions should have canRejectListings',
		({ Given, When, Then }) => {
			let permissions: AdminRoleListingPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role listing permissions', () => {
				permissions = makeListingPermissions();
			});

			When('I access the canRejectListings property', () => {
				value = permissions.canRejectListings;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role listing permissions should have canBlockListings',
		({ Given, When, Then }) => {
			let permissions: AdminRoleListingPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role listing permissions', () => {
				permissions = makeListingPermissions();
			});

			When('I access the canBlockListings property', () => {
				value = permissions.canBlockListings;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role listing permissions should have canUnblockListings',
		({ Given, When, Then }) => {
			let permissions: AdminRoleListingPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role listing permissions', () => {
				permissions = makeListingPermissions();
			});

			When('I access the canUnblockListings property', () => {
				value = permissions.canUnblockListings;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Admin role listing permissions should have canModerateListings',
		({ Given, When, Then }) => {
			let permissions: AdminRoleListingPermissions;
			// biome-ignore lint/suspicious/noExplicitAny: Test variable
			let value: any;

			Given('I have admin role listing permissions', () => {
				permissions = makeListingPermissions();
			});

			When('I access the canModerateListings property', () => {
				value = permissions.canModerateListings;
			});

			Then('it should be a boolean', () => {
				expect(typeof value).toBe('boolean');
			});
		},
	);

	Scenario(
		'Setting canViewAllListings should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleListingPermissions;

			Given(
				'I have admin role listing permissions with canViewAllListings false',
				() => {
					permissions = makeListingPermissionsAllFalse();
				},
			);

			When('I set canViewAllListings to true', () => {
				permissions.canViewAllListings = true;
			});

			Then('canViewAllListings should be true', () => {
				expect(permissions.canViewAllListings).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canManageAllListings should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleListingPermissions;

			Given(
				'I have admin role listing permissions with canManageAllListings false',
				() => {
					permissions = makeListingPermissionsAllFalse();
				},
			);

			When('I set canManageAllListings to true', () => {
				permissions.canManageAllListings = true;
			});

			Then('canManageAllListings should be true', () => {
				expect(permissions.canManageAllListings).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canEditListings should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleListingPermissions;

			Given(
				'I have admin role listing permissions with canEditListings false',
				() => {
					permissions = makeListingPermissionsAllFalse();
				},
			);

			When('I set canEditListings to true', () => {
				permissions.canEditListings = true;
			});

			Then('canEditListings should be true', () => {
				expect(permissions.canEditListings).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canDeleteListings should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleListingPermissions;

			Given(
				'I have admin role listing permissions with canDeleteListings false',
				() => {
					permissions = makeListingPermissionsAllFalse();
				},
			);

			When('I set canDeleteListings to true', () => {
				permissions.canDeleteListings = true;
			});

			Then('canDeleteListings should be true', () => {
				expect(permissions.canDeleteListings).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canApproveListings should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleListingPermissions;

			Given(
				'I have admin role listing permissions with canApproveListings false',
				() => {
					permissions = makeListingPermissionsAllFalse();
				},
			);

			When('I set canApproveListings to true', () => {
				permissions.canApproveListings = true;
			});

			Then('canApproveListings should be true', () => {
				expect(permissions.canApproveListings).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canRejectListings should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleListingPermissions;

			Given(
				'I have admin role listing permissions with canRejectListings false',
				() => {
					permissions = makeListingPermissionsAllFalse();
				},
			);

			When('I set canRejectListings to true', () => {
				permissions.canRejectListings = true;
			});

			Then('canRejectListings should be true', () => {
				expect(permissions.canRejectListings).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canBlockListings should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleListingPermissions;

			Given(
				'I have admin role listing permissions with canBlockListings false',
				() => {
					permissions = makeListingPermissionsAllFalse();
				},
			);

			When('I set canBlockListings to true', () => {
				permissions.canBlockListings = true;
			});

			Then('canBlockListings should be true', () => {
				expect(permissions.canBlockListings).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canUnblockListings should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleListingPermissions;

			Given(
				'I have admin role listing permissions with canUnblockListings false',
				() => {
					permissions = makeListingPermissionsAllFalse();
				},
			);

			When('I set canUnblockListings to true', () => {
				permissions.canUnblockListings = true;
			});

			Then('canUnblockListings should be true', () => {
				expect(permissions.canUnblockListings).toBe(true);
			});
		},
	);

	Scenario(
		'Setting canModerateListings should update the value',
		({ Given, When, Then }) => {
			let permissions: AdminRoleListingPermissions;

			Given(
				'I have admin role listing permissions with canModerateListings false',
				() => {
					permissions = makeListingPermissionsAllFalse();
				},
			);

			When('I set canModerateListings to true', () => {
				permissions.canModerateListings = true;
			});

			Then('canModerateListings should be true', () => {
				expect(permissions.canModerateListings).toBe(true);
			});
		},
	);
});
