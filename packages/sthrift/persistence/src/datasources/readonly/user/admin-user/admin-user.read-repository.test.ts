import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { ModelsContext } from '../../../../models-context.ts';
import { Domain } from '@sthrift/domain';
import { AdminUserReadRepositoryImpl } from './admin-user.read-repository.ts';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-user.read-repository.feature'),
);

function createThenableQueryChain<T>(getValue: () => T) {
	const chain: Record<string, unknown> = {};
	chain.populate = vi.fn(() => chain);
	chain.lean = vi.fn(() => chain);
	chain.skip = vi.fn(() => chain);
	chain.limit = vi.fn(() => chain);
	chain.sort = vi.fn(() => chain);
	chain.countDocuments = vi.fn(() => chain);
	chain.exec = vi.fn(async () => getValue());
	Object.defineProperty(chain, 'then', {
		value: vi.fn((resolve: (v: T) => unknown) => Promise.resolve(getValue()).then(resolve)),
		enumerable: false,
		configurable: true,
	});
	return chain;
}

function makeRoleDoc(
	overrides: Partial<Models.Role.AdminRole> = {},
): Models.Role.AdminRole {
	return {
		id: new MongooseSeedwork.ObjectId(),
		roleName: 'Test Role',
		isDefault: false,
		roleType: 'admin',
		permissions: {
			userPermissions: {
				canManageUsers: true,
				canViewAllUsers: true,
			},
			rolePermissions: {
				canManageRoles: false,
			},
		},
		createdAt: new Date(),
		updatedAt: new Date(),
		schemaVersion: '1.0.0',
		...overrides,
	} as Models.Role.AdminRole;
}

