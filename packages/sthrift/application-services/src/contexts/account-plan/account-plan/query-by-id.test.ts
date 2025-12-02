import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { queryById, type AccountPlanQueryByIdCommand } from './query-by-id.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/query-by-id.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: AccountPlanQueryByIdCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;
	const mockAccountPlan = {
		id: 'plan-123',
		name: 'Premium Plan',
		description: 'Premium subscription',
		billingAmount: 9.99,
	};

	BeforeEachScenario(() => {
		mockDataSources = {
			readonlyDataSource: {
				AccountPlan: {
					AccountPlan: {
						AccountPlanReadRepo: {
							getById: vi.fn().mockResolvedValue(mockAccountPlan),
						},
					},
				},
			},
			// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = { accountPlanId: 'plan-123' };
		result = undefined;
	});

	Scenario(
		'Retrieving an existing account plan by ID',
		({ Given, When, Then }) => {
			Given('an account plan exists with ID "plan-123"', () => {
				// Mock already set up
			});

			When('the queryById command is executed with ID "plan-123"', async () => {
				command = { accountPlanId: 'plan-123' };
				const queryFn = queryById(mockDataSources);
				result = await queryFn(command);
			});

			Then('the account plan should be returned', () => {
				expect(result).toBeDefined();
				expect(result.id).toBe('plan-123');
				expect(result.name).toBe('Premium Plan');
			});
		},
	);

	Scenario(
		'Retrieving account plan by ID with specific fields',
		({ Given, When, Then }) => {
			Given('an account plan exists with ID "plan-456"', () => {
				const planWithSpecificFields = {
					id: 'plan-456',
					name: 'Basic Plan',
				};
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).AccountPlan.AccountPlan.AccountPlanReadRepo.getById.mockResolvedValue(
					planWithSpecificFields,
				);
			});

			When(
				'the queryById command is executed with specific fields',
				async () => {
					command = { accountPlanId: 'plan-456', fields: ['id', 'name'] };
					const queryFn = queryById(mockDataSources);
					result = await queryFn(command);
				},
			);

			Then(
				'the account plan with only those fields should be returned',
				() => {
					expect(result).toBeDefined();
					expect(result.id).toBe('plan-456');
				},
			);
		},
	);

	Scenario(
		'Retrieving a non-existent account plan by ID',
		({ Given, When, Then }) => {
			Given('no account plan exists with ID "non-existent"', () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).AccountPlan.AccountPlan.AccountPlanReadRepo.getById.mockResolvedValue(
					null,
				);
			});

			When(
				'the queryById command is executed with ID "non-existent"',
				async () => {
					command = { accountPlanId: 'non-existent' };
					const queryFn = queryById(mockDataSources);
					result = await queryFn(command);
				},
			);

			Then('null should be returned', () => {
				expect(result).toBeNull();
			});
		},
	);
});
