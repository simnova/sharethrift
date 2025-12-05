import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { type BlockAdminUserCommand, blockUser } from './block-user.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/block-user.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockUnitOfWork: any;
	let command: BlockAdminUserCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let error: any;

	BeforeEachScenario(() => {
		mockRepo = {
			getById: vi.fn(),
			save: vi.fn(),
		};

		mockUnitOfWork = {
			withScopedTransaction: vi.fn(async (callback) => {
				await callback(mockRepo);
			}),
		};

		mockDataSources = {
			domainDataSource: {
				User: {
					AdminUser: {
						AdminUserUnitOfWork: mockUnitOfWork,
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = { userId: 'user-123' };
		result = undefined;
		error = undefined;
	});

	Scenario(
		'Successfully blocking an admin user',
		({ Given, And, When, Then }) => {
			Given('a valid admin user ID "user-123"', () => {
				command = { userId: 'user-123' };
			});

			And('the admin user exists', () => {
				const mockUser = {
					id: 'user-123',
					isBlocked: false,
				};
				mockRepo.getById.mockResolvedValue(mockUser);
				mockRepo.save.mockResolvedValue({ ...mockUser, isBlocked: true });
			});

			When('the blockUser command is executed', async () => {
				const blockFn = blockUser(mockDataSources);
				result = await blockFn(command);
			});

			Then('the admin user should be blocked', () => {
				expect(result).toBeDefined();
				expect(result.isBlocked).toBe(true);
			});

			And('the blocked user should be returned', () => {
				expect(result.id).toBe('user-123');
			});
		},
	);

	Scenario(
		'Blocking non-existent admin user',
		({ Given, When, Then }) => {
			Given('an admin user ID "user-999" that does not exist', () => {
				command = { userId: 'user-999' };
			});

			When('the blockUser command is executed', async () => {
				mockRepo.getById.mockResolvedValue(null);
				const blockFn = blockUser(mockDataSources);
				try {
					await blockFn(command);
				} catch (e) {
					error = e;
				}
			});

			Then(
				'an error should be thrown with message "admin user not found"',
				() => {
					expect(error).toBeDefined();
					expect(error.message).toBe('admin user not found');
				},
			);
		},
	);

	Scenario(
		'Blocking admin user fails when save returns undefined',
		({ Given, And, When, Then }) => {
			Given('a valid admin user ID "user-123"', () => {
				command = { userId: 'user-123' };
			});

			And('the admin user exists but save returns undefined', () => {
				const mockUser = {
					id: 'user-123',
					isBlocked: false,
				};
				mockRepo.getById.mockResolvedValue(mockUser);
				mockRepo.save.mockResolvedValue(undefined);
			});

			When('the blockUser command is executed', async () => {
				const blockFn = blockUser(mockDataSources);
				try {
					await blockFn(command);
				} catch (e) {
					error = e;
				}
			});

			Then(
				'an error should be thrown with message "admin user block failed"',
				() => {
					expect(error).toBeDefined();
					expect(error.message).toBe('admin user block failed');
				},
			);
		},
	);
});
