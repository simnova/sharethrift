import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { type GetAllUserAppealRequestsCommand, getAll } from './get-all.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/get-all.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockReadRepo: any;
	let command: GetAllUserAppealRequestsCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockReadRepo = {
			getAll: vi.fn(),
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
		'Retrieving paginated user appeal requests',
		({ Given, When, Then, And }) => {
			Given('a page number of 1 and page size of 10', () => {
				command = {
					page: 1,
					pageSize: 10,
				};

				const mockAppealRequests = [
					{ id: 'appeal-1', user: { id: 'user-1' }, state: 'requested' },
					{ id: 'appeal-2', user: { id: 'user-2' }, state: 'accepted' },
				];

				mockReadRepo.getAll.mockResolvedValue({
					items: mockAppealRequests,
					total: 2,
					page: 1,
					pageSize: 10,
				});
			});

			When('the getAll command is executed', async () => {
				try {
					const getAllFn = getAll(mockDataSources);
					result = await getAllFn(command);
				} catch (_err) {
					// No error expected in this scenario
				}
			});

			Then('it should return a paginated result with items array', () => {
				expect(result).toBeDefined();
				expect(result.items).toBeInstanceOf(Array);
				expect(result.items.length).toBe(2);
			});

			And('the result should contain total count, page, and pageSize', () => {
				expect(result.total).toBe(2);
				expect(result.page).toBe(1);
				expect(result.pageSize).toBe(10);
			});
		},
	);

	Scenario(
		'Retrieving user appeal requests with state filters',
		({ Given, When, Then, And }) => {
			Given('a page number of 1 and page size of 10', () => {
				command = {
					page: 1,
					pageSize: 10,
					stateFilters: ['requested', 'accepted'],
				};
			});

			And('state filters for "requested" and "accepted"', () => {
				const mockFilteredRequests = [
					{ id: 'appeal-1', user: { id: 'user-1' }, state: 'requested' },
					{ id: 'appeal-2', user: { id: 'user-2' }, state: 'accepted' },
				];

				mockReadRepo.getAll.mockResolvedValue({
					items: mockFilteredRequests,
					total: 2,
					page: 1,
					pageSize: 10,
				});
			});

			When('the getAll command is executed', async () => {
				try {
					const getAllFn = getAll(mockDataSources);
					result = await getAllFn(command);
				} catch (_err) {
					// No error expected in this scenario
				}
			});

			Then(
				'it should return only appeal requests with the specified states',
				() => {
					expect(result.items).toBeDefined();
					expect(mockReadRepo.getAll).toHaveBeenCalledWith(
						expect.objectContaining({
							stateFilters: ['requested', 'accepted'],
						}),
					);
				},
			);
		},
	);

	Scenario(
		'Retrieving user appeal requests with sorting',
		({ Given, When, Then, And }) => {
			Given('a page number of 1 and page size of 10', () => {
				command = {
					page: 1,
					pageSize: 10,
					sorter: { field: 'createdAt', order: 'descend' },
				};
			});

			And('a sorter with field "createdAt" and order "descend"', () => {
				const mockSortedRequests = [
					{
						id: 'appeal-2',
						user: { id: 'user-2' },
						createdAt: new Date('2023-12-02'),
					},
					{
						id: 'appeal-1',
						user: { id: 'user-1' },
						createdAt: new Date('2023-12-01'),
					},
				];

				mockReadRepo.getAll.mockResolvedValue({
					items: mockSortedRequests,
					total: 2,
					page: 1,
					pageSize: 10,
				});
			});

			When('the getAll command is executed', async () => {
				try {
					const getAllFn = getAll(mockDataSources);
					result = await getAllFn(command);
				} catch (_err) {
					// No error expected in this scenario
				}
			});

			Then(
				'the results should be sorted by the specified field in descending order',
				() => {
					expect(result.items).toBeDefined();
					expect(mockReadRepo.getAll).toHaveBeenCalledWith(
						expect.objectContaining({
							sorter: { field: 'createdAt', order: 'descend' },
						}),
					);
				},
			);
		},
	);

	Scenario(
		'Retrieving user appeal requests when none exist',
		({ Given, When, Then, And }) => {
			Given('a page number of 1 and page size of 10', () => {
				command = {
					page: 1,
					pageSize: 10,
				};
			});

			When('the getAll command is executed for an empty dataset', async () => {
				mockReadRepo.getAll.mockResolvedValue({
					items: [],
					total: 0,
					page: 1,
					pageSize: 10,
				});

				try {
					const getAllFn = getAll(mockDataSources);
					result = await getAllFn(command);
				} catch (_err) {
					// No error expected in this scenario
				}
			});

			Then('it should return an empty items array', () => {
				expect(result.items).toBeInstanceOf(Array);
				expect(result.items.length).toBe(0);
			});

			And('the total count should be 0', () => {
				expect(result.total).toBe(0);
			});
		},
	);

	Scenario(
		'Retrieving user appeal requests with invalid sorter order',
		({ Given, When, Then, And }) => {
			Given('a page number of 1 and page size of 10', () => {
				command = {
					page: 1,
					pageSize: 10,
					sorter: { field: 'createdAt', order: 'invalid' },
				};
			});

			And('a sorter with invalid order', () => {
				mockReadRepo.getAll.mockResolvedValue({
					items: [{ id: 'appeal-1' }],
					total: 1,
					page: 1,
					pageSize: 10,
				});
			});

			When('the getAll command is executed', async () => {
				try {
					const getAllFn = getAll(mockDataSources);
					result = await getAllFn(command);
				} catch (_err) {
					// No error expected in this scenario
				}
			});

			Then('the results should use default ascend order', () => {
				expect(mockReadRepo.getAll).toHaveBeenCalledWith(
					expect.objectContaining({
						sorter: { field: 'createdAt', order: 'ascend' },
					}),
				);
			});
		},
	);
});
