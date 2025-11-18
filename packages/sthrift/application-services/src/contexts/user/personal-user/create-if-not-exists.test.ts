import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import {
	createIfNotExists,
	type PersonalUserCreateCommand,
} from './create-if-not-exists.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/create-if-not-exists.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	let command: PersonalUserCreateCommand;
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
			domainDataSource: {
				User: {
					PersonalUser: {
						PersonalUserUnitOfWork: {
							withScopedTransaction: vi.fn(async (callback) => {
								const mockRepo = {
									getNewInstance: vi.fn(),
									save: vi.fn(),
								};
								await callback(mockRepo);
							}),
						},
					},
				},
			},
		// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
		} as any;

		command = {
			email: 'user@example.com',
			firstName: 'John',
			lastName: 'Doe',
		};
		result = undefined;
	});

	Scenario('Creating a new user', ({ Given, And, When, Then }) => {
		Given('a valid email "user@example.com"', () => {
			command.email = 'user@example.com';
		});

		And('the user does not exist', () => {
			(
				// biome-ignore lint/suspicious/noExplicitAny: Test mock access
				mockDataSources.readonlyDataSource as any
			).User.PersonalUser.PersonalUserReadRepo.getByEmail.mockResolvedValue(
				null,
			);

			const mockUser = { id: 'user-123', email: 'user@example.com' };
			(
				// biome-ignore lint/suspicious/noExplicitAny: Test mock access
				mockDataSources.domainDataSource as any
			).User.PersonalUser.PersonalUserUnitOfWork.withScopedTransaction.mockImplementation(
    // biome-ignore lint/suspicious/noExplicitAny: Test mock callback
				async (callback: any) => {
					const mockRepo = {
						getNewInstance: vi.fn().mockResolvedValue(mockUser),
						save: vi.fn().mockResolvedValue(mockUser),
					};
					await callback(mockRepo);
				},
			);
		});

		When('the createIfNotExists command is executed', async () => {
			const createFn = createIfNotExists(mockDataSources);
			result = await createFn(command);
		});

		Then('a new user should be created', () => {
			expect(result).toBeDefined();
			expect(result.id).toBe('user-123');
		});
	});

	Scenario('User already exists', ({ Given, And, When, Then }) => {
		Given('a valid email "existing@example.com"', () => {
			command.email = 'existing@example.com';
		});

		And('the user already exists', () => {
			const existingUser = {
				id: 'user-456',
				email: 'existing@example.com',
			};
			(
				// biome-ignore lint/suspicious/noExplicitAny: Test mock access
				mockDataSources.readonlyDataSource as any
			).User.PersonalUser.PersonalUserReadRepo.getByEmail.mockResolvedValue(
				existingUser,
			);
		});

		When('the createIfNotExists command is executed', async () => {
			const createFn = createIfNotExists(mockDataSources);
			result = await createFn(command);
		});

		Then('the existing user should be returned', () => {
			expect(result).toBeDefined();
			expect(result.id).toBe('user-456');
		});
	});
});
