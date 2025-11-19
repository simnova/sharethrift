import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import type { PersonalUserRoleProps } from './personal-user-role.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user-role.entity.feature'),
);

// biome-ignore lint/suspicious/noExplicitAny: Test helper function
function makePersonalUserRoleProps(overrides?: Partial<PersonalUserRoleProps>): any {
	return {
		id: 'test-role-id',
		roleName: 'Test Role',
		isDefault: false,
		permissions: {
			listingPermissions: {},
			conversationPermissions: {},
			reservationRequestPermissions: {},
		},
		roleType: 'custom',
		createdAt: new Date(),
		updatedAt: new Date(),
		schemaVersion: '1.0',
		...overrides,
	};
}

test.for(feature, ({ Background, Scenario }) => {
	// biome-ignore lint/suspicious/noExplicitAny: Test variable
	let props: any;

	Background(({ Given }) => {
		Given('I have a personal user role props object', () => {
			props = makePersonalUserRoleProps();
		});
	});

	Scenario('Personal user role name should be a string', ({ When, Then }) => {
		When('I access the roleName property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const roleProps: PersonalUserRoleProps = props;
			expect(typeof roleProps.roleName).toBe('string');
			expect(roleProps.roleName).toBe('Test Role');
		});
	});

	Scenario('Personal user role isDefault should be a boolean', ({ When, Then }) => {

		When('I access the isDefault property', () => {
			// Access the property
		});

		Then('it should be a boolean', () => {
			const roleProps: PersonalUserRoleProps = props;
			expect(typeof roleProps.isDefault).toBe('boolean');
			expect(roleProps.isDefault).toBe(false);
		});
	});

	Scenario('Personal user role permissions should be an object', ({ When, Then }) => {

		When('I access the permissions property', () => {
			// Access the property
		});

		Then('it should be an object with nested permission objects', () => {
			const roleProps: PersonalUserRoleProps = props;
			expect(typeof roleProps.permissions).toBe('object');
			expect(roleProps.permissions).toHaveProperty('listingPermissions');
			expect(roleProps.permissions).toHaveProperty('conversationPermissions');
			expect(roleProps.permissions).toHaveProperty('reservationRequestPermissions');
		});
	});

	Scenario('Personal user role roleType should be readonly', ({ When, Then }) => {

		When('I access the roleType property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const roleProps: PersonalUserRoleProps = props;
			expect(typeof roleProps.roleType).toBe('string');
			expect(roleProps.roleType).toBe('custom');
		});
	});

	Scenario('Personal user role createdAt should be readonly', ({ When, Then }) => {

		When('I access the createdAt property', () => {
			// Access the property
		});

		Then('it should be a Date object', () => {
			const roleProps: PersonalUserRoleProps = props;
			expect(roleProps.createdAt).toBeInstanceOf(Date);
		});
	});

	Scenario('Personal user role updatedAt should be readonly', ({ When, Then }) => {

		When('I access the updatedAt property', () => {
			// Access the property
		});

		Then('it should be a Date object', () => {
			const roleProps: PersonalUserRoleProps = props;
			expect(roleProps.updatedAt).toBeInstanceOf(Date);
		});
	});

	Scenario('Personal user role schemaVersion should be readonly', ({ When, Then }) => {

		When('I access the schemaVersion property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const roleProps: PersonalUserRoleProps = props;
			expect(typeof roleProps.schemaVersion).toBe('string');
			expect(roleProps.schemaVersion).toBe('1.0');
		});
	});
});