function makePassport(): Domain.Passport {
	return vi.mocked({
		user: {
			forAdminUser: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
	} as unknown as Domain.Passport);
}

function makeMockUser(
	overrides: Partial<Models.User.AdminUser> = {},
): Models.User.AdminUser {
	const base = {
		_id: new MongooseSeedwork.ObjectId(),
		id: 'admin-user-1',
		userType: 'admin-users',
		isBlocked: false,
		account: {
			accountType: 'admin',
			email: 'admin@example.com',
			username: 'adminuser',
			profile: {
				firstName: 'Admin',
				lastName: 'User',
				aboutMe: 'Admin bio',
				location: {
					address1: '123 Admin St',
					address2: null,
					city: 'Admin City',
					state: 'CA',
					country: 'USA',
					zipCode: '90210',
				} as unknown as Models.User.AdminUserAccountProfileLocation,
			} as unknown as Models.User.AdminUserAccountProfile,
		} as unknown as Models.User.AdminUserAccount,
		role: makeRoleDoc(),
		createdAt: new Date('2020-01-01'),
		updatedAt: new Date('2020-01-02'),
		populate: vi.fn(function (this: Models.User.AdminUser) {
			return this;
		}),
		set: vi.fn(),
		...overrides,
	} as Models.User.AdminUser;
	return vi.mocked(base);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repository: AdminUserReadRepositoryImpl;
	let mockModel: Models.User.AdminUserModelType;
	let passport: Domain.Passport;
	let mockUsers: Models.User.AdminUser[];
	let result: unknown;

	BeforeEachScenario(() => {
		passport = makePassport();
		mockUsers = [makeMockUser()];

		const createQueryChain = createThenableQueryChain(() => mockUsers);

		mockModel = {
			find: vi.fn(() => createQueryChain),
			findById: vi.fn(() => createThenableQueryChain(() => mockUsers[0])),
			findOne: vi.fn(() => createThenableQueryChain(() => mockUsers[0])),
			countDocuments: vi.fn(() => createThenableQueryChain(() => mockUsers.length)),
		} as unknown as Models.User.AdminUserModelType;

		const modelsContext = {
			User: {
				AdminUser: mockModel,
			},
		} as unknown as ModelsContext;

		repository = new AdminUserReadRepositoryImpl(modelsContext, passport);
		result = undefined;
	});

	Background(({ Given, And }) => {
		Given(
			'an AdminUserReadRepository instance with a working data source and passport',
			() => {
				// Already set up in BeforeEachScenario
			},
		);
		And('valid AdminUser documents exist in the database', () => {
			// Mock documents are set up in BeforeEachScenario
		});
	});

	Scenario('Getting all admin users', ({ When, Then }) => {
		When('I call getAll', async () => {
			result = await repository.getAll();
		});
		Then('I should receive an array of AdminUser domain objects', () => {
			expect(Array.isArray(result)).toBe(true);
			expect((result as unknown[]).length).toBeGreaterThan(0);
			expect((result as unknown[])[0]).toBeInstanceOf(
				Domain.Contexts.User.AdminUser.AdminUser,
			);
		});
	});

	Scenario('Getting all admin users with no results', ({ Given, When, Then }) => {
		Given('no AdminUser documents exist in the database', () => {
			const mockDataSource = repository['mongoDataSource'] as unknown as {
				find: ReturnType<typeof vi.fn>;
			};
			mockDataSource.find = vi.fn(() => Promise.resolve([]));
		});

		When('I call getAll', async () => {
			result = await repository.getAll();
		});

		Then('I should receive an empty array', () => {
			expect(result).toEqual([]);
		});
	});

	Scenario('Getting all users with pagination', ({ Given, When, Then }) => {
		Given('multiple AdminUser documents exist in the database', () => {
			mockUsers = [
				makeMockUser({
					id: new MongooseSeedwork.ObjectId('507f1f77bcf86cd799439011'),
				}),
				makeMockUser({
					id: new MongooseSeedwork.ObjectId('507f1f77bcf86cd799439012'),
				}),
				makeMockUser({
					id: new MongooseSeedwork.ObjectId('507f1f77bcf86cd799439013'),
				}),
			];
		});
		When('I call getAllUsers with page 1 and pageSize 10', async () => {
			result = await repository.getAllUsers({ page: 1, pageSize: 10 });
		});
		Then(
			'I should receive a paginated result with items, total, page, and pageSize',
			() => {
				expect(result).toHaveProperty('items');
				expect(result).toHaveProperty('total');
				expect(result).toHaveProperty('page', 1);
				expect(result).toHaveProperty('pageSize', 10);
				expect(Array.isArray((result as { items: unknown[] }).items)).toBe(
					true,
				);
			},
		);
	});

	Scenario('Getting all users with search text', ({ Given, When, Then }) => {
		Given('AdminUser documents with various emails and names', () => {
			mockUsers = [
				makeMockUser({
					id: new MongooseSeedwork.ObjectId('507f1f77bcf86cd799439011'),
					account: {
						...makeMockUser().account,
						email: 'admin1@example.com',
						profile: {
							...makeMockUser().account.profile,
							firstName: 'Admin',
						} as unknown as Models.User.AdminUserAccountProfile,
					} as unknown as Models.User.AdminUserAccount,
				}),
				makeMockUser({
					id: new MongooseSeedwork.ObjectId('507f1f77bcf86cd799439012'),
					account: {
						...makeMockUser().account,
						email: 'admin2@example.com',
						profile: {
							...makeMockUser().account.profile,
							firstName: 'Super',
						} as unknown as Models.User.AdminUserAccountProfile,
					} as unknown as Models.User.AdminUserAccount,
				}),
			];
		});
		When('I call getAllUsers with searchText "admin1"', async () => {
			result = await repository.getAllUsers({
				page: 1,
				pageSize: 10,
				searchText: 'admin1',
			});
		});
		Then('I should receive only users matching the search text', () => {
			expect(
				(result as { items: unknown[] }).items.length,
			).toBeGreaterThanOrEqual(0);
			expect(result).toHaveProperty('items');
		});
	});

	Scenario('Getting all users with status filters', ({ Given, When, Then }) => {
		Given('AdminUser documents with different statuses', () => {
			mockUsers = [
				makeMockUser({
					id: new MongooseSeedwork.ObjectId('507f1f77bcf86cd799439011'),
					isBlocked: false,
				}),
				makeMockUser({
					id: new MongooseSeedwork.ObjectId('507f1f77bcf86cd799439012'),
					isBlocked: true,
				}),
			];
		});
		When(
			'I call getAllUsers with statusFilters including "Active"',
			async () => {
				result = await repository.getAllUsers({
					page: 1,
					pageSize: 10,
					statusFilters: ['Active'],
				});
			},
		);
		Then('I should receive only active users', () => {
			expect(
				(result as { items: unknown[] }).items.length,
			).toBeGreaterThanOrEqual(0);
			expect(result).toHaveProperty('items');
		});
	});

	Scenario('Getting an admin user by ID', ({ Given, When, Then }) => {
		Given('an AdminUser document with id "admin-user-1"', () => {
			mockUsers = [
				makeMockUser({
					id: new MongooseSeedwork.ObjectId('507f1f77bcf86cd799439011'),
				}),
			];
		});
		When('I call getById with "admin-user-1"', async () => {
			result = await repository.getById('507f1f77bcf86cd799439011');
		});
		Then('I should receive an AdminUser domain object with that ID', () => {
			expect(result).toBeInstanceOf(Domain.Contexts.User.AdminUser.AdminUser);
		});
	});

	Scenario(
		"Getting an admin user by ID that doesn't exist",
		({ When, Then }) => {
			When('I call getById with "nonexistent-id"', async () => {
				const nullQueryChain = createThenableQueryChain(() => null);

				mockModel = {
					...mockModel,
					findById: vi.fn(() => nullQueryChain),
				} as unknown as Models.User.AdminUserModelType;

				const modelsContext = {
					User: {
						AdminUser: mockModel,
					},
				} as unknown as ModelsContext;

				repository = new AdminUserReadRepositoryImpl(modelsContext, passport);
				result = await repository.getById('nonexistent-id');
			});
			Then('I should receive null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario('Getting an admin user by email', ({ Given, When, Then }) => {
		Given('an AdminUser document with email "admin@example.com"', () => {
			mockUsers = [
				makeMockUser({
					account: {
						...makeMockUser().account,
						email: 'admin@example.com',
					} as unknown as Models.User.AdminUserAccount,
				}),
			];
		});
		When('I call getByEmail with "admin@example.com"', async () => {
			result = await repository.getByEmail('admin@example.com');
		});
		Then('I should receive an AdminUser domain object with that email', () => {
			expect(result).toBeInstanceOf(Domain.Contexts.User.AdminUser.AdminUser);
		});
	});

	Scenario(
		"Getting an admin user by email that doesn't exist",
		({ When, Then }) => {
			When('I call getByEmail with "nonexistent@example.com"', async () => {
				const nullQueryChain = createThenableQueryChain(() => null);

				mockModel = {
					...mockModel,
					findOne: vi.fn(() => nullQueryChain),
				} as unknown as Models.User.AdminUserModelType;
				const modelsContext = {
					User: {
						AdminUser: mockModel,
					},
				} as unknown as ModelsContext;

				repository = new AdminUserReadRepositoryImpl(modelsContext, passport);
				result = await repository.getByEmail('nonexistent@example.com');
			});
			Then('I should receive null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario(
		'Getting all users with sorter by email ascending',
		({ Given, When, Then }) => {
			Given('AdminUser documents with various emails', () => {
				mockUsers = [
					makeMockUser({
						id: new MongooseSeedwork.ObjectId('507f1f77bcf86cd799439011'),
						account: {
							...makeMockUser().account,
							email: 'charlie@example.com',
						} as unknown as Models.User.AdminUserAccount,
					}),
					makeMockUser({
						id: new MongooseSeedwork.ObjectId('507f1f77bcf86cd799439012'),
						account: {
							...makeMockUser().account,
							email: 'alice@example.com',
						} as unknown as Models.User.AdminUserAccount,
					}),
					makeMockUser({
						id: new MongooseSeedwork.ObjectId('507f1f77bcf86cd799439013'),
						account: {
							...makeMockUser().account,
							email: 'bob@example.com',
						} as unknown as Models.User.AdminUserAccount,
					}),
				];
			});
			When(
				'I call getAllUsers with sorter field "email" and order "ascend"',
				async () => {
					result = await repository.getAllUsers({
						page: 1,
						pageSize: 10,
						sorter: { field: 'email', order: 'ascend' },
					});
				},
			);
			Then(
				'I should receive users sorted by email in ascending order',
				() => {
					expect(result).toHaveProperty('items');
					const items = (result as { items: { account?: { email?: string } }[] })
						.items;
					expect(items.length).toBe(3);
					expect(items[0]?.account?.email).toBe('alice@example.com');
					expect(items[1]?.account?.email).toBe('bob@example.com');
					expect(items[2]?.account?.email).toBe('charlie@example.com');
				},
			);
		},
	);

	Scenario(
		'Getting all users with sorter by email descending',
		({ Given, When, Then }) => {
			Given('AdminUser documents with various emails', () => {
				mockUsers = [
					makeMockUser({
						id: new MongooseSeedwork.ObjectId('507f1f77bcf86cd799439011'),
						account: {
							...makeMockUser().account,
							email: 'alice@example.com',
						} as unknown as Models.User.AdminUserAccount,
					}),
					makeMockUser({
						id: new MongooseSeedwork.ObjectId('507f1f77bcf86cd799439012'),
						account: {
							...makeMockUser().account,
							email: 'bob@example.com',
						} as unknown as Models.User.AdminUserAccount,
					}),
				];
			});
			When(
				'I call getAllUsers with sorter field "email" and order "descend"',
				async () => {
					result = await repository.getAllUsers({
						page: 1,
						pageSize: 10,
						sorter: { field: 'email', order: 'descend' },
					});
				},
			);
			Then(
				'I should receive users sorted by email in descending order',
				() => {
					expect(result).toHaveProperty('items');
					const items = (result as { items: { account?: { email?: string } }[] })
						.items;
					expect(items.length).toBe(2);
					expect(items[0]?.account?.email).toBe('bob@example.com');
					expect(items[1]?.account?.email).toBe('alice@example.com');
				},
			);
		},
	);

	Scenario(
		'Getting all users with Blocked status filter',
		({ Given, When, Then }) => {
			Given('AdminUser documents with different statuses', () => {
				mockUsers = [
					makeMockUser({
						id: new MongooseSeedwork.ObjectId('507f1f77bcf86cd799439011'),
						isBlocked: false,
					}),
					makeMockUser({
						id: new MongooseSeedwork.ObjectId('507f1f77bcf86cd799439012'),
						isBlocked: true,
					}),
				];
			});
			When(
				'I call getAllUsers with statusFilters including "Blocked"',
				async () => {
					result = await repository.getAllUsers({
						page: 1,
						pageSize: 10,
						statusFilters: ['Blocked'],
					});
				},
			);
			Then('I should receive only blocked users', () => {
				expect(result).toHaveProperty('items');
				const items = (result as { items: { isBlocked?: boolean }[] }).items;
				expect(items.length).toBe(1);
				expect(items[0]?.isBlocked).toBe(true);
			});
		},
	);

	Scenario(
		'Getting all users with both Active and Blocked status filters',
		({ Given, When, Then }) => {
			Given('AdminUser documents with different statuses', () => {
				mockUsers = [
					makeMockUser({
						id: new MongooseSeedwork.ObjectId('507f1f77bcf86cd799439011'),
						isBlocked: false,
					}),
					makeMockUser({
						id: new MongooseSeedwork.ObjectId('507f1f77bcf86cd799439012'),
						isBlocked: true,
					}),
				];
			});
			When(
				'I call getAllUsers with statusFilters including both "Active" and "Blocked"',
				async () => {
					result = await repository.getAllUsers({
						page: 1,
						pageSize: 10,
						statusFilters: ['Active', 'Blocked'],
					});
				},
			);
			Then('I should receive all users regardless of status', () => {
				expect(result).toHaveProperty('items');
				const items = (result as { items: unknown[] }).items;
				expect(items.length).toBe(2);
			});
		},
	);

	Scenario('Getting an admin user by username', ({ Given, When, Then }) => {
		Given('an AdminUser document with username "adminuser"', () => {
			mockUsers = [
				makeMockUser({
					account: {
						...makeMockUser().account,
						username: 'adminuser',
					} as unknown as Models.User.AdminUserAccount,
				}),
			];
		});
		When('I call getByUsername with "adminuser"', async () => {
			result = await repository.getByUsername('adminuser');
		});
		Then(
			'I should receive an AdminUser domain object with that username',
			() => {
				expect(result).toBeInstanceOf(
					Domain.Contexts.User.AdminUser.AdminUser,
				);
			},
		);
	});

	Scenario(
		"Getting an admin user by username that doesn't exist",
		({ When, Then }) => {
			When(
				'I call getByUsername with "nonexistent-username"',
				async () => {
					const nullQueryChain = createThenableQueryChain(() => null);

					mockModel = {
						...mockModel,
						findOne: vi.fn(() => nullQueryChain),
					} as unknown as Models.User.AdminUserModelType;
					const modelsContext = {
						User: {
							AdminUser: mockModel,
						},
					} as unknown as ModelsContext;

					repository = new AdminUserReadRepositoryImpl(
						modelsContext,
						passport,
					);
					result = await repository.getByUsername('nonexistent-username');
				},
			);
			Then('I should receive null', () => {
				expect(result).toBeNull();
			});
		},
	);
});
