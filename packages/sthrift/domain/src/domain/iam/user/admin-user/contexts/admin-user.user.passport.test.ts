import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { AdminUserUserPassport } from '../admin-user.user.passport.ts';
import type { AdminUserEntityReference } from '../../../../contexts/user/admin-user/admin-user.entity.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-user.user.passport.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario(
		'Admin user can access personal user entities',
		({ Given, When, Then }) => {
			const mockUser = {
				id: 'admin-user-123',
				isBlocked: false,
			} as AdminUserEntityReference;
			let passport: AdminUserUserPassport;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock
			let visa: any;

			Given('I have an admin user user passport', () => {
				passport = new AdminUserUserPassport(mockUser);
			});

			When('I request access to a personal user', () => {
				const mockTargetUser = {
					id: 'personal-user-456',
					isBlocked: false,
				} as PersonalUserEntityReference;
				visa = passport.forPersonalUser(mockTargetUser);
			});

			Then('visa should be created with permission function', () => {
				expect(visa).toBeDefined();
				expect(visa.determineIf).toBeDefined();
				expect(typeof visa.determineIf).toBe('function');
			});
		},
	);

	Scenario(
		'Admin user can access admin user entities',
		({ Given, When, Then }) => {
			const mockUser = {
				id: 'admin-user-123',
				isBlocked: false,
			} as AdminUserEntityReference;
			let passport: AdminUserUserPassport;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock
			let visa: any;

			Given('I have an admin user user passport', () => {
				passport = new AdminUserUserPassport(mockUser);
			});

			When('I request access to an admin user', () => {
				const mockTargetUser = {
					id: 'admin-user-789',
					isBlocked: false,
				} as AdminUserEntityReference;
				visa = passport.forAdminUser(mockTargetUser);
			});

			Then('visa should be created with permission function', () => {
				expect(visa).toBeDefined();
				expect(visa.determineIf).toBeDefined();
				expect(typeof visa.determineIf).toBe('function');
			});
		},
	);

	Scenario('Admin user user passport is defined', ({ Given, When, Then }) => {
		const mockUser = {
			id: 'admin-user-123',
			isBlocked: false,
		} as AdminUserEntityReference;
		let passport: AdminUserUserPassport;

		Given('I create an admin user user passport', () => {
			passport = new AdminUserUserPassport(mockUser);
		});

		When('I check the passport', () => {
			// Passport instance is ready for verification
		});

		Then('it should be defined', () => {
			expect(passport).toBeDefined();
			expect(passport).toBeInstanceOf(AdminUserUserPassport);
		});
	});
});
