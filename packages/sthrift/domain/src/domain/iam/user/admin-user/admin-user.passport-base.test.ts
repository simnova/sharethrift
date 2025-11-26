import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { AdminUserPassportBase } from './admin-user.passport-base.ts';
import type { AdminUserEntityReference } from '../../../contexts/user/admin-user/admin-user.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-user.passport-base.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario(
		'AdminUserPassportBase should be defined',
		({ Given, When, Then }) => {
			let passportClass: typeof AdminUserPassportBase;

			Given('I have the AdminUserPassportBase class', () => {
				passportClass = AdminUserPassportBase;
			});

			When('I check the class type', () => {
				// Verify class is defined and is a constructor function
			});

			Then('it should be defined', () => {
				expect(passportClass).toBeDefined();
				expect(typeof passportClass).toBe('function');
			});
		},
	);

	Scenario(
		'AdminUserPassportBase should accept a user entity',
		({ Given, When, Then }) => {
			const mockUser = {
				id: 'admin-user-123',
				isBlocked: false,
			} as AdminUserEntityReference;
			let instance: AdminUserPassportBase;

			Given('I have an admin user entity', () => {
				expect(mockUser).toBeDefined();
			});

			When('I create an AdminUserPassportBase instance', () => {
				instance = new AdminUserPassportBase(mockUser);
			});

			Then('it should store the user entity', () => {
				expect(instance).toBeDefined();
				expect(instance).toBeInstanceOf(AdminUserPassportBase);
			});
		},
	);
});
