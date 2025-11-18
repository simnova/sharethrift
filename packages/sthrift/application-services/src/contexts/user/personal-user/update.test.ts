import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { type PersonalUserUpdateCommand, update } from './update.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/update.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: PersonalUserUpdateCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockDataSources = {
			domainDataSource: {
				User: {
					PersonalUser: {
						PersonalUserUnitOfWork: {
							withScopedTransaction: vi.fn(async (callback) => {
								const mockUser = {
									id: 'user-123',
									isBlocked: false,
									account: {
										accountType: 'Individual',
										username: 'johndoe',
										profile: {
											firstName: 'John',
											lastName: 'Doe',
										},
									},
								};
								const mockRepo = {
									getById: vi.fn().mockResolvedValue(mockUser),
									save: vi.fn().mockResolvedValue(mockUser),
								};
								await callback(mockRepo);
							}),
						},
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = { id: 'user-123' };
		result = undefined;
	});

	Scenario(
		'Successfully updating user profile',
		({ Given, And, When, Then }) => {
			Given('a valid user ID "user-123"', () => {
				command.id = 'user-123';
			});

			And('the user exists', () => {
				command.account = {
					profile: {
						firstName: 'Jane',
						lastName: 'Smith',
					},
				};
			});

			When('the update command is executed with new profile data', async () => {
				const updateFn = update(mockDataSources);
				result = await updateFn(command);
			});

			Then('the user profile should be updated', () => {
				expect(result).toBeDefined();
				expect(result.id).toBe('user-123');
			});
		},
	);

	Scenario('Blocking a user', ({ Given, And, When, Then }) => {
		Given('a valid user ID "user-123"', () => {
			command.id = 'user-123';
		});

		And('the user exists', () => {
			command.isBlocked = true;
		});

		When('the update command is executed with isBlocked true', async () => {
			const updateFn = update(mockDataSources);
			result = await updateFn(command);
		});

		Then('the user should be blocked', () => {
			expect(result).toBeDefined();
			expect(result.id).toBe('user-123');
		});
	});
});
