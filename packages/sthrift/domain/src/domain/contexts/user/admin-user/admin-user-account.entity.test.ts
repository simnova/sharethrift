import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import type { AdminUserAccountProps } from './admin-user-account.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-user-account.entity.feature'),
);

function makeAdminUserAccountProps(
	overrides?: Partial<AdminUserAccountProps>,
// biome-ignore lint/suspicious/noExplicitAny: Test helper function
): any {
	return {
		accountType: 'admin',
		email: 'admin@example.com',
		username: 'adminuser',
		profile: {
			firstName: 'Admin',
			lastName: 'User',
			aboutMe: 'System administrator',
			location: {
				address1: '123 Admin St',
				address2: null,
				city: 'Admin City',
				state: 'AC',
				country: 'USA',
				zipCode: '12345',
			},
		},
		...overrides,
	};
}

test.for(feature, ({ Background, Scenario }) => {
	// biome-ignore lint/suspicious/noExplicitAny: Test variable
	let props: any;

	Background(({ Given }) => {
		Given('I have an admin user account props object', () => {
			props = makeAdminUserAccountProps();
		});
	});

	Scenario(
		'Admin user account accountType should be a string',
		({ When, Then }) => {
			When('I access the accountType property', () => {
				// Access the property
			});

			Then('it should be a string', () => {
				const accountProps: AdminUserAccountProps = props;
				expect(typeof accountProps.accountType).toBe('string');
				expect(accountProps.accountType).toBe('admin');
			});
		},
	);

	Scenario(
		'Admin user account email should be a string',
		({ When, Then }) => {
			When('I access the email property', () => {
				// Access the property
			});

			Then('it should be a valid email string', () => {
				const accountProps: AdminUserAccountProps = props;
				expect(typeof accountProps.email).toBe('string');
				expect(accountProps.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
			});
		},
	);

	Scenario(
		'Admin user account username should be a string',
		({ When, Then }) => {
			When('I access the username property', () => {
				// Access the property
			});

			Then('it should be a string', () => {
				const accountProps: AdminUserAccountProps = props;
				expect(typeof accountProps.username).toBe('string');
				expect(accountProps.username).toBe('adminuser');
			});
		},
	);

	Scenario(
		'Admin user account profile should be defined',
		({ When, Then }) => {
			When('I access the profile property', () => {
				// Access the property
			});

			Then('it should be defined', () => {
				const accountProps: AdminUserAccountProps = props;
				expect(accountProps.profile).toBeDefined();
				expect(accountProps.profile.firstName).toBe('Admin');
			});
		},
	);
});
