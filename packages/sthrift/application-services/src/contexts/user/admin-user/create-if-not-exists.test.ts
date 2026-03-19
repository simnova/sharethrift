import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	type AdminUserCreateCommand,
	createIfNotExists,
} from './create-if-not-exists.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/create-if-not-exists.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockReadRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockUnitOfWork: any;
	let command: AdminUserCreateCommand;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let result: any;

	BeforeEachScenario(() => {
		mockReadRepo = {
			getByEmail: vi.fn(),
			getById: vi.fn(),
		};

		mockRepo = {
			getNewInstance: vi.fn(),
			save: vi.fn(),
		};

		mockUnitOfWork = {
			withScopedTransaction: vi.fn(async (callback) => {
				await callback(mockRepo);
			}),
		};

		mockDataSources = {
			readonlyDataSource: {
				User: {
					AdminUser: {
						AdminUserReadRepo: mockReadRepo,
					},
				},
			},
			domainDataSource: {
				User: {
					AdminUser: {
						AdminUserUnitOfWork: mockUnitOfWork,
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = {
			email: 'admin@example.com',
			username: 'admin123',
			firstName: 'John',
			lastName: 'Doe',
			roleId: 'role-123',
		};
		result = undefined;
	});

	Scenario(
		'Creating a new admin user',
		({ Given, And, When, Then }) => {
			Given(
				'an admin user with email "admin@example.com" does not exist',
				() => {
					mockReadRepo.getByEmail.mockResolvedValue(null);
				},
			);

			And('valid user details are provided', () => {
				command = {
					email: 'admin@example.com',
					username: 'admin123',
					firstName: 'John',
					lastName: 'Doe',
					roleId: 'role-123',
				};
			});

			When('the createIfNotExists command is executed', async () => {
				const mockNewUser = {
					id: 'user-123',
					props: { role: {} },
				};
				mockRepo.getNewInstance.mockResolvedValue(mockNewUser);
				mockRepo.save.mockResolvedValue({ id: 'user-123' });
				mockReadRepo.getById.mockResolvedValue({
					id: 'user-123',
					account: { email: 'admin@example.com' },
				});

				const createFn = createIfNotExists(mockDataSources);
				result = await createFn(command);
			});

			Then('a new admin user should be created', () => {
				expect(mockRepo.getNewInstance).toHaveBeenCalled();
				expect(mockRepo.save).toHaveBeenCalled();
			});

			And('the created user should be returned', () => {
				expect(result).toBeDefined();
				expect(result.id).toBe('user-123');
			});
		},
	);

	Scenario(
		'Admin user already exists',
		({ Given, When, Then, And }) => {
			Given(
				'an admin user with email "existing@example.com" already exists',
				() => {
					const existingUser = {
						id: 'existing-123',
						account: { email: 'existing@example.com' },
					};
					mockReadRepo.getByEmail.mockResolvedValue(existingUser);
					command = {
						email: 'existing@example.com',
						username: 'existing',
						firstName: 'Existing',
						lastName: 'User',
						roleId: 'role-123',
					};
				},
			);

			When('the createIfNotExists command is executed', async () => {
				const createFn = createIfNotExists(mockDataSources);
				result = await createFn(command);
			});

			Then('the existing admin user should be returned', () => {
				expect(result).toBeDefined();
				expect(result.id).toBe('existing-123');
			});

			And('no new user should be created', () => {
				expect(mockRepo.getNewInstance).not.toHaveBeenCalled();
				expect(mockRepo.save).not.toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Creation fails when save returns undefined',
		({ Given, And, When, Then }) => {
			let error: Error | undefined;

			Given(
				'an admin user with email "fail@example.com" does not exist',
				() => {
					mockReadRepo.getByEmail.mockResolvedValue(null);
					command = {
						email: 'fail@example.com',
						username: 'failuser',
						firstName: 'Fail',
						lastName: 'User',
						roleId: 'role-123',
					};
				},
			);

			And('valid user details are provided', () => {
				// command already set above
			});

			And('the repository save returns undefined', () => {
				const mockNewUser = {
					id: 'user-fail',
					props: { role: {} },
				};
				mockRepo.getNewInstance.mockResolvedValue(mockNewUser);
				mockRepo.save.mockResolvedValue({ id: undefined });
			});

			When('the createIfNotExists command is executed', async () => {
				const createFn = createIfNotExists(mockDataSources);
				try {
					await createFn(command);
				} catch (e) {
					error = e as Error;
				}
			});

			Then(
				'an error should be thrown with message "admin user not created"',
				() => {
					expect(error).toBeDefined();
					expect(error?.message).toBe('admin user not created');
				},
			);
		},
	);

	Scenario(
		'Creation fails when re-query returns undefined',
		({ Given, And, When, Then }) => {
			let error: Error | undefined;

			Given(
				'an admin user with email "fail2@example.com" does not exist',
				() => {
					mockReadRepo.getByEmail.mockResolvedValue(null);
					command = {
						email: 'fail2@example.com',
						username: 'failuser2',
						firstName: 'Fail',
						lastName: 'User',
						roleId: 'role-123',
					};
				},
			);

			And('valid user details are provided', () => {
				// command already set above
			});

			And('the re-query after save returns undefined', () => {
				const mockNewUser = {
					id: 'user-fail2',
					props: { role: {} },
				};
				mockRepo.getNewInstance.mockResolvedValue(mockNewUser);
				mockRepo.save.mockResolvedValue({ id: 'user-fail2' });
				mockReadRepo.getById.mockResolvedValue(null);
			});

			When('the createIfNotExists command is executed', async () => {
				const createFn = createIfNotExists(mockDataSources);
				try {
					await createFn(command);
				} catch (e) {
					error = e as Error;
				}
			});

			Then(
				'an error should be thrown with message "admin user not found after creation"',
				() => {
					expect(error).toBeDefined();
					expect(error?.message).toBe('admin user not found after creation');
				},
			);
		},
	);
});
