import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserAccountPlanVisa } from './personal-user.account-plan.visa.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';
import type { AccountPlanEntityReference } from '../../../../contexts/account-plan/account-plan/account-plan.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.account-plan.visa.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Account plan visa is created properly', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123' } as PersonalUserEntityReference;
		const mockRoot = { id: 'plan-123' } as AccountPlanEntityReference;
		let visa: PersonalUserAccountPlanVisa<AccountPlanEntityReference>;

		Given('I create an account plan visa with user and root', () => {
			visa = new PersonalUserAccountPlanVisa(mockRoot, mockUser);
		});

		When('I check the visa instance', () => {
			// Visa instance is ready for verification
		});

		Then('it should have determineIf function', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
		});
	});

	Scenario('Account plan visa determines permissions correctly', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123' } as PersonalUserEntityReference;
		const mockRoot = { id: 'plan-123' } as AccountPlanEntityReference;
		let visa: PersonalUserAccountPlanVisa<AccountPlanEntityReference>;
		let result: boolean;

		Given('I create an account plan visa', () => {
			visa = new PersonalUserAccountPlanVisa(mockRoot, mockUser);
		});

		When('I check canCreateAccountPlan permission', () => {
			result = visa.determineIf((p) => p.canCreateAccountPlan);
		});

		Then('it should return false', () => {
			expect(result).toBe(false);
		});
	});

	Scenario('Account plan visa checks canUpdateAccountPlan permission', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123' } as PersonalUserEntityReference;
		const mockRoot = { id: 'plan-123' } as AccountPlanEntityReference;
		let visa: PersonalUserAccountPlanVisa<AccountPlanEntityReference>;
		let result: boolean;

		Given('I create an account plan visa', () => {
			visa = new PersonalUserAccountPlanVisa(mockRoot, mockUser);
		});

		When('I check canUpdateAccountPlan permission', () => {
			result = visa.determineIf((p) => p.canUpdateAccountPlan);
		});

		Then('it should return false', () => {
			expect(result).toBe(false);
		});
	});

	Scenario('Account plan visa checks canDeleteAccountPlan permission', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123' } as PersonalUserEntityReference;
		const mockRoot = { id: 'plan-123' } as AccountPlanEntityReference;
		let visa: PersonalUserAccountPlanVisa<AccountPlanEntityReference>;
		let result: boolean;

		Given('I create an account plan visa', () => {
			visa = new PersonalUserAccountPlanVisa(mockRoot, mockUser);
		});

		When('I check canDeleteAccountPlan permission', () => {
			result = visa.determineIf((p) => p.canDeleteAccountPlan);
		});

		Then('it should return false', () => {
			expect(result).toBe(false);
		});
	});
});
