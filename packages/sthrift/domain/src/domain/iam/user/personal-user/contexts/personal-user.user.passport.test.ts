import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserUserPassport } from './personal-user.user.passport.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.user.passport.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Personal user can access user entities', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		let passport: PersonalUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have a personal user user passport', () => {
			passport = new PersonalUserUserPassport(mockUser);
		});

		When('I request access to a personal user', () => {
			const mockTargetUser = { id: 'user-456', isBlocked: false } as PersonalUserEntityReference;
			visa = passport.forPersonalUser(mockTargetUser);
		});

		Then('visa should be created with permission function', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
		});
	});

	Scenario('Personal user user passport is defined', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		let passport: PersonalUserUserPassport;

		Given('I create a personal user user passport', () => {
			passport = new PersonalUserUserPassport(mockUser);
		});

		When('I check the passport', () => {
			// Passport instance is ready for verification
		});

		Then('it should be defined', () => {
			expect(passport).toBeDefined();
			expect(passport).toBeInstanceOf(PersonalUserUserPassport);
		});
	});

	Scenario('Personal user cannot access admin user for blocking', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockAdmin = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let passport: PersonalUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let canBlock: boolean;

		Given('I have a personal user user passport', () => {
			passport = new PersonalUserUserPassport(mockUser);
		});

		When('I request access to an admin user', () => {
			visa = passport.forAdminUser(mockAdmin);
			canBlock = visa.determineIf((p: { canBlockUsers: boolean }) => p.canBlockUsers);
		});

		Then('visa should deny all blocking permissions', () => {
			expect(canBlock).toBe(false);
		});
	});

	Scenario('Personal user cannot access admin user for any operations', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockAdmin = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let passport: PersonalUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let results: boolean[];

		Given('I have a personal user user passport', () => {
			passport = new PersonalUserUserPassport(mockUser);
		});

		When('I request access to an admin user', () => {
			visa = passport.forAdminUser(mockAdmin);
			results = [
				visa.determineIf((p: { canBlockUsers: boolean }) => p.canBlockUsers),
				visa.determineIf((p: { canUnblockUsers: boolean }) => p.canUnblockUsers),
				visa.determineIf((p: { canManageUserRoles: boolean }) => p.canManageUserRoles),
				visa.determineIf(() => true), // Even when function returns true
			];
		});

		Then('visa should always return false for any permission check', () => {
			expect(results).toEqual([false, false, false, false]);
		});
	});

	Scenario('PersonalToAdminUserVisa always returns false', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockAdmin = { id: 'admin-456', isBlocked: false } as AdminUserEntityReference;
		let passport: PersonalUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let result: boolean;

		Given('I have a personal user accessing an admin user', () => {
			passport = new PersonalUserUserPassport(mockUser);
			visa = passport.forAdminUser(mockAdmin);
		});

		When('I check for any permission', () => {
			result = visa.determineIf(() => true);
		});

		Then('result should be false', () => {
			expect(result).toBe(false);
		});
	});
});
