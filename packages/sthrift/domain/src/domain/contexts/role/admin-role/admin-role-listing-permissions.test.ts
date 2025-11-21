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
});
