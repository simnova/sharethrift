import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	queryByName,
	type AccountPlanQueryByNameCommand,
} from './query-by-name.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/query-by-name.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: AccountPlanQueryByNameCommand;
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
							getByName: vi.fn().mockResolvedValue(mockAccountPlan),
						},
					},
				},
			},
			// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = { planName: 'Premium Plan' };
		result = undefined;
	});

	Scenario(
		'Retrieving an existing account plan by name',
		({ Given, When, Then }) => {
			Given('an account plan exists with name "Premium Plan"', () => {
				// Mock already set up
			});

			When(
				'the queryByName command is executed with name "Premium Plan"',
				async () => {
					command = { planName: 'Premium Plan' };
					const queryFn = queryByName(mockDataSources);
					result = await queryFn(command);
				},
			);

			Then('the account plan should be returned', () => {
				expect(result).toBeDefined();
				expect(result.name).toBe('Premium Plan');
			});
		},
	);

	Scenario(
		'Retrieving a non-existent account plan by name',
		({ Given, When, Then }) => {
			Given('no account plan exists with name "Non-Existent Plan"', () => {
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).AccountPlan.AccountPlan.AccountPlanReadRepo.getByName.mockResolvedValue(
					null,
				);
			});

			When(
				'the queryByName command is executed with name "Non-Existent Plan"',
				async () => {
					command = { planName: 'Non-Existent Plan' };
					const queryFn = queryByName(mockDataSources);
					result = await queryFn(command);
				},
			);

			Then('null should be returned', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario(
		'Retrieving account plan by exact name match',
		({ Given, When, Then }) => {
			Given('an account plan exists with name "Basic Plan"', () => {
				const basicPlan = {
					id: 'plan-basic',
					name: 'Basic Plan',
					description: 'Basic subscription',
					billingAmount: 4.99,
				};
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).AccountPlan.AccountPlan.AccountPlanReadRepo.getByName.mockResolvedValue(
					basicPlan,
				);
			});

			When(
				'the queryByName command is executed with name "Basic Plan"',
				async () => {
					command = { planName: 'Basic Plan' };
					const queryFn = queryByName(mockDataSources);
					result = await queryFn(command);
				},
			);

			Then('the correct account plan should be returned', () => {
				expect(result).toBeDefined();
				expect(result.name).toBe('Basic Plan');
				expect(result.id).toBe('plan-basic');
			});
		},
	);
});
