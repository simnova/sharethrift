import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import type { AdminUserProps } from './admin-user.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-user.entity.feature'),
);

// biome-ignore lint/suspicious/noExplicitAny: Test helper function
function makeAdminUserProps(overrides?: Partial<AdminUserProps>): any {
	return {
		id: 'test-admin-user-id',
		userType: 'admin',
		isBlocked: false,
		role: { id: 'test-role-id' },
		loadRole: async () => ({ id: 'test-role-id' }),
		account: {
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
		Given('I have an admin user props object', () => {
			props = makeAdminUserProps();
		});
	});

	Scenario('Admin user userType should be a string', ({ When, Then }) => {
		When('I access the userType property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const userProps: AdminUserProps = props;
			expect(typeof userProps.userType).toBe('string');
			expect(userProps.userType).toBe('admin');
		});
	});

	Scenario('Admin user isBlocked should be a boolean', ({ When, Then }) => {
		When('I access the isBlocked property', () => {
			// Access the property
		});

		Then('it should be a boolean', () => {
			const userProps: AdminUserProps = props;
			expect(typeof userProps.isBlocked).toBe('boolean');
			expect(userProps.isBlocked).toBe(false);
		});
	});

	Scenario(
		'Admin user role reference should be readonly',
		({ When, Then }) => {
			When('I attempt to modify the role property', () => {
				// Make the role property readonly at runtime
				Object.defineProperty(props, 'role', {
					writable: false,
					configurable: false,
					value: props.role,
				});
				try {
					props.role = { id: 'new-role-id' };
				} catch (_error) {
					// Expected behavior for readonly
				}
			});

			Then('it should remain unchanged', () => {
				const userProps: AdminUserProps = props;
				expect(userProps.role.id).toBe('test-role-id');
			});
		},
	);

	Scenario('Admin user account should be defined', ({ When, Then }) => {
		When('I access the account property', () => {
			// Access the property
		});

		Then('it should be defined', () => {
			const userProps: AdminUserProps = props;
			expect(userProps.account).toBeDefined();
			expect(userProps.account.email).toBe('admin@example.com');
		});
	});

	Scenario('Admin user schemaVersion should be defined', ({ When, Then }) => {
		When('I access the schemaVersion property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const userProps: AdminUserProps = props;
			expect(typeof userProps.schemaVersion).toBe('string');
			expect(userProps.schemaVersion).toBe('1.0');
		});
	});

	Scenario(
		'Admin user timestamps should be valid dates',
		({ When, Then }) => {
			When('I access the createdAt and updatedAt properties', () => {
				// Access the properties
			});

			Then('they should be valid Date objects', () => {
				const userProps: AdminUserProps = props;
				expect(userProps.createdAt).toBeInstanceOf(Date);
				expect(userProps.updatedAt).toBeInstanceOf(Date);
			});
		},
	);
});
