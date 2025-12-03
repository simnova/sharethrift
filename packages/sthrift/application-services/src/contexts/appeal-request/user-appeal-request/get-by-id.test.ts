import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { type GetUserAppealRequestByIdCommand, getById } from './get-by-id.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/get-by-id.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockReadRepo: any;
	let command: GetUserAppealRequestByIdCommand;
	let result:
		| Domain.Contexts.AppealRequest.UserAppealRequest.UserAppealRequestEntityReference
		| null
		| undefined;

	BeforeEachScenario(() => {
		mockReadRepo = {
			getById: vi.fn(),
		};

		mockDataSources = {
			readonlyDataSource: {
				AppealRequest: {
					UserAppealRequest: {
						UserAppealRequestReadRepo: mockReadRepo,
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		result = undefined;
	});

	Scenario(
		'Successfully retrieving a user appeal request by ID',
		({ Given, When, Then, And }) => {
			Given('a valid user appeal request ID "appeal-123"', () => {
				command = { id: 'appeal-123' };

				const mockAppealRequest = {
					id: 'appeal-123',
					user: { id: 'user-123' },
					state: 'requested',
				};

				mockReadRepo.getById.mockResolvedValue(mockAppealRequest);
			});

			When('the getById command is executed', async () => {
				try {
					const getByIdFn = getById(mockDataSources);
					result = await getByIdFn(command);
				} catch (_err) {
					// No error expected in this scenario
				}
			});

			Then('the user appeal request should be returned', () => {
				expect(result).toBeDefined();
				expect(result).not.toBeNull();
			});

			And('the returned appeal request should have ID "appeal-123"', () => {
				expect(result?.id).toBe('appeal-123');
			});
		},
	);

	Scenario(
		'Handling non-existent user appeal request ID',
		({ Given, When, Then }) => {
			Given('a non-existent user appeal request ID "invalid-id"', () => {
				command = { id: 'invalid-id' };
				mockReadRepo.getById.mockResolvedValue(null);
			});

			When('the getById command is executed', async () => {
				try {
					const getByIdFn = getById(mockDataSources);
					result = await getByIdFn(command);
				} catch (_err) {
					// No error expected in this scenario
				}
			});

			Then('null should be returned', () => {
				expect(result).toBeNull();
			});
		},
	);
});
