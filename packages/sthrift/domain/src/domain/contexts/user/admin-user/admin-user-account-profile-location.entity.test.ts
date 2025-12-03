import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import type { AdminUserAccountProfileLocationProps } from './admin-user-account-profile-location.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(
		__dirname,
		'features/admin-user-account-profile-location.entity.feature',
	),
);

function makeAdminUserLocationProps(
	overrides?: Partial<AdminUserAccountProfileLocationProps>,
// biome-ignore lint/suspicious/noExplicitAny: Test helper function
): any {
	return {
		address1: '123 Admin St',
		address2: null,
		city: 'Admin City',
		state: 'AC',
		country: 'USA',
		zipCode: '12345',
		...overrides,
	};
}

test.for(feature, ({ Background, Scenario }) => {
	// biome-ignore lint/suspicious/noExplicitAny: Test variable
	let props: any;

	Background(({ Given }) => {
		Given('I have an admin user account profile location props object', () => {
			props = makeAdminUserLocationProps();
		});
	});

	Scenario(
		'Admin user account profile location address1 should be a string',
		({ When, Then }) => {
			When('I access the address1 property', () => {
				// Access the property
			});

			Then('it should be a string', () => {
				const locationProps: AdminUserAccountProfileLocationProps = props;
				expect(typeof locationProps.address1).toBe('string');
				expect(locationProps.address1).toBe('123 Admin St');
			});
		},
	);

	Scenario(
		'Admin user account profile location address2 should be nullable string',
		({ When, Then }) => {
			When('I access the address2 property', () => {
				// Access the property
			});

			Then('it should be a string or null', () => {
				const locationProps: AdminUserAccountProfileLocationProps = props;
				expect(
					typeof locationProps.address2 === 'string' ||
						locationProps.address2 === null,
				).toBe(true);
			});
		},
	);

	Scenario(
		'Admin user account profile location city should be a string',
		({ When, Then }) => {
			When('I access the city property', () => {
				// Access the property
			});

			Then('it should be a string', () => {
				const locationProps: AdminUserAccountProfileLocationProps = props;
				expect(typeof locationProps.city).toBe('string');
				expect(locationProps.city).toBe('Admin City');
			});
		},
	);

	Scenario(
		'Admin user account profile location state should be a string',
		({ When, Then }) => {
			When('I access the state property', () => {
				// Access the property
			});

			Then('it should be a string', () => {
				const locationProps: AdminUserAccountProfileLocationProps = props;
				expect(typeof locationProps.state).toBe('string');
				expect(locationProps.state).toBe('AC');
			});
		},
	);

	Scenario(
		'Admin user account profile location country should be a string',
		({ When, Then }) => {
			When('I access the country property', () => {
				// Access the property
			});

			Then('it should be a string', () => {
				const locationProps: AdminUserAccountProfileLocationProps = props;
				expect(typeof locationProps.country).toBe('string');
				expect(locationProps.country).toBe('USA');
			});
		},
	);

	Scenario(
		'Admin user account profile location zipCode should be a string',
		({ When, Then }) => {
			When('I access the zipCode property', () => {
				// Access the property
			});

			Then('it should be a string', () => {
				const locationProps: AdminUserAccountProfileLocationProps = props;
				expect(typeof locationProps.zipCode).toBe('string');
				expect(locationProps.zipCode).toBe('12345');
			});
		},
	);
});
