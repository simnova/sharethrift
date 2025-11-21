import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	type PersonalUserQueryByEmailCommand,
	queryByEmail,
} from './query-by-email.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/query-by-email.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: PersonalUserQueryByEmailCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockDataSources = {
			readonlyDataSource: {
				User: {
					PersonalUser: {
						PersonalUserReadRepo: {
							getByEmail: vi.fn(),
						},
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = { email: 'user@example.com' };
		result = undefined;
	});

	Scenario(
		'Successfully finding user by email',
		({ Given, And, When, Then }) => {
			Given('a valid email "user@example.com"', () => {
				command.email = 'user@example.com';
			});

			And('a user with this email exists', () => {
				const mockUser = { id: 'user-123', email: 'user@example.com' };
				(
					// biome-ignore lint/suspicious/noExplicitAny: Test mock access
					mockDataSources.readonlyDataSource as any
				).User.PersonalUser.PersonalUserReadRepo.getByEmail.mockResolvedValue(
					mockUser,
				);
			});

			When('the queryByEmail command is executed', async () => {
				const queryByEmailFn = queryByEmail(mockDataSources);
				result = await queryByEmailFn(command);
			});

			Then('the user should be returned', () => {
				expect(result).toBeDefined();
				expect(result.email).toBe('user@example.com');
			});
		},
	);

	Scenario('User not found by email', ({ Given, And, When, Then }) => {
		Given('an email "nonexistent@example.com"', () => {
			command.email = 'nonexistent@example.com';
		});

		And('no user with this email exists', () => {
			(
				// biome-ignore lint/suspicious/noExplicitAny: Test mock access
				mockDataSources.readonlyDataSource as any
			).User.PersonalUser.PersonalUserReadRepo.getByEmail.mockResolvedValue(
				null,
			);
		});

		When('the queryByEmail command is executed', async () => {
			const queryByEmailFn = queryByEmail(mockDataSources);
			result = await queryByEmailFn(command);
		});

		Then('undefined should be returned', () => {
			expect(result).toBeNull();
		});
	});
});
