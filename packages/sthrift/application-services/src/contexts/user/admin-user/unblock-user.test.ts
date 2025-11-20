import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	type UnblockAdminUserCommand,
	unblockUser,
} from './unblock-user.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/unblock-user.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockUnitOfWork: any;
	let command: UnblockAdminUserCommand;
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
		'Successfully unblocking an admin user',
		({ Given, And, When, Then }) => {
			Given('a valid admin user ID "user-123"', () => {
				command = { userId: 'user-123' };
			});

			And('the admin user exists and is blocked', () => {
				const mockUser = {
					id: 'user-123',
					isBlocked: true,
				};
				mockRepo.getById.mockResolvedValue(mockUser);
				mockRepo.save.mockResolvedValue({ ...mockUser, isBlocked: false });
			});

			When('the unblockUser command is executed', async () => {
				const unblockFn = unblockUser(mockDataSources);
				result = await unblockFn(command);
			});

			Then('the admin user should be unblocked', () => {
				expect(result).toBeDefined();
				expect(result.isBlocked).toBe(false);
			});

			And('the unblocked user should be returned', () => {
				expect(result.id).toBe('user-123');
			});
		},
	);

	Scenario(
		'Unblocking non-existent admin user',
		({ Given, When, Then }) => {
			Given('an admin user ID "user-999" that does not exist', () => {
				command = { userId: 'user-999' };
			});

			When('the unblockUser command is executed', async () => {
				mockRepo.getById.mockResolvedValue(null);
				const unblockFn = unblockUser(mockDataSources);
				try {
					await unblockFn(command);
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
});
