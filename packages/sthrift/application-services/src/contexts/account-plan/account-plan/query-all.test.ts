import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { queryAll, type AccountPlanQueryAllCommand } from './query-all.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/query-all.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: AccountPlanQueryAllCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;
	const mockAccountPlans = [
		{
			id: 'plan-1',
			name: 'Basic Plan',
			description: 'Basic subscription',
			billingAmount: 4.99,
		},
		{
			id: 'plan-2',
			name: 'Premium Plan',
			description: 'Premium subscription',
			billingAmount: 9.99,
		},
	];

	BeforeEachScenario(() => {
		mockDataSources = {
			readonlyDataSource: {
				AccountPlan: {
					AccountPlan: {
						AccountPlanReadRepo: {
							getAll: vi.fn().mockResolvedValue(mockAccountPlans),
						},
					},
				},
			},
			// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = {};
		result = undefined;
	});

	Scenario('Retrieving all account plans', ({ Given, When, Then }) => {
		Given('account plans exist in the system', () => {
			// Mock already set up in BeforeEachScenario
		});

		When('the queryAll command is executed', async () => {
			const queryFn = queryAll(mockDataSources);
			result = await queryFn(command);
		});

		Then('all account plans should be returned', () => {
			expect(result).toBeDefined();
			expect(result).toHaveLength(2);
			expect(result[0].name).toBe('Basic Plan');
			expect(result[1].name).toBe('Premium Plan');
		});
	});

	Scenario(
		'Retrieving account plans with specific fields',
		({ Given, When, Then }) => {
			Given('account plans exist in the system', () => {
				// Mock already set up
			});

			When('the queryAll command is executed with specific fields', async () => {
				command = { fields: ['id', 'name'] };
				const queryFn = queryAll(mockDataSources);
				result = await queryFn(command);
			});

			Then(
				'account plans with only those fields should be returned',
				() => {
					expect(result).toBeDefined();
					expect(result).toHaveLength(2);
				},
			);
		},
	);

	Scenario(
		'Retrieving all account plans when none exist',
		({ Given, When, Then }) => {
			Given('no account plans exist in the system', () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).AccountPlan.AccountPlan.AccountPlanReadRepo.getAll.mockResolvedValue(
					[],
				);
			});

			When('the queryAll command is executed', async () => {
				const queryFn = queryAll(mockDataSources);
				result = await queryFn(command);
			});

			Then('an empty array should be returned', () => {
				expect(result).toBeDefined();
				expect(result).toHaveLength(0);
			});
		},
	);
});
