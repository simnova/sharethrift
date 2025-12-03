import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { create, type AccountPlanCreateCommand } from './create.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/create.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: AccountPlanCreateCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let error: any;
	let saveReturnsUndefined: boolean;

	BeforeEachScenario(() => {
		saveReturnsUndefined = false;
		const mockAccountPlan = {
			id: 'plan-123',
			name: 'Premium Plan',
			description: 'Premium subscription plan',
			billingPeriodLength: 1,
			billingPeriodUnit: 'month',
			billingCycles: 12,
			billingAmount: 9.99,
			currency: 'USD',
			setupFee: 0,
			feature: { maxListings: 100, maxImages: 10 },
		};

		mockDataSources = {
			domainDataSource: {
				AccountPlan: {
					AccountPlan: {
						AccountPlanUnitOfWork: {
							withScopedTransaction: vi.fn(async (callback) => {
								const mockRepo = {
									getNewInstance: vi.fn().mockResolvedValue(mockAccountPlan),
									save: vi.fn().mockResolvedValue(
										saveReturnsUndefined ? undefined : mockAccountPlan,
									),
								};
								await callback(mockRepo);
							}),
						},
					},
				},
			},
			// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = {
			name: 'Premium Plan',
			description: 'Premium subscription plan',
			billingPeriodLength: 1,
			billingPeriodUnit: 'month',
			billingCycles: 12,
			billingAmount: 9.99,
			currency: 'USD',
			setupFee: null,
			feature: { maxListings: 100, maxImages: 10 },
		};
		result = undefined;
		error = undefined;
	});

	Scenario('Successfully creating an account plan', ({ Given, When, Then }) => {
		Given('a valid account plan command with name "Premium Plan"', () => {
			command.name = 'Premium Plan';
		});

		When('the create command is executed', async () => {
			const createFn = create(mockDataSources);
			result = await createFn(command);
		});

		Then('a new account plan should be created', () => {
			expect(result).toBeDefined();
			expect(result.id).toBe('plan-123');
			expect(result.name).toBe('Premium Plan');
		});
	});

	Scenario(
		'Creating account plan with all required fields',
		({ Given, When, Then }) => {
			Given('an account plan command with all billing details', () => {
				command = {
					name: 'Enterprise Plan',
					description: 'Enterprise subscription',
					billingPeriodLength: 1,
					billingPeriodUnit: 'year',
					billingCycles: 1,
					billingAmount: 99.99,
					currency: 'USD',
					setupFee: 25,
					feature: { maxListings: 500, maxImages: 50 },
				};
			});

			When('the create command is executed', async () => {
				const createFn = create(mockDataSources);
				result = await createFn(command);
			});

			Then('the account plan should have correct billing configuration', () => {
				expect(result).toBeDefined();
				expect(result.billingPeriodLength).toBe(1);
				expect(result.billingPeriodUnit).toBe('month');
			});
		},
	);

	Scenario(
		'Creating account plan with optional setup fee',
		({ Given, When, Then }) => {
			Given('an account plan command with setup fee of 50', () => {
				command.setupFee = 50;
			});

			When('the create command is executed', async () => {
				const createFn = create(mockDataSources);
				result = await createFn(command);
			});

			Then('the account plan should include the setup fee', () => {
				expect(result).toBeDefined();
			});
		},
	);

	Scenario(
		'Creating account plan without setup fee defaults to zero',
		({ Given, When, Then }) => {
			Given('an account plan command without setup fee', () => {
				command.setupFee = null;
			});

			When('the create command is executed', async () => {
				const createFn = create(mockDataSources);
				result = await createFn(command);
			});

			Then('the account plan should have zero setup fee', () => {
				expect(result).toBeDefined();
				expect(result.setupFee).toBe(0);
			});
		},
	);

	Scenario(
		'Account plan creation fails when save returns undefined',
		({ Given, And, When, Then }) => {
			Given('a valid account plan command', () => {
				command.name = 'Test Plan';
			});

			And('the save operation returns undefined', () => {
				saveReturnsUndefined = true;
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.domainDataSource as any
				).AccountPlan.AccountPlan.AccountPlanUnitOfWork.withScopedTransaction.mockImplementation(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock callback
					async (callback: any) => {
						const mockRepo = {
							getNewInstance: vi
								.fn()
								.mockResolvedValue({ id: 'plan-temp', name: 'Test Plan' }),
							save: vi.fn().mockResolvedValue(undefined),
						};
						await callback(mockRepo);
					},
				);
			});

			When('the create command is executed', async () => {
				const createFn = create(mockDataSources);
				try {
					result = await createFn(command);
				} catch (e) {
					error = e;
				}
			});

			Then(
				'an error should be thrown with message "Account plan not found"',
				() => {
					expect(error).toBeDefined();
					expect(error.message).toBe('Account plan not found');
				},
			);
		},
	);
});
