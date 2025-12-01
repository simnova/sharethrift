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
											aboutMe: '',
											location: {
												address1: '',
												address2: '',
												city: '',
												state: '',
												country: '',
												zipCode: '',
											},
											billing: {
												subscriptionId: '',
												cybersourceCustomerId: '',
											},
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

	Scenario(
		'Updating account type and username',
		({ Given, And, When, Then }) => {
			Given('a valid user ID "user-123"', () => {
				command.id = 'user-123';
			});

			And('the user exists', () => {
				command.account = {
					accountType: 'Business',
					username: 'newusername',
				};
			});

			When(
				'the update command is executed with account type and username',
				async () => {
					const updateFn = update(mockDataSources);
					result = await updateFn(command);
				},
			);

			Then('the account should be updated', () => {
				expect(result).toBeDefined();
				expect(result.id).toBe('user-123');
			});
		},
	);

	Scenario(
		'Updating user profile with firstName and lastName',
		({ Given, And, When, Then }) => {
			Given('a valid user ID "user-123"', () => {
				command.id = 'user-123';
			});

			And('the user exists', () => {
				command.account = {
					profile: {
						firstName: 'Alice',
						lastName: 'Johnson',
					},
				};
			});

			When(
				'the update command is executed with profile firstName and lastName',
				async () => {
					const updateFn = update(mockDataSources);
					result = await updateFn(command);
				},
			);

			Then('the profile names should be updated', () => {
				expect(result).toBeDefined();
				expect(result.id).toBe('user-123');
			});
		},
	);

	Scenario('Updating user profile with aboutMe', ({ Given, And, When, Then }) => {
		Given('a valid user ID "user-123"', () => {
			command.id = 'user-123';
		});

		And('the user exists', () => {
			command.account = {
				profile: {
					aboutMe: 'This is my new bio',
				},
			};
		});

		When('the update command is executed with aboutMe', async () => {
			const updateFn = update(mockDataSources);
			result = await updateFn(command);
		});

		Then('the profile aboutMe should be updated', () => {
			expect(result).toBeDefined();
			expect(result.id).toBe('user-123');
		});
	});

	Scenario(
		'Updating user location with address2',
		({ Given, And, When, Then }) => {
			Given('a valid user ID "user-123"', () => {
				command.id = 'user-123';
			});

			And('the user exists', () => {
				command.account = {
					profile: {
						location: {
							address1: '123 Main St',
							address2: 'Apt 4B',
							city: 'New York',
							state: 'NY',
							country: 'USA',
							zipCode: '10001',
						},
					},
				};
			});

			When(
				'the update command is executed with location including address2',
				async () => {
					const updateFn = update(mockDataSources);
					result = await updateFn(command);
				},
			);

			Then('the location should be updated with address2', () => {
				expect(result).toBeDefined();
				expect(result.id).toBe('user-123');
			});
		},
	);

	Scenario(
		'Updating user location without address2',
		({ Given, And, When, Then }) => {
			Given('a valid user ID "user-123"', () => {
				command.id = 'user-123';
			});

			And('the user exists', () => {
				command.account = {
					profile: {
						location: {
							address1: '456 Oak Ave',
							city: 'Los Angeles',
							state: 'CA',
							country: 'USA',
							zipCode: '90001',
						},
					},
				};
			});

			When(
				'the update command is executed with location without address2',
				async () => {
					const updateFn = update(mockDataSources);
					result = await updateFn(command);
				},
			);

			Then('the location should be updated with empty address2', () => {
				expect(result).toBeDefined();
				expect(result.id).toBe('user-123');
			});
		},
	);

	Scenario(
		'Updating user billing information',
		({ Given, And, When, Then }) => {
			Given('a valid user ID "user-123"', () => {
				command.id = 'user-123';
			});

			And('the user exists', () => {
				command.account = {
					profile: {
						billing: {
							subscriptionId: 'sub-123',
							cybersourceCustomerId: 'cust-456',
						},
					},
				};
			});

			When(
				'the update command is executed with billing information',
				async () => {
					const updateFn = update(mockDataSources);
					result = await updateFn(command);
				},
			);

			Then('the billing information should be updated', () => {
				expect(result).toBeDefined();
				expect(result.id).toBe('user-123');
			});
		},
	);

	Scenario(
		'Update fails when user not found',
		({ Given, And, When, Then }) => {
			Given('a valid user ID "user-999"', () => {
				command.id = 'user-999';
			});

			And('the user does not exist', () => {
				mockDataSources = {
					domainDataSource: {
						User: {
							PersonalUser: {
								PersonalUserUnitOfWork: {
									withScopedTransaction: vi.fn(async (callback) => {
										const mockRepo = {
											getById: vi.fn().mockResolvedValue(null),
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
			});

			When('the update command is executed', async () => {
				const updateFn = update(mockDataSources);
				try {
					result = await updateFn(command);
				} catch (error) {
					result = error;
				}
			});

			Then(
				'an error should be thrown with message "personal user not found"',
				() => {
					expect(result).toBeInstanceOf(Error);
					expect((result as Error).message).toBe('personal user not found');
				},
			);
		},
	);

	Scenario('Update fails when user ID is empty', ({ Given, When, Then }) => {
		Given('an empty user ID', () => {
			command.id = '';
		});

		When('the update command is executed', async () => {
			const updateFn = update(mockDataSources);
			try {
				result = await updateFn(command);
			} catch (error) {
				result = error;
			}
		});

		Then(
			'an error should be thrown with message "personal user id is required"',
			() => {
				expect(result).toBeInstanceOf(Error);
				expect((result as Error).message).toBe('personal user id is required');
			},
		);
	});

	Scenario(
		'Update fails when save returns undefined',
		({ Given, And, When, Then }) => {
			Given('a valid user ID "user-123"', () => {
				command.id = 'user-123';
			});

			And('the user exists', () => {
				command.account = {
					profile: {
						firstName: 'Test',
					},
				};
			});

			And('save returns undefined', () => {
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
													location: {},
													billing: {},
												},
											},
										};
										const mockRepo = {
											getById: vi.fn().mockResolvedValue(mockUser),
											save: vi.fn().mockResolvedValue(undefined),
										};
										await callback(mockRepo);
									}),
								},
							},
						},
					},
				// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
				} as any;
			});

			When('the update command is executed', async () => {
				const updateFn = update(mockDataSources);
				try {
					result = await updateFn(command);
				} catch (error) {
					result = error;
				}
			});

			Then(
				'an error should be thrown with message "personal user update failed"',
				() => {
					expect(result).toBeInstanceOf(Error);
					expect((result as Error).message).toBe(
						'personal user update failed',
					);
				},
			);
		},
	);

	Scenario(
		'Updating user hasCompletedOnboarding status',
		({ Given, And, When, Then }) => {
			Given('a valid user ID "user-123"', () => {
				command.id = 'user-123';
			});

			And('the user exists', () => {
				mockDataSources = {
					domainDataSource: {
						User: {
							PersonalUser: {
								PersonalUserUnitOfWork: {
									withScopedTransaction: vi.fn(async (callback) => {
										const mockUser = {
											id: 'user-123',
											isBlocked: false,
											hasCompletedOnboarding: false,
											account: {
												accountType: 'Individual',
												username: 'johndoe',
												profile: {
													firstName: 'John',
													lastName: 'Doe',
													location: {},
													billing: {},
												},
											},
										};
										const mockRepo = {
											getById: vi.fn().mockResolvedValue(mockUser),
											save: vi.fn().mockResolvedValue({
												...mockUser,
												hasCompletedOnboarding: true,
											}),
										};
										await callback(mockRepo);
									}),
								},
							},
						},
					},
				// biome-ignore lint/suspicious/noExplicitAny: Test mock type assertion
				} as any;
			});

			When(
				'the update command is executed with hasCompletedOnboarding true',
				async () => {
					command = {
						id: 'user-123',
						hasCompletedOnboarding: true,
					};
					const updateFn = update(mockDataSources);
					result = await updateFn(command);
				},
			);

			Then('the hasCompletedOnboarding should be updated', () => {
				expect(result).toBeDefined();
				expect(result.hasCompletedOnboarding).toBe(true);
			});
		},
	);
});
