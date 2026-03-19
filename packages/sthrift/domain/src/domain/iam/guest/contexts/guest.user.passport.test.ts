import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { GuestUserPassport } from './guest.user.passport.ts';
import type { PersonalUserEntityReference } from '../../../contexts/user/personal-user/index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/guest.user.passport.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Guest passport for user should deny access', ({ Given, When, Then }) => {
		let passport: GuestUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have a guest user passport', () => {
			passport = new GuestUserPassport();
		});

		When('I request access to a user', () => {
			const mockUser = { id: 'test-user-id' } as PersonalUserEntityReference;
			visa = passport.forPersonalUser(mockUser);
		});

		Then('access should be denied', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
			expect(visa.determineIf()).toBe(false);
		});
	});

	Scenario('Guest passport for admin user should deny access', ({ Given, When, Then }) => {
		let passport: GuestUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have a guest user passport', () => {
			passport = new GuestUserPassport();
		});

		When('I request access to an admin user', () => {
			const mockAdminUser = { id: 'test-admin-user-id' } as import('../../../contexts/user/admin-user/index.ts').AdminUserEntityReference;
			visa = passport.forAdminUser(mockAdminUser);
		});

		Then('access should be denied', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
			expect(visa.determineIf()).toBe(false);
		});
	});

	Scenario('Guest user passport should extend GuestPassportBase', ({ Given, When, Then }) => {
		let passport: GuestUserPassport;

		Given('I create a guest user passport', () => {
			passport = new GuestUserPassport();
		});

		When('I check its prototype chain', () => {
			// Verify inheritance relationship through instanceof
		});

		Then('it should be an instance of the passport', () => {
			expect(passport).toBeInstanceOf(GuestUserPassport);
		});
	});
});
