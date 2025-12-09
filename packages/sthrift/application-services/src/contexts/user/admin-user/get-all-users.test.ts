import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	type GetAllAdminUsersCommand,
	type AdminUserPageResult,
	getAllUsers,
} from './get-all-users.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/get-all-users.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockReadRepo: any;
	let command: GetAllAdminUsersCommand;
	let result: AdminUserPageResult | undefined;

	BeforeEachScenario(() => {
		mockReadRepo = {
			getAllUsers: vi.fn(),
		};

		mockDataSources = {
			readonlyDataSource: {
				User: {
					AdminUser: {
						AdminUserReadRepo: mockReadRepo,
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = { page: 1, pageSize: 10 };
		result = undefined;
	});

	Scenario(
		'Successfully retrieving all admin users with pagination',
		({ Given, And, When, Then }) => {
			Given('a request for admin users with page 1 and pageSize 10', () => {
				command = { page: 1, pageSize: 10 };
			});

			And('multiple admin users exist', () => {
				const mockUsers = [
					{ id: 'user-1', account: { email: 'user1@example.com' } },
					{ id: 'user-2', account: { email: 'user2@example.com' } },
				];
				mockReadRepo.getAllUsers.mockResolvedValue({
					items: mockUsers,
					total: 2,
					page: 1,
					pageSize: 10,
				});
			});

			When('the getAllUsers command is executed', async () => {
				const getAllFn = getAllUsers(mockDataSources);
				result = await getAllFn(command);
			});

			Then('a paginated list of admin users should be returned', () => {
				expect(result).toBeDefined();
				expect(result?.items).toBeDefined();
				expect(result?.items.length).toBe(2);
			});

			And('the result should include total count and page information', () => {
				expect(result?.total).toBe(2);
				expect(result?.page).toBe(1);
				expect(result?.pageSize).toBe(10);
			});
		},
	);

	Scenario(
		'Retrieving admin users with search filter',
		({ Given, When, Then }) => {
			Given('a request for admin users with search text "john"', () => {
				command = { page: 1, pageSize: 10, searchText: 'john' };
			});

			When('the getAllUsers command is executed', async () => {
				const mockUsers = [
					{ id: 'user-1', account: { email: 'john@example.com' } },
				];
				mockReadRepo.getAllUsers.mockResolvedValue({
					items: mockUsers,
					total: 1,
					page: 1,
					pageSize: 10,
				});
				const getAllFn = getAllUsers(mockDataSources);
				result = await getAllFn(command);
			});

			Then(
				'only admin users matching the search criteria should be returned',
				() => {
					expect(result).toBeDefined();
					expect(result?.items.length).toBe(1);
					expect(mockReadRepo.getAllUsers).toHaveBeenCalledWith(
						expect.objectContaining({ searchText: 'john' }),
					);
				},
			);
		},
	);

	Scenario(
		'Retrieving admin users with status filters',
		({ Given, When, Then }) => {
			Given('a request with status filters', () => {
				command = { page: 1, pageSize: 10, statusFilters: ['Active'] };
			});

			When('the getAllUsers command is executed', async () => {
				const mockUsers = [{ id: 'user-1', isBlocked: false }];
				mockReadRepo.getAllUsers.mockResolvedValue({
					items: mockUsers,
					total: 1,
					page: 1,
					pageSize: 10,
				});
				const getAllFn = getAllUsers(mockDataSources);
				result = await getAllFn(command);
			});

			Then('users matching status filters should be returned', () => {
				expect(result).toBeDefined();
				expect(mockReadRepo.getAllUsers).toHaveBeenCalledWith(
					expect.objectContaining({ statusFilters: ['Active'] }),
				);
			});
		},
	);

	Scenario(
		'Retrieving admin users with sorter ascending',
		({ Given, When, Then }) => {
			Given('a request with sorter order ascend', () => {
				command = {
					page: 1,
					pageSize: 10,
					sorter: { field: 'email', order: 'ascend' },
				};
			});

			When('the getAllUsers command is executed', async () => {
				const mockUsers = [{ id: 'user-1' }, { id: 'user-2' }];
				mockReadRepo.getAllUsers.mockResolvedValue({
					items: mockUsers,
					total: 2,
					page: 1,
					pageSize: 10,
				});
				const getAllFn = getAllUsers(mockDataSources);
				result = await getAllFn(command);
			});

			Then('sorted users should be returned', () => {
				expect(result).toBeDefined();
				expect(mockReadRepo.getAllUsers).toHaveBeenCalledWith(
					expect.objectContaining({
						sorter: { field: 'email', order: 'ascend' },
					}),
				);
			});
		},
	);

	Scenario(
		'Retrieving admin users with sorter descending',
		({ Given, When, Then }) => {
			Given('a request with sorter order descend', () => {
				command = {
					page: 1,
					pageSize: 10,
					sorter: { field: 'email', order: 'descend' },
				};
			});

			When('the getAllUsers command is executed', async () => {
				const mockUsers = [{ id: 'user-1' }, { id: 'user-2' }];
				mockReadRepo.getAllUsers.mockResolvedValue({
					items: mockUsers,
					total: 2,
					page: 1,
					pageSize: 10,
				});
				const getAllFn = getAllUsers(mockDataSources);
				result = await getAllFn(command);
			});

			Then('sorted users in descending order should be returned', () => {
				expect(result).toBeDefined();
				expect(mockReadRepo.getAllUsers).toHaveBeenCalledWith(
					expect.objectContaining({
						sorter: { field: 'email', order: 'descend' },
					}),
				);
			});
		},
	);

	Scenario(
		'Retrieving admin users with invalid sorter order',
		({ Given, When, Then }) => {
			Given('a request with invalid sorter order', () => {
				command = {
					page: 1,
					pageSize: 10,
					sorter: { field: 'email', order: 'invalid' },
				};
			});

			When('the getAllUsers command is executed', async () => {
				const mockUsers = [{ id: 'user-1' }, { id: 'user-2' }];
				mockReadRepo.getAllUsers.mockResolvedValue({
					items: mockUsers,
					total: 2,
					page: 1,
					pageSize: 10,
				});
				const getAllFn = getAllUsers(mockDataSources);
				result = await getAllFn(command);
			});

			Then('users should be returned with default ascend order', () => {
				expect(result).toBeDefined();
				expect(mockReadRepo.getAllUsers).toHaveBeenCalledWith(
					expect.objectContaining({
						sorter: { field: 'email', order: 'ascend' },
					}),
				);
			});
		},
	);
});
