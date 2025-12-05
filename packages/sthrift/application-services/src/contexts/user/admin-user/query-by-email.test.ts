import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	type AdminUserQueryByEmailCommand,
	queryByEmail,
} from './query-by-email.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/query-by-email.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockReadRepo: any;
	let command: AdminUserQueryByEmailCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockReadRepo = {
			getByEmail: vi.fn(),
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

		command = { email: 'admin@example.com' };
		result = undefined;
	});

	Scenario(
		'Successfully retrieving an admin user by email',
		({ Given, And, When, Then }) => {
			Given('a valid admin user email "admin@example.com"', () => {
				command = { email: 'admin@example.com' };
			});

			And('the admin user exists', () => {
				const mockUser = {
					id: 'user-123',
					account: { email: 'admin@example.com' },
				};
				mockReadRepo.getByEmail.mockResolvedValue(mockUser);
			});

			When('the queryByEmail command is executed', async () => {
				const queryFn = queryByEmail(mockDataSources);
				result = await queryFn(command);
			});

			Then('the admin user should be returned', () => {
				expect(result).toBeDefined();
				expect(result.account.email).toBe('admin@example.com');
			});
		},
	);

	Scenario(
		'Retrieving non-existent admin user by email',
		({ Given, When, Then }) => {
			Given(
				'an admin user email "nonexistent@example.com" that does not exist',
				() => {
					command = { email: 'nonexistent@example.com' };
				},
			);

			When('the queryByEmail command is executed', async () => {
				mockReadRepo.getByEmail.mockResolvedValue(null);
				const queryFn = queryByEmail(mockDataSources);
				result = await queryFn(command);
			});

			Then('null should be returned', () => {
				expect(result).toBeNull();
			});
		},
	);
});
