import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	type AdminUserQueryByUsernameCommand,
	queryByUsername,
} from './query-by-username.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/query-by-username.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockReadRepo: any;
	let command: AdminUserQueryByUsernameCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockReadRepo = {
			getByUsername: vi.fn(),
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

		command = { username: 'admin123' };
		result = undefined;
	});

	Scenario(
		'Successfully retrieving an admin user by username',
		({ Given, And, When, Then }) => {
			Given('a valid admin user username "admin123"', () => {
				command = { username: 'admin123' };
			});

			And('the admin user exists', () => {
				const mockUser = {
					id: 'user-123',
					account: { username: 'admin123' },
				};
				mockReadRepo.getByUsername.mockResolvedValue(mockUser);
			});

			When('the queryByUsername command is executed', async () => {
				const queryFn = queryByUsername(mockDataSources);
				result = await queryFn(command);
			});

			Then('the admin user should be returned', () => {
				expect(result).toBeDefined();
				expect(result.account.username).toBe('admin123');
			});
		},
	);

	Scenario(
		'Retrieving non-existent admin user by username',
		({ Given, When, Then }) => {
			Given(
				'an admin user username "nonexistent123" that does not exist',
				() => {
					command = { username: 'nonexistent123' };
				},
			);

			When('the queryByUsername command is executed', async () => {
				mockReadRepo.getByUsername.mockResolvedValue(null);
				const queryFn = queryByUsername(mockDataSources);
				result = await queryFn(command);
			});

			Then('null should be returned', () => {
				expect(result).toBeNull();
			});
		},
	);
});
