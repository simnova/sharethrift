import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserRole } from './personal-user-role.ts';
import type { PersonalUserRoleProps } from './personal-user-role.entity.ts';
import type { Passport } from '../../passport.ts';
import { PersonalUserRolePermissions } from './personal-user-role-permissions.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user-role.feature'),
);

test.for(feature, ({ Background, Scenario }) => {
	let passport: Passport;
	let roleProps: PersonalUserRoleProps;
	let role: PersonalUserRole<PersonalUserRoleProps>;

	Background(({ Given, And }) => {
		Given('a valid Passport with user management permissions', () => {
			passport = {} as Passport;
		});

		And(
			'base personal user role properties with roleName ""Member"", isDefault true, valid timestamps and permissions"',
			() => {
				roleProps = {
					id: 'role1',
					roleName: 'Member',
					isDefault: true,
					roleType: 'personal-user',
					permissions: {},
					createdAt: new Date(),
					updatedAt: new Date(),
					schemaVersion: '1.0',
				} as PersonalUserRoleProps;
			},
		);
	});

	Scenario('Creating a new personal user role instance', ({ When, Then, And }) => {
		When('I create a new PersonalUserRole aggregate using getNewInstance', () => {
			role = PersonalUserRole.getNewInstance(roleProps, passport, 'Member', true);
		});

		Then('the created role should have roleName "Member"', () => {
			expect(role.roleName).toBe('Member');
		});

		And('it should be marked as not new after creation', () => {
			// @ts-expect-error - testing protected property
			expect(role.isNew).toBe(false);
		});

		And('isDefault should be true', () => {
			expect(role.isDefault).toBe(true);
		});

		And('permissions should be properly assigned', () => {
			expect(role.permissions).toBeInstanceOf(PersonalUserRolePermissions);
		});
	});

	Scenario('Updating role name', ({ Given, When, Then }) => {
		Given('an existing PersonalUserRole aggregate', () => {
			role = new PersonalUserRole(roleProps, passport);
		});

		When('I set roleName to "Admin"', () => {
			role.roleName = 'Admin';
		});

		Then('the roleName value object should be updated to "Admin"', () => {
			expect(role.roleName).toBe('Admin');
		});
	});

	Scenario('Getting permissions', ({ Given, When, Then }) => {
		let permissions: PersonalUserRolePermissions;

		Given('a valid PersonalUserRole aggregate', () => {
			role = new PersonalUserRole(roleProps, passport);
		});

		When('I access permissions', () => {
			permissions = role.permissions;
		});

		Then('it should return a PersonalUserRolePermissions instance', () => {
			expect(permissions).toBeInstanceOf(PersonalUserRolePermissions);
		});
	});

	Scenario('Checking readonly properties', ({ Given, Then }) => {
		Given('a valid PersonalUserRole aggregate', () => {
			role = new PersonalUserRole(roleProps, passport);
		});

		Then('schemaVersion, createdAt, and updatedAt should be accessible and valid', () => {
			expect(role.schemaVersion).toBe('1.0');
			expect(role.createdAt).toBeInstanceOf(Date);
			expect(role.updatedAt).toBeInstanceOf(Date);
		});
	});
});
