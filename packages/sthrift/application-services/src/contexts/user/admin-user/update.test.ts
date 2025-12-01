import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DataSources } from '@sthrift/persistence';
import { expect, vi } from 'vitest';
import { type AdminUserUpdateCommand, update } from './update.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/update.feature'),
);

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let mockDataSources: DataSources;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockRepo: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock variable
	let mockUnitOfWork: any;
	let command: AdminUserUpdateCommand;
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

		command = { id: 'user-123' };
		result = undefined;
		error = undefined;
	});

	Scenario(
		'Successfully updating admin user basic fields',
		({ Given, And, When, Then }) => {
			Given('a valid admin user ID "user-123"', () => {
				command = { id: 'user-123' };
			});

			And('the admin user exists', () => {
				const mockUser = {
					id: 'user-123',
					isBlocked: false,
					props: { role: { id: 'role-old' } },
				};
				mockRepo.getById.mockResolvedValue(mockUser);
			});

			And('update data includes isBlocked and roleId', () => {
				command = {
					id: 'user-123',
					isBlocked: true,
					roleId: 'role-new',
				};
			});

			When('the update command is executed', async () => {
				mockRepo.save.mockResolvedValue({
					id: 'user-123',
					isBlocked: true,
				});
				const updateFn = update(mockDataSources);
				result = await updateFn(command);
			});

			Then('the admin user should be updated', () => {
				expect(mockRepo.save).toHaveBeenCalled();
			});

			And('the updated user should be returned', () => {
				expect(result).toBeDefined();
				expect(result.id).toBe('user-123');
			});
		},
	);

	Scenario(
		'Successfully updating admin user account and profile',
		({ Given, And, When, Then }) => {
			Given('a valid admin user ID "user-123"', () => {
				command = { id: 'user-123' };
			});

			And('the admin user exists', () => {
				const mockUser = {
					id: 'user-123',
					account: {
						accountType: 'admin',
						username: 'oldusername',
						profile: {
							firstName: 'Old',
							lastName: 'Name',
							aboutMe: 'Old bio',
							location: {
								address1: 'Old Address',
								city: 'Old City',
								state: 'Old State',
								country: 'Old Country',
								zipCode: '00000',
							},
						},
					},
				};
				mockRepo.getById.mockResolvedValue(mockUser);
			});

			And('update data includes account information', () => {
				command = {
					id: 'user-123',
					account: {
						username: 'newusername',
						profile: {
							firstName: 'New',
							lastName: 'Name',
							location: {
								city: 'New City',
								country: 'New Country',
							},
						},
					},
				};
			});

			When('the update command is executed', async () => {
				mockRepo.save.mockResolvedValue({ id: 'user-123' });
				const updateFn = update(mockDataSources);
				result = await updateFn(command);
			});

			Then('the admin user account should be updated', () => {
				expect(mockRepo.save).toHaveBeenCalled();
			});

			And('the updated user should be returned', () => {
				expect(result).toBeDefined();
				expect(result.id).toBe('user-123');
			});
		},
	);

	Scenario(
		'Updating non-existent admin user',
		({ Given, When, Then }) => {
			Given('an admin user ID "user-999" that does not exist', () => {
				command = { id: 'user-999' };
			});

			When('the update command is executed', async () => {
				mockRepo.getById.mockResolvedValue(null);
				const updateFn = update(mockDataSources);
				try {
					await updateFn(command);
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

	Scenario('Updating without user ID', ({ Given, When, Then }) => {
		Given('no admin user ID is provided', () => {
			command = { id: '' };
		});

		When('the update command is executed', async () => {
			const updateFn = update(mockDataSources);
			try {
				await updateFn(command);
			} catch (e) {
				error = e;
			}
		});

		Then(
			'an error should be thrown with message "admin user id is required"',
			() => {
				expect(error).toBeDefined();
				expect(error.message).toBe('admin user id is required');
			},
		);
	});

	Scenario(
		'Successfully updating admin user location with address2',
		({ Given, And, When, Then }) => {
			Given('a valid admin user ID "user-123"', () => {
				command = { id: 'user-123' };
			});

			And('the admin user exists', () => {
				const mockUser = {
					id: 'user-123',
					account: {
						accountType: 'admin',
						username: 'username',
						profile: {
							firstName: 'First',
							lastName: 'Last',
							aboutMe: 'Bio',
							location: {
								address1: 'Address 1',
								address2: '',
								city: 'City',
								state: 'State',
								country: 'Country',
								zipCode: '12345',
							},
						},
					},
				};
				mockRepo.getById.mockResolvedValue(mockUser);
			});

			And('update data includes all location fields', () => {
				command = {
					id: 'user-123',
					account: {
						profile: {
							location: {
								address1: 'New Address 1',
								address2: 'Suite 100',
								city: 'New City',
								state: 'New State',
								country: 'New Country',
								zipCode: '99999',
							},
						},
					},
				};
			});

			When('the update command is executed', async () => {
				mockRepo.save.mockResolvedValue({ id: 'user-123' });
				const updateFn = update(mockDataSources);
				result = await updateFn(command);
			});

			Then('the admin user location should be updated', () => {
				expect(mockRepo.save).toHaveBeenCalled();
			});

			And('the updated user should be returned', () => {
				expect(result).toBeDefined();
				expect(result.id).toBe('user-123');
			});
		},
	);

	Scenario(
		'Update fails when save returns undefined',
		({ Given, And, When, Then }) => {
			Given('a valid admin user ID "user-123"', () => {
				command = { id: 'user-123' };
			});

			And('the admin user exists but save returns undefined', () => {
				const mockUser = {
					id: 'user-123',
					isBlocked: false,
					props: { role: { id: 'role-old' } },
				};
				mockRepo.getById.mockResolvedValue(mockUser);
				mockRepo.save.mockResolvedValue(undefined);
			});

			When('the update command is executed', async () => {
				const updateFn = update(mockDataSources);
				try {
					await updateFn(command);
				} catch (e) {
					error = e;
				}
			});

			Then(
				'an error should be thrown with message "admin user update failed"',
				() => {
					expect(error).toBeDefined();
					expect(error.message).toBe('admin user update failed');
				},
			);
		},
	);

	Scenario(
		'Successfully updating admin user profile with aboutMe',
		({ Given, And, When, Then }) => {
			Given('a valid admin user ID "user-123"', () => {
				command = { id: 'user-123' };
			});

			And('the admin user exists', () => {
				const mockUser = {
					id: 'user-123',
					account: {
						accountType: 'admin',
						username: 'username',
						profile: {
							firstName: 'First',
							lastName: 'Last',
							aboutMe: 'Old bio',
							location: {},
						},
					},
				};
				mockRepo.getById.mockResolvedValue(mockUser);
			});

			And('update data includes profile aboutMe', () => {
				command = {
					id: 'user-123',
					account: {
						profile: {
							aboutMe: 'New updated bio',
						},
					},
				};
			});

			When('the update command is executed', async () => {
				mockRepo.save.mockResolvedValue({ id: 'user-123' });
				const updateFn = update(mockDataSources);
				result = await updateFn(command);
			});

			Then('the admin user profile should be updated with aboutMe', () => {
				expect(mockRepo.save).toHaveBeenCalled();
			});

			And('the updated user should be returned', () => {
				expect(result).toBeDefined();
				expect(result.id).toBe('user-123');
			});
		},
	);
});
