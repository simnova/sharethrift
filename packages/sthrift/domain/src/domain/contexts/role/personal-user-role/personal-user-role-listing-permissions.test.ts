import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import {
	PersonalUserRoleListingPermissions,
	type PersonalUserRoleListingPermissionsProps,
} from './personal-user-role-listing-permissions.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user-role-listing-permissions.feature'),
);

// biome-ignore lint/suspicious/noExplicitAny: Test helper function
function makeListingPermissionsProps(overrides?: Partial<PersonalUserRoleListingPermissionsProps>): any {
	return {
		canCreateItemListing: true,
		canUpdateItemListing: true,
		canDeleteItemListing: false,
		canViewItemListing: true,
		canPublishItemListing: true,
		canUnpublishItemListing: false,
		...overrides,
	};
}

test.for(feature, ({ Background, Scenario }) => {
	// biome-ignore lint/suspicious/noExplicitAny: Test variable
	let props: any;
	let permissions: PersonalUserRoleListingPermissions;

	Background(({ Given }) => {
		Given('I have listing permissions props', () => {
			props = makeListingPermissionsProps();
		});
	});

	Scenario('Listing permissions should have create permission', ({ When, Then }) => {
		When('I create a PersonalUserRoleListingPermissions instance', () => {
			permissions = new PersonalUserRoleListingPermissions(props);
		});

		Then('canCreateItemListing should be a boolean', () => {
			expect(typeof permissions.canCreateItemListing).toBe('boolean');
			expect(permissions.canCreateItemListing).toBe(true);
		});
	});

	Scenario('Listing permissions should have update permission', ({ When, Then }) => {

		When('I create a PersonalUserRoleListingPermissions instance', () => {
			permissions = new PersonalUserRoleListingPermissions(props);
		});

		Then('canUpdateItemListing should be a boolean', () => {
			expect(typeof permissions.canUpdateItemListing).toBe('boolean');
			expect(permissions.canUpdateItemListing).toBe(true);
		});
	});

	Scenario('Listing permissions should have delete permission', ({ When, Then }) => {

		When('I create a PersonalUserRoleListingPermissions instance', () => {
			permissions = new PersonalUserRoleListingPermissions(props);
		});

		Then('canDeleteItemListing should be a boolean', () => {
			expect(typeof permissions.canDeleteItemListing).toBe('boolean');
			expect(permissions.canDeleteItemListing).toBe(false);
		});
	});

	Scenario('Listing permissions should have view permission', ({ When, Then }) => {

		When('I create a PersonalUserRoleListingPermissions instance', () => {
			permissions = new PersonalUserRoleListingPermissions(props);
		});

		Then('canViewItemListing should be a boolean', () => {
			expect(typeof permissions.canViewItemListing).toBe('boolean');
			expect(permissions.canViewItemListing).toBe(true);
		});
	});

	Scenario('Listing permissions should have publish permission', ({ When, Then }) => {

		When('I create a PersonalUserRoleListingPermissions instance', () => {
			permissions = new PersonalUserRoleListingPermissions(props);
		});

		Then('canPublishItemListing should be a boolean', () => {
			expect(typeof permissions.canPublishItemListing).toBe('boolean');
			expect(permissions.canPublishItemListing).toBe(true);
		});
	});

	Scenario('Listing permissions should have unpublish permission', ({ When, Then }) => {

		When('I create a PersonalUserRoleListingPermissions instance', () => {
			permissions = new PersonalUserRoleListingPermissions(props);
		});

		Then('canUnpublishItemListing should be a boolean', () => {
			expect(typeof permissions.canUnpublishItemListing).toBe('boolean');
			expect(permissions.canUnpublishItemListing).toBe(false);
		});
	});

	Scenario('Listing permissions should support setter methods', ({ When, Then }) => {

		When('I create a PersonalUserRoleListingPermissions instance and modify values', () => {
			permissions = new PersonalUserRoleListingPermissions(props);
			permissions.canCreateItemListing = true;
			permissions.canPublishItemListing = false;
		});

		Then('the values should be updated', () => {
			expect(permissions.canCreateItemListing).toBe(true);
			expect(permissions.canPublishItemListing).toBe(false);
		});
	});
});
