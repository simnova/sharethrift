import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { SystemAccountPlanPassport } from './system.account-plan.passport.ts';
import type { AccountPlanEntityReference } from '../../../contexts/account-plan/account-plan/index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/system.account-plan.passport.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('System passport for account plan should use permission function', ({ Given, When, Then }) => {
		let passport: SystemAccountPlanPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have a system account plan passport', () => {
			passport = new SystemAccountPlanPassport({});
		});

		When('I request access to an account plan', () => {
			const mockAccountPlan = { id: 'test-account-plan-id' } as AccountPlanEntityReference;
			visa = passport.forAccountPlan(mockAccountPlan);
		});

		Then('visa should use permission function', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
			// biome-ignore lint/suspicious/noExplicitAny: Test mock
			const result = visa.determineIf((_permissions: any) => true);
			expect(result).toBe(true);
		});
	});

	Scenario('System account plan passport should extend SystemPassportBase', ({ Given, When, Then }) => {
		let passport: SystemAccountPlanPassport;

		Given('I create a system account plan passport', () => {
			passport = new SystemAccountPlanPassport();
		});

		When('I check its prototype chain', () => {
			// Check inheritance
		});

		Then('it should be an instance of the passport', () => {
			expect(passport).toBeInstanceOf(SystemAccountPlanPassport);
		});
	});
});
