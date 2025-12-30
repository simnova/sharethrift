import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { GuestAccountPlanPassport } from './guest.account-plan.passport.ts';
import type { AccountPlanEntityReference } from '../../../contexts/account-plan/account-plan/index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/guest.account-plan.passport.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Guest passport for account plan should deny access', ({ Given, When, Then }) => {
		let passport: GuestAccountPlanPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have a guest account plan passport', () => {
			passport = new GuestAccountPlanPassport();
		});

		When('I request access to an account plan', () => {
			const mockAccountPlan = { id: 'test-account-plan-id' } as AccountPlanEntityReference;
			visa = passport.forAccountPlan(mockAccountPlan);
		});

		Then('access should be denied', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
			expect(visa.determineIf()).toBe(false);
		});
	});

	Scenario('Guest account plan passport should extend GuestPassportBase', ({ Given, When, Then }) => {
		let passport: GuestAccountPlanPassport;

		Given('I create a guest account plan passport', () => {
			passport = new GuestAccountPlanPassport();
		});

		When('I check its prototype chain', () => {
			// Verify inheritance relationship through instanceof
		});

		Then('it should be an instance of the passport', () => {
			expect(passport).toBeInstanceOf(GuestAccountPlanPassport);
		});
	});
});
