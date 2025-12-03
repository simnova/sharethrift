import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { type GetAllUsersCommand, getAllUsers } from './get-all-users.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/get-all-users.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: GetAllUsersCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockDataSources = {
			readonlyDataSource: {
				User: {
					PersonalUser: {
						PersonalUserReadRepo: {
							getAllUsers: vi.fn(),
						},
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = { page: 1, pageSize: 10 };
		result = undefined;
	});

	Scenario('Successfully retrieving all users', ({ Given, When, Then }) => {
		Given('there are 3 users in the system', () => {
			const mockUsers = [
				{ id: 'user-1', email: 'user1@example.com' },
				{ id: 'user-2', email: 'user2@example.com' },
				{ id: 'user-3', email: 'user3@example.com' },
			];
			(
				// biome-ignore lint/suspicious/noExplicitAny: Test mock access
				mockDataSources.readonlyDataSource as any
			).User.PersonalUser.PersonalUserReadRepo.getAllUsers.mockResolvedValue({
				items: mockUsers,
				total: 3,
				page: 1,
				pageSize: 10,
			});
		});

		When('the getAllUsers command is executed', async () => {
			const getAllUsersFn = getAllUsers(mockDataSources);
			result = await getAllUsersFn(command);
		});

		Then('3 users should be returned', () => {
			expect(result).toBeDefined();
			expect(result.items.length).toBe(3);
		});
	});

	Scenario('Retrieving all users when none exist', ({ Given, When, Then }) => {
		Given('there are no users in the system', () => {
			(
				// biome-ignore lint/suspicious/noExplicitAny: Test mock access
				mockDataSources.readonlyDataSource as any
			).User.PersonalUser.PersonalUserReadRepo.getAllUsers.mockResolvedValue({
				items: [],
				total: 0,
				page: 1,
				pageSize: 10,
			});
		});

		When('the getAllUsers command is executed', async () => {
			const getAllUsersFn = getAllUsers(mockDataSources);
			result = await getAllUsersFn(command);
		});

		Then('an empty array should be returned', () => {
			expect(result).toBeDefined();
			expect(result.items.length).toBe(0);
		});
	});

	Scenario('Retrieving users with search text', ({ Given, When, Then }) => {
		Given('there are users matching the search criteria', () => {
			const mockUsers = [{ id: 'user-1', email: 'john@example.com' }];
			(
				// biome-ignore lint/suspicious/noExplicitAny: Test mock access
				mockDataSources.readonlyDataSource as any
			).User.PersonalUser.PersonalUserReadRepo.getAllUsers.mockResolvedValue({
				items: mockUsers,
				total: 1,
				page: 1,
				pageSize: 10,
			});
		});

		When('the getAllUsers command is executed with searchText', async () => {
			command.searchText = 'john';
			const getAllUsersFn = getAllUsers(mockDataSources);
			result = await getAllUsersFn(command);
		});

		Then('filtered users should be returned', () => {
			expect(result).toBeDefined();
			expect(result.items.length).toBe(1);
			expect(
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).User.PersonalUser.PersonalUserReadRepo.getAllUsers,
			).toHaveBeenCalledWith(
				expect.objectContaining({ searchText: 'john' }),
			);
		});
	});

	Scenario('Retrieving users with status filters', ({ Given, When, Then }) => {
		Given('there are users with various statuses', () => {
			const mockUsers = [{ id: 'user-1', isBlocked: false }];
			(
				// biome-ignore lint/suspicious/noExplicitAny: Test mock access
				mockDataSources.readonlyDataSource as any
			).User.PersonalUser.PersonalUserReadRepo.getAllUsers.mockResolvedValue({
				items: mockUsers,
				total: 1,
				page: 1,
				pageSize: 10,
			});
		});

		When('the getAllUsers command is executed with statusFilters', async () => {
			command.statusFilters = ['Active'];
			const getAllUsersFn = getAllUsers(mockDataSources);
			result = await getAllUsersFn(command);
		});

		Then('users matching status filters should be returned', () => {
			expect(result).toBeDefined();
			expect(
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).User.PersonalUser.PersonalUserReadRepo.getAllUsers,
			).toHaveBeenCalledWith(
				expect.objectContaining({ statusFilters: ['Active'] }),
			);
		});
	});

	Scenario('Retrieving users with sorter ascending', ({ Given, When, Then }) => {
		Given('there are users in the system', () => {
			const mockUsers = [
				{ id: 'user-1' },
				{ id: 'user-2' },
			];
			(
				// biome-ignore lint/suspicious/noExplicitAny: Test mock access
				mockDataSources.readonlyDataSource as any
			).User.PersonalUser.PersonalUserReadRepo.getAllUsers.mockResolvedValue({
				items: mockUsers,
				total: 2,
				page: 1,
				pageSize: 10,
			});
		});

		When(
			'the getAllUsers command is executed with sorter order ascend',
			async () => {
				command.sorter = { field: 'email', order: 'ascend' };
				const getAllUsersFn = getAllUsers(mockDataSources);
				result = await getAllUsersFn(command);
			},
		);

		Then('sorted users should be returned', () => {
			expect(result).toBeDefined();
			expect(
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).User.PersonalUser.PersonalUserReadRepo.getAllUsers,
			).toHaveBeenCalledWith(
				expect.objectContaining({
					sorter: { field: 'email', order: 'ascend' },
				}),
			);
		});
	});

	Scenario(
		'Retrieving users with sorter descending',
		({ Given, When, Then }) => {
			Given('there are users in the system', () => {
				const mockUsers = [
					{ id: 'user-1' },
					{ id: 'user-2' },
				];
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).User.PersonalUser.PersonalUserReadRepo.getAllUsers.mockResolvedValue({
					items: mockUsers,
					total: 2,
					page: 1,
					pageSize: 10,
				});
			});

			When(
				'the getAllUsers command is executed with sorter order descend',
				async () => {
					command.sorter = { field: 'email', order: 'descend' };
					const getAllUsersFn = getAllUsers(mockDataSources);
					result = await getAllUsersFn(command);
				},
			);

			Then('sorted users in descending order should be returned', () => {
				expect(result).toBeDefined();
				expect(
					(
						// biome-ignore lint/suspicious/noExplicitAny: Test mock access
						mockDataSources.readonlyDataSource as any
					).User.PersonalUser.PersonalUserReadRepo.getAllUsers,
				).toHaveBeenCalledWith(
					expect.objectContaining({
						sorter: { field: 'email', order: 'descend' },
					}),
				);
			});
		},
	);

	Scenario(
		'Retrieving users with invalid sorter order',
		({ Given, When, Then }) => {
			Given('there are users in the system', () => {
				const mockUsers = [
					{ id: 'user-1' },
					{ id: 'user-2' },
				];
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).User.PersonalUser.PersonalUserReadRepo.getAllUsers.mockResolvedValue({
					items: mockUsers,
					total: 2,
					page: 1,
					pageSize: 10,
				});
			});

			When(
				'the getAllUsers command is executed with invalid sorter order',
				async () => {
					command.sorter = { field: 'email', order: 'invalid' };
					const getAllUsersFn = getAllUsers(mockDataSources);
					result = await getAllUsersFn(command);
				},
			);

			Then('users should be returned with default ascend order', () => {
				expect(result).toBeDefined();
				expect(
					(
						// biome-ignore lint/suspicious/noExplicitAny: Test mock access
						mockDataSources.readonlyDataSource as any
					).User.PersonalUser.PersonalUserReadRepo.getAllUsers,
				).toHaveBeenCalledWith(
					expect.objectContaining({
						sorter: { field: 'email', order: 'ascend' },
					}),
				);
			});
		},
	);
});
