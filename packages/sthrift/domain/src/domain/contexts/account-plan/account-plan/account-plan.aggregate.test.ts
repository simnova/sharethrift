import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import { AccountPlan } from './account-plan.aggregate.ts';
import type { AccountPlanProps } from './account-plan.entity.ts';
import type { Passport } from '../../passport.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/account-plan.aggregate.feature'),
);

function makePassport(
	permissions: Partial<{
		canCreateAccountPlan: boolean;
		canUpdateAccountPlan: boolean;
	}> = {},
) {
	return vi.mocked({
		accountPlan: {
			forAccountPlan: vi.fn(() => ({
				determineIf: (
					fn: (p: {
						canCreateAccountPlan: boolean;
						canUpdateAccountPlan: boolean;
					}) => boolean,
				) =>
					fn({
						canCreateAccountPlan: permissions.canCreateAccountPlan ?? true,
						canUpdateAccountPlan: permissions.canUpdateAccountPlan ?? true,
					}),
			})),
		},
	} as unknown as Passport);
}

function makeBaseProps(
	overrides: Partial<AccountPlanProps> = {},
): AccountPlanProps {
	return {
		id: 'plan-1',
		name: 'Pro',
		description: 'Pro plan',
		billingPeriodLength: 12,
		billingPeriodUnit: 'M',
		billingCycles: 1,
		billingAmount: 100,
		currency: 'USD',
		setupFee: 10,
		status: 'ACTIVE',
		cybersourcePlanId: 'cs-123',
		schemaVersion: '1.0.0',
		createdAt: new Date(),
		updatedAt: new Date(),
		feature: {
			activeReservations: 1,
			bookmarks: 2,
			itemsToShare: 3,
			friends: 4,
		},
		...overrides,
	};
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let passport: Passport;
	let baseProps: AccountPlanProps;
	let plan: AccountPlan<AccountPlanProps>;
	let newPlan: AccountPlan<AccountPlanProps>;

	BeforeEachScenario(() => {
		passport = makePassport();
		baseProps = makeBaseProps();
		plan = new AccountPlan(baseProps, passport);
		newPlan = undefined as unknown as AccountPlan<AccountPlanProps>;
	});

	Background(({ Given, And }) => {
		Given('a valid Passport with account plan permissions', () => {
			passport = makePassport();
		});
		And('base account plan properties', () => {
			baseProps = makeBaseProps();
			plan = new AccountPlan(baseProps, passport);
		});
	});

	Scenario('Creating a new account plan instance', ({ When, Then, And }) => {
		When('I create a new AccountPlan aggregate using getNewInstance', () => {
			newPlan = AccountPlan.getNewInstance(makeBaseProps(), passport, {
				name: 'Pro',
				description: 'Pro plan',
				billingPeriodLength: 12,
				billingPeriodUnit: 'M',
				billingCycles: 1,
				billingAmount: 100,
				currency: 'USD',
				setupFee: 10,
				feature: {
					activeReservations: 1,
					bookmarks: 2,
					itemsToShare: 3,
					friends: 4,
				},
			});
		});
		Then('it should have correct name "Pro"', () => {
			expect(newPlan.name).toBe('Pro');
		});
		And('description should be "Pro plan"', () => {
			expect(newPlan.description).toBe('Pro plan');
		});
		// isNew is private; skip direct assertion or test via public API if available
		And('it should expose a valid feature object', () => {
			expect(newPlan.feature).toBeDefined();
			expect(newPlan.feature.activeReservations).toBe(1);
		});
	});

	Scenario('Updating name with valid permission', ({ When, Then }) => {
		When('I set name to "Basic"', () => {
			plan.name = 'Basic';
		});
		Then('name should update successfully', () => {
			expect(plan.name).toBe('Basic');
		});
	});

	Scenario(
		'Updating name without permission throws',
		({ Given, When, Then }) => {
			Given('a plan with no update permission', () => {
				passport = makePassport({
					canCreateAccountPlan: false,
					canUpdateAccountPlan: false,
				});
				plan = new AccountPlan(makeBaseProps(), passport);
			});
			When('I attempt to set name', () => {
				// do nothing here, test in Then
			});
			Then('it should throw a PermissionError', () => {
				expect(() => {
					plan.name = 'Basic';
				}).toThrowError();
			});
		},
	);

	Scenario('Updating feature properties', ({ When, Then }) => {
		When('I set feature.activeReservations to 10', () => {
			plan.feature.activeReservations = 10;
		});
		Then('feature.activeReservations should be 10', () => {
			expect(plan.feature.activeReservations).toBe(10);
		});
	});

	Scenario('Getting all properties', ({ Then }) => {
		Then('all properties should return correct values', () => {
			expect(plan.name).toBe('Pro');
			expect(plan.description).toBe('Pro plan');
			expect(plan.billingPeriodLength).toBe(12);
			expect(plan.billingPeriodUnit).toBe('M');
			expect(plan.billingCycles).toBe(1);
			expect(plan.billingAmount).toBe(100);
			expect(plan.currency).toBe('USD');
			expect(plan.setupFee).toBe(10);
			expect(plan.status).toBe('ACTIVE');
			expect(plan.cybersourcePlanId).toBe('cs-123');
			expect(plan.schemaVersion).toBe('1.0.0');
			expect(plan.createdAt).toBeInstanceOf(Date);
			expect(plan.updatedAt).toBeInstanceOf(Date);
			expect(plan.feature.activeReservations).toBe(1);
			expect(plan.feature.bookmarks).toBe(2);
			expect(plan.feature.itemsToShare).toBe(3);
			expect(plan.feature.friends).toBe(4);
		});
	});

	Scenario('Updating status with valid permission', ({ When, Then }) => {
		When('I set status to "INACTIVE"', () => {
			plan.status = 'INACTIVE';
		});
		Then('status should be "INACTIVE"', () => {
			expect(plan.status).toBe('INACTIVE');
		});
	});

	Scenario(
		'Updating cybersourcePlanId with valid permission',
		({ When, Then }) => {
			When('I set cybersourcePlanId to "new-cs-456"', () => {
				plan.cybersourcePlanId = 'new-cs-456';
			});
			Then('cybersourcePlanId should be "new-cs-456"', () => {
				expect(plan.cybersourcePlanId).toBe('new-cs-456');
			});
		},
	);
});
