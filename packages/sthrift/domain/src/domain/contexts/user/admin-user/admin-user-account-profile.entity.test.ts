import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import type { AdminUserProfileProps } from './admin-user-account-profile.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(
		__dirname,
		'features/admin-user-account-profile.entity.feature',
	),
);

function makeAdminUserProfileProps(
	overrides?: Partial<AdminUserProfileProps>,
// biome-ignore lint/suspicious/noExplicitAny: Test helper function
): any {
	return {
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
		...overrides,
	};
}

test.for(feature, ({ Background, Scenario }) => {
	// biome-ignore lint/suspicious/noExplicitAny: Test variable
	let props: any;

	Background(({ Given }) => {
		Given('I have an admin user account profile props object', () => {
			props = makeAdminUserProfileProps();
		});
	});

	Scenario(
		'Admin user account profile firstName should be a string',
		({ When, Then }) => {
			When('I access the firstName property', () => {
				// Access the property
			});

			Then('it should be a string', () => {
				const profileProps: AdminUserProfileProps = props;
				expect(typeof profileProps.firstName).toBe('string');
				expect(profileProps.firstName).toBe('Admin');
			});
		},
	);

	Scenario(
		'Admin user account profile lastName should be a string',
		({ When, Then }) => {
			When('I access the lastName property', () => {
				// Access the property
			});

			Then('it should be a string', () => {
				const profileProps: AdminUserProfileProps = props;
				expect(typeof profileProps.lastName).toBe('string');
				expect(profileProps.lastName).toBe('User');
			});
		},
	);

	Scenario(
		'Admin user account profile aboutMe should be a string',
		({ When, Then }) => {
			When('I access the aboutMe property', () => {
				// Access the property
			});

			Then('it should be a string', () => {
				const profileProps: AdminUserProfileProps = props;
				expect(typeof profileProps.aboutMe).toBe('string');
				expect(profileProps.aboutMe).toBe('System administrator');
			});
		},
	);

	Scenario(
		'Admin user account profile location should be defined',
		({ When, Then }) => {
			When('I access the location property', () => {
				// Access the property
			});

			Then('it should be defined', () => {
				const profileProps: AdminUserProfileProps = props;
				expect(profileProps.location).toBeDefined();
				expect(profileProps.location.city).toBe('Admin City');
			});
		},
	);
});
