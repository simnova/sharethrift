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
});
