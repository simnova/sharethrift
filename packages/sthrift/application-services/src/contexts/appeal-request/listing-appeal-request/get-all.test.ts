import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { type GetAllListingAppealRequestsCommand, getAll } from './get-all.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/get-all.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockReadRepo: any;
	let command: GetAllListingAppealRequestsCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockReadRepo = {
			getAll: vi.fn(),
		};

		mockDataSources = {
			readonlyDataSource: {
				AppealRequest: {
					ListingAppealRequest: {
						ListingAppealRequestReadRepo: mockReadRepo,
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;
		result = undefined;
	});

	Scenario(
		'Successfully retrieving paginated listing appeal requests',
		({ Given, When, Then, And }) => {
			Given('a page number of 1 and page size of 10', () => {
				command = {
					page: 1,
					pageSize: 10,
				};
				mockReadRepo.getAll.mockResolvedValue({
					items: [
						{ id: 'appeal-1', state: 'requested' },
						{ id: 'appeal-2', state: 'accepted' },
					],
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
		'Retrieving listing appeal requests with state filters',
		({ Given, When, Then, And }) => {
			Given('a page number of 1 and page size of 10', () => {
				command = {
					page: 1,
					pageSize: 10,
					stateFilters: ['requested', 'accepted'],
				};
			});

			And('state filters including "requested" and "accepted"', () => {
				mockReadRepo.getAll.mockResolvedValue({
					items: [{ id: 'appeal-1', state: 'requested' }],
					total: 1,
					page: 1,
					pageSize: 10,
				});
			});

			When('the getAll command is executed', async () => {
				const getAllFn = getAll(mockDataSources);
				result = await getAllFn(command);
			});

			Then(
				'it should return only appeal requests matching the state filters',
				() => {
					expect(mockReadRepo.getAll).toHaveBeenCalledWith(
						expect.objectContaining({
							stateFilters: ['requested', 'accepted'],
						}),
					);
					expect(result.items.length).toBe(1);
				},
			);
		},
	);

	Scenario(
		'Retrieving listing appeal requests with sorting',
		({ Given, When, Then, And }) => {
			Given('a page number of 1 and page size of 10', () => {
				command = {
					page: 1,
					pageSize: 10,
					sorter: { field: 'createdAt', order: 'descend' },
				};
			});

			And('a sorter with field "createdAt" and order "descend"', () => {
				mockReadRepo.getAll.mockResolvedValue({
					items: [
						{ id: 'appeal-2', createdAt: new Date('2025-11-18') },
						{ id: 'appeal-1', createdAt: new Date('2025-11-17') },
					],
					total: 2,
					page: 1,
					pageSize: 10,
				});
			});

			When('the getAll command is executed', async () => {
				const getAllFn = getAll(mockDataSources);
				result = await getAllFn(command);
			});

			Then(
				'it should return appeal requests sorted by the specified field and order',
				() => {
					expect(mockReadRepo.getAll).toHaveBeenCalledWith(
						expect.objectContaining({
							sorter: { field: 'createdAt', order: 'descend' },
						}),
					);
				},
			);
		},
	);

	Scenario('Handling empty results', ({ Given, When, Then }) => {
		Given('a page number of 999 and page size of 10', () => {
			command = {
				page: 999,
				pageSize: 10,
			};
			mockReadRepo.getAll.mockResolvedValue({
				items: [],
				total: 0,
				page: 999,
				pageSize: 10,
			});
		});

		When('the getAll command is executed', async () => {
			const getAllFn = getAll(mockDataSources);
			result = await getAllFn(command);
		});

		Then('it should return an empty items array with total count 0', () => {
			expect(result.items).toEqual([]);
			expect(result.total).toBe(0);
		});
	});
});
