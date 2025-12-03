import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';
import { expect, vi } from 'vitest';
import { getAccountPlanUnitOfWork } from './account-plan.uow.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/account-plan.uow.feature'),
);

function makePassport(): Domain.Passport {
	return vi.mocked({
		accountPlan: {
			forAccountPlan: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
	} as unknown as Domain.Passport);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let accountPlanModel: Models.AccountPlan.AccountPlanModelType;
	let passport: Domain.Passport;
	let result: unknown;

	BeforeEachScenario(() => {
		passport = makePassport();
		accountPlanModel = {
			findOne: vi.fn(),
			find: vi.fn(),
			create: vi.fn(),
			findById: vi.fn(),
		} as unknown as Models.AccountPlan.AccountPlanModelType;
		result = undefined;
	});

	Background(({ Given, And }) => {
		Given('a Mongoose context factory with a working service', () => {
			// Mock service is set up
		});
		And('a valid AccountPlan model from the models context', () => {
			// Model is set up in BeforeEachScenario
		});
		And('a valid passport for domain operations', () => {
			passport = makePassport();
		});
	});

	Scenario('Creating an AccountPlan Unit of Work', ({ When, Then, And }) => {
		When(
			'I call getAccountPlanUnitOfWork with the AccountPlan model and passport',
			() => {
				result = getAccountPlanUnitOfWork(accountPlanModel, passport);
			},
		);
		Then(
			'I should receive a properly initialized AccountPlanUnitOfWork',
			() => {
				expect(result).toBeDefined();
				expect(result).toHaveProperty('withTransaction');
				expect(result).toHaveProperty('withScopedTransaction');
				expect(result).toHaveProperty('withScopedTransactionById');
			},
		);
		And('the Unit of Work should have the correct methods', () => {
			expect(
				typeof (result as { withTransaction: unknown }).withTransaction,
			).toBe('function');
			expect(
				typeof (result as { withScopedTransaction: unknown })
					.withScopedTransaction,
			).toBe('function');
			expect(
				typeof (result as { withScopedTransactionById: unknown })
					.withScopedTransactionById,
			).toBe('function');
		});
	});
});
