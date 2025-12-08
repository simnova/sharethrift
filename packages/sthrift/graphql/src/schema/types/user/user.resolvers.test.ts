// @ts-nocheck - Test file with simplified mocks
import type { GraphQLResolveInfo } from 'graphql';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { GraphContext } from '../../../init/context.ts';
import userUnionResolvers from './user.resolvers.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/user.resolvers.feature'),
);

test.for(feature, ({ Background, Scenario, BeforeEachScenario }) => {
	let mockContext: GraphContext;
	let mockAdminUser: {
		id: string;
		email: string;
		userType: string;
		role: { permissions: { userPermissions: { canViewAllUsers: boolean } } };
	};
	let mockPersonalUser: {
		id: string;
		email: string;
		userType: string;
	};
	let result: unknown;

	BeforeEachScenario(() => {
		mockAdminUser = {
			id: 'admin-id-123',
			email: 'admin@test.com',
			userType: 'admin-user',
			role: {
				permissions: {
					userPermissions: { canViewAllUsers: true },
				},
			},
		};

		mockPersonalUser = {
			id: 'personal-id-456',
			email: 'user@test.com',
			userType: 'personal-users',
		};

		// Initialize mockContext with mock data configured
		mockContext = {
			applicationServices: {
				verifiedUser: undefined,
				User: {
					AdminUser: {
						queryByEmail: vi.fn(),
						queryById: vi.fn(),
						getAllUsers: vi.fn().mockResolvedValue({
							items: [mockAdminUser],
							total: 1,
							page: 1,
							pageSize: 10,
						}),
					},
					PersonalUser: {
						queryByEmail: vi.fn(),
						queryById: vi.fn(),
						createIfNotExists: vi.fn(),
						getAllUsers: vi.fn().mockResolvedValue({
							items: [mockPersonalUser],
							total: 1,
							page: 1,
							pageSize: 10,
						}),
					},
				},
			},
		} as unknown as GraphContext;

		result = undefined;
	});

	Background(({ Given }) => {
		Given('a GraphQL context with application services', () => {
			// mockContext properly initialized in BeforeEachScenario
		});
	});

	Scenario(
		'Query currentUser returns authenticated user',
		({ Given, When, Then }) => {
			Given('a verified admin user is authenticated', () => {
				mockContext.applicationServices.verifiedUser = {
					verifiedJwt: { email: 'admin@test.com' },
				} as { verifiedJwt: { email: string } };
				vi.mocked(
					mockContext.applicationServices.User.AdminUser.queryByEmail,
				).mockResolvedValue(mockAdminUser);
			});

			When('currentUser query is called', async () => {
				result = await userUnionResolvers.Query?.currentUser?.(
					{},
					{},
					mockContext,
					{} as GraphQLResolveInfo,
				);
			});

			Then('it should return the authenticated user', () => {
				expect(result).toEqual(mockAdminUser);
			});
		},
	);

	Scenario(
		'Query currentUser throws error when not authenticated',
		({ Given, When, Then }) => {
			let error: Error | undefined;

			Given('no user is authenticated', () => {
				mockContext.applicationServices.verifiedUser = undefined;
			});

			When('currentUser query is called', async () => {
				try {
					await userUnionResolvers.Query?.currentUser?.(
						{},
						{},
						mockContext,
						{} as GraphQLResolveInfo,
					);
				} catch (e) {
					error = e as Error;
				}
			});

			Then('it should throw "Unauthorized: Authentication required"', () => {
				expect(error?.message).toContain('Unauthorized');
			});
		},
	);

	Scenario(
		'Query currentUser throws error when user not found',
		({ Given, When, Then }) => {
			let error: Error | undefined;

			Given('a verified user is authenticated but not in database', () => {
				mockContext.applicationServices.verifiedUser = {
					verifiedJwt: { email: 'notfound@test.com' },
				} as { verifiedJwt: { email: string } };
				vi.mocked(
					mockContext.applicationServices.User.AdminUser.queryByEmail,
				).mockRejectedValue(new Error('Not found'));
				vi.mocked(
					mockContext.applicationServices.User.PersonalUser.queryByEmail,
				).mockRejectedValue(new Error('Not found'));
			});

			When('currentUser query is called', async () => {
				try {
					await userUnionResolvers.Query?.currentUser?.(
						{},
						{},
						mockContext,
						{} as GraphQLResolveInfo,
					);
				} catch (e) {
					error = e as Error;
				}
			});

			Then('it should throw "User not found"', () => {
				expect(error?.message).toContain('User not found');
			});
		},
	);

	Scenario(
		'Query currentUserAndCreateIfNotExists returns existing user',
		({ Given, When, Then }) => {
			Given(
				'a verified personal user is authenticated and exists in database',
				() => {
					mockContext.applicationServices.verifiedUser = {
						verifiedJwt: {
							email: 'user@test.com',
							given_name: 'John',
							family_name: 'Doe',
						},
					} as {
						verifiedJwt: {
							email: string;
							given_name: string;
							family_name: string;
						};
					};
					vi.mocked(
						mockContext.applicationServices.User.AdminUser.queryByEmail,
					).mockRejectedValue(new Error('Not found'));
					vi.mocked(
						mockContext.applicationServices.User.PersonalUser.queryByEmail,
					).mockResolvedValue(mockPersonalUser);
				},
			);

			When('currentUserAndCreateIfNotExists query is called', async () => {
				result = await userUnionResolvers.Query?.currentUserAndCreateIfNotExists?.(
					{},
					{},
					mockContext,
					{} as GraphQLResolveInfo,
				);
			});

			Then('it should return the existing user', () => {
				expect(result).toEqual(mockPersonalUser);
				expect(
					mockContext.applicationServices.User.PersonalUser.createIfNotExists,
				).not.toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Query currentUserAndCreateIfNotExists creates new PersonalUser',
		({ Given, When, Then }) => {
			const newUser = {
				id: 'new-user-123',
				email: 'newuser@test.com',
				userType: 'personal-users',
			};

			Given('a verified user is authenticated but not in database', () => {
				mockContext.applicationServices.verifiedUser = {
					verifiedJwt: {
						email: 'newuser@test.com',
						given_name: 'Jane',
						family_name: 'Smith',
					},
				} as {
					verifiedJwt: {
						email: string;
						given_name: string;
						family_name: string;
					};
				};
				vi.mocked(
					mockContext.applicationServices.User.AdminUser.queryByEmail,
				).mockRejectedValue(new Error('Not found'));
				vi.mocked(
					mockContext.applicationServices.User.PersonalUser.queryByEmail,
				).mockRejectedValue(new Error('Not found'));
				mockContext.applicationServices.User.PersonalUser.createIfNotExists =
					vi.fn().mockResolvedValue(newUser);
			});

			When('currentUserAndCreateIfNotExists query is called', async () => {
				result = await userUnionResolvers.Query?.currentUserAndCreateIfNotExists?.(
					{},
					{},
					mockContext,
					{} as GraphQLResolveInfo,
				);
			});

			Then('it should create and return a new PersonalUser', () => {
				expect(result).toEqual(newUser);
				expect(
					mockContext.applicationServices.User.PersonalUser.createIfNotExists,
				).toHaveBeenCalledWith({
					email: 'newuser@test.com',
					firstName: 'Jane',
					lastName: 'Smith',
				});
			});
		},
	);

	Scenario(
		'Query currentUserAndCreateIfNotExists returns existing AdminUser',
		({ Given, When, Then }) => {
			Given('a verified admin user is authenticated', () => {
				mockContext.applicationServices.verifiedUser = {
					verifiedJwt: {
						email: 'admin@test.com',
						given_name: 'Admin',
						family_name: 'User',
					},
				} as {
					verifiedJwt: {
						email: string;
						given_name: string;
						family_name: string;
					};
				};
				vi.mocked(
					mockContext.applicationServices.User.AdminUser.queryByEmail,
				).mockResolvedValue(mockAdminUser);
			});

			When('currentUserAndCreateIfNotExists query is called', async () => {
				result = await userUnionResolvers.Query?.currentUserAndCreateIfNotExists?.(
					{},
					{},
					mockContext,
					{} as GraphQLResolveInfo,
				);
			});

			Then('it should return the existing admin user', () => {
				expect(result).toEqual(mockAdminUser);
			});
		},
	);

	Scenario(
		'Query currentUserAndCreateIfNotExists throws error when not authenticated',
		({ Given, When, Then }) => {
			let error: Error | undefined;

			Given('no user is authenticated', () => {
				mockContext.applicationServices.verifiedUser = undefined;
			});

			When('currentUserAndCreateIfNotExists query is called', async () => {
				try {
					await userUnionResolvers.Query?.currentUserAndCreateIfNotExists?.(
						{},
						{},
						mockContext,
						{} as GraphQLResolveInfo,
					);
				} catch (e) {
					error = e as Error;
				}
			});

			Then('it should throw "Unauthorized: Authentication required"', () => {
				expect(error?.message).toContain('Unauthorized');
			});
		},
	);

	Scenario(
		'Query currentUserAndCreateIfNotExists handles creation failure',
		({ Given, And, When, Then }) => {
			let error: Error | undefined;

			Given('a verified user is authenticated but not in database', () => {
				mockContext.applicationServices.verifiedUser = {
					verifiedJwt: {
						email: 'newuser@test.com',
						given_name: 'Test',
						family_name: 'User',
					},
				} as {
					verifiedJwt: {
						email: string;
						given_name: string;
						family_name: string;
					};
				};
				vi.mocked(
					mockContext.applicationServices.User.AdminUser.queryByEmail,
				).mockRejectedValue(new Error('Not found'));
				vi.mocked(
					mockContext.applicationServices.User.PersonalUser.queryByEmail,
				).mockRejectedValue(new Error('Not found'));
			});

			And('the createIfNotExists operation fails', () => {
				mockContext.applicationServices.User.PersonalUser.createIfNotExists =
					vi.fn().mockRejectedValue(new Error('Database connection failed'));
			});

			When('currentUserAndCreateIfNotExists query is called', async () => {
				try {
					await userUnionResolvers.Query?.currentUserAndCreateIfNotExists?.(
						{},
						{},
						mockContext,
						{} as GraphQLResolveInfo,
					);
				} catch (e) {
					error = e as Error;
				}
			});

			Then('it should propagate the error from application service', () => {
				expect(error).toBeDefined();
				expect(error?.message).toBe('Database connection failed');
			});
		},
	);

	Scenario('Query userById returns AdminUser', ({ When, Then }) => {
		When('userById query is called with an admin user ID', async () => {
			vi.mocked(
				mockContext.applicationServices.User.AdminUser.queryById,
			).mockResolvedValue(mockAdminUser);
			result = await userUnionResolvers.Query?.userById?.(
				{},
				{ id: 'admin-id-123' },
				mockContext,
				{} as GraphQLResolveInfo,
			);
		});

		Then('it should return the AdminUser entity', () => {
			expect(result).toEqual(mockAdminUser);
		});
	});

	Scenario('Query userById returns PersonalUser', ({ When, Then }) => {
		When('userById query is called with a personal user ID', async () => {
			vi.mocked(
				mockContext.applicationServices.User.AdminUser.queryById,
			).mockRejectedValue(new Error('Not found'));
			vi.mocked(
				mockContext.applicationServices.User.PersonalUser.queryById,
			).mockResolvedValue(mockPersonalUser);
			result = await userUnionResolvers.Query?.userById?.(
				{},
				{ id: 'personal-id-456' },
				mockContext,
				{} as GraphQLResolveInfo,
			);
		});

		Then('it should return the PersonalUser entity', () => {
			expect(result).toEqual(mockPersonalUser);
		});
	});

	Scenario(
		'Query userById returns null when user not found',
		({ When, Then }) => {
			When('userById query is called with a non-existent ID', async () => {
				vi.mocked(
					mockContext.applicationServices.User.AdminUser.queryById,
				).mockRejectedValue(new Error('Not found'));
				vi.mocked(
					mockContext.applicationServices.User.PersonalUser.queryById,
				).mockRejectedValue(new Error('Not found'));
				result = await userUnionResolvers.Query?.userById?.(
					{},
					{ id: 'nonexistent' },
					mockContext,
					{} as GraphQLResolveInfo,
				);
			});

			Then('it should return null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario(
		'Query allSystemUsers returns all users for admin',
		({ Given, When, Then }) => {
			Given('an authenticated admin with canViewAllUsers permission', () => {
				mockContext.applicationServices.verifiedUser = {
					verifiedJwt: { email: 'admin@test.com' },
				} as { verifiedJwt: { email: string } };
				vi.mocked(
					mockContext.applicationServices.User.AdminUser.queryByEmail,
				).mockResolvedValue(mockAdminUser);
			});

			When('allSystemUsers query is called', async () => {
				result = await userUnionResolvers.Query?.allSystemUsers?.(
					{},
					{
						page: 1,
						pageSize: 10,
					},
					mockContext,
					{} as GraphQLResolveInfo,
				);
			});

			Then('it should return both personal and admin users', () => {
				expect(result.items).toHaveLength(2);
				expect(result.total).toBe(2);
			});
		},
	);

	Scenario(
		'Query allSystemUsers filters by user type',
		({ Given, When, Then }) => {
			Given('an authenticated admin with canViewAllUsers permission', () => {
				mockContext.applicationServices.verifiedUser = {
					verifiedJwt: { email: 'admin@test.com' },
				} as { verifiedJwt: { email: string } };
				vi.mocked(
					mockContext.applicationServices.User.AdminUser.queryByEmail,
				).mockResolvedValue(mockAdminUser);
			});

			When(
				'allSystemUsers query is called with personal user type filter',
				async () => {
					result = await userUnionResolvers.Query?.allSystemUsers?.(
						{},
						{
							page: 1,
							pageSize: 10,
							userTypeFilter: ['personal'],
						},
						mockContext,
						{} as GraphQLResolveInfo,
					);
				},
			);

			Then('it should return only personal users', () => {
				expect(result.items).toHaveLength(1);
				expect(result.items[0]).toEqual(mockPersonalUser);
			});
		},
	);

	Scenario(
		'Query allSystemUsers throws error without permission',
		({ Given, When, Then }) => {
			let error: Error | undefined;

			Given('an authenticated admin without canViewAllUsers permission', () => {
				mockContext.applicationServices.verifiedUser = {
					verifiedJwt: { email: 'admin@test.com' },
				};
				const limitedAdmin = {
					...mockAdminUser,
					role: {
						permissions: { userPermissions: { canViewAllUsers: false } },
					},
				};
				vi.mocked(
					mockContext.applicationServices.User.AdminUser.queryByEmail,
				).mockResolvedValue(limitedAdmin);
			});

			When('allSystemUsers query is called', async () => {
				try {
					await (userUnionResolvers.Query?.allSystemUsers)?.(
						{},
						{
							page: 1,
							pageSize: 10,
						},
						mockContext,
						{} as GraphQLResolveInfo,
					);
				} catch (e) {
					error = e as Error;
				}
			});

			Then('it should throw "Forbidden" error', () => {
				expect(error?.message).toContain('Forbidden');
			});
		},
	);

	Scenario(
		'Query allSystemUsers throws error when not authenticated',
		({ Given, When, Then }) => {
			let error: Error | undefined;

			Given('no user is authenticated', () => {
				mockContext.applicationServices.verifiedUser = undefined;
			});

			When('allSystemUsers query is called', async () => {
				try {
					await (userUnionResolvers.Query?.allSystemUsers)?.(
						{},
						{
							page: 1,
							pageSize: 10,
						},
						mockContext,
						{} as GraphQLResolveInfo,
					);
				} catch (e) {
					error = e as Error;
				}
			});

			Then('it should throw "Unauthorized: Authentication required"', () => {
				expect(error?.message).toContain('Unauthorized');
			});
		},
	);

	Scenario(
		'User union resolveType returns AdminUser',
		({ Given, When, Then }) => {
			Given('a user object with userType admin-user', () => {
				result = { userType: 'admin-user' };
			});

			When('__resolveType is called', () => {
				result = (userUnionResolvers.User?.__resolveType)?.(result);
			});

			Then('it should return "AdminUser"', () => {
				expect(result).toBe('AdminUser');
			});
		},
	);

		Scenario(
		'User union resolveType returns PersonalUser',
		({ Given, When, Then }) => {
			Given('a user object with userType personal-users', () => {
				result = { userType: 'personal-users' };
			});

			When('__resolveType is called', () => {
				result = userUnionResolvers.User?.__resolveType?.(result);
			});			Then('it should return "PersonalUser"', () => {
				expect(result).toBe('PersonalUser');
			});
		},
	);

	Scenario(
		'User union resolveType throws error for invalid type',
		({ Given, When, Then }) => {
			let error: Error | undefined;

			Given('a user object with invalid userType', () => {
				result = { userType: 'invalid-type' };
			});

			When('__resolveType is called', () => {
				try {
					userUnionResolvers.User?.__resolveType?.(result);
				} catch (e) {
					error = e as Error;
				}
			});

			Then('it should throw "Unable to resolve User union type"', () => {
				expect(error?.message).toContain('Unable to resolve User union type');
			});
		},
	);
});
