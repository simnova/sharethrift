import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserAccountPlanPassport } from './personal-user.account-plan.passport.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';
import type { AccountPlanEntityReference } from '../../../../contexts/account-plan/account-plan/account-plan.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.account-plan.passport.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Personal user can access account plan entities', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123' } as PersonalUserEntityReference;
		let passport: PersonalUserAccountPlanPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have a personal user account plan passport', () => {
			passport = new PersonalUserAccountPlanPassport(mockUser);
		});

		When('I request access to an account plan', () => {
			const mockAccountPlan = { id: 'plan-456' } as AccountPlanEntityReference;
			visa = passport.forAccountPlan(mockAccountPlan);
		});

		Then('visa should be created with permission function', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
		});
	});

	Scenario('Personal user account plan passport is defined', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123' } as PersonalUserEntityReference;
		let passport: PersonalUserAccountPlanPassport;

		Given('I create a personal user account plan passport', () => {
			passport = new PersonalUserAccountPlanPassport(mockUser);
		});

		When('I check the passport', () => {
			// Passport instance is ready for verification
		});

		Then('it should be defined', () => {
			expect(passport).toBeDefined();
			expect(passport).toBeInstanceOf(PersonalUserAccountPlanPassport);
		});
	});
});
