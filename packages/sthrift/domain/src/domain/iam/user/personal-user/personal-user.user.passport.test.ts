import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserUserPassport } from './personal-user.user.passport.ts';
import type { PersonalUserEntityReference } from '../../../contexts/user/personal-user/personal-user.entity.ts';
import type { AdminUserEntityReference } from '../../../contexts/user/admin-user/admin-user.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.user.passport.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Personal user can access personal user entities', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		let passport: PersonalUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have a personal user user passport', () => {
			passport = new PersonalUserUserPassport(mockUser);
		});

		When('I request access to a personal user entity', () => {
			const mockTargetUser = { id: 'user-456', isBlocked: false } as PersonalUserEntityReference;
			visa = passport.forPersonalUser(mockTargetUser);
		});

		Then('visa should be created with permission function', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
		});
	});

	Scenario('Personal user cannot access admin user entities', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		let passport: PersonalUserUserPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;
		let result: boolean;

		Given('I have a personal user user passport', () => {
			passport = new PersonalUserUserPassport(mockUser);
		});

		When('I request access to an admin user entity', () => {
			const mockAdminUser = { id: 'admin-123', isBlocked: false } as AdminUserEntityReference;
			visa = passport.forAdminUser(mockAdminUser);
			result = visa.determineIf(() => true);
		});

		Then('visa should deny all permissions', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(result).toBe(false);
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

		Then('it should be defined and be instance of PersonalUserUserPassport', () => {
			expect(passport).toBeDefined();
			expect(passport).toBeInstanceOf(PersonalUserUserPassport);
		});
	});
});
