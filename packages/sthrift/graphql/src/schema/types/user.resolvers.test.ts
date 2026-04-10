// @ts-nocheck - Test file with simplified mocks
import type { GraphQLResolveInfo } from 'graphql';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { GraphContext } from '../../init/context.ts';
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
			userType: 'personal-user',
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
					User: {
						queryById: vi.fn(),
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
			Given('a verified personal user is authenticated', () => {
				mockContext.applicationServices.verifiedUser = {
					verifiedJwt: { email: 'user@test.com' },
				} as { verifiedJwt: { email: string } };
				vi.mocked(
					mockContext.applicationServices.User.AdminUser.queryByEmail,
				).mockResolvedValue(null);
				vi.mocked(
					mockContext.applicationServices.User.PersonalUser.queryByEmail,
				).mockResolvedValue(mockPersonalUser);
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
				expect(result).toEqual(mockPersonalUser);
			});
		},
	);

	Scenario(
		'Query currentUser throws error for admin users',
		({ Given, When, Then }) => {
			let error: Error | undefined;

			Given('a verified admin user is authenticated', () => {
				mockContext.applicationServices.verifiedUser = {
					verifiedJwt: { email: 'admin@test.com' },
				} as { verifiedJwt: { email: string } };
				vi.mocked(
					mockContext.applicationServices.User.AdminUser.queryByEmail,
				).mockResolvedValue(mockAdminUser);
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

			Then(
				'it should throw "Forbidden: Admin users cannot use currentUser. Use currentAdminUser instead."',
				() => {
					expect(error?.message).toBe(
						'Forbidden: Admin users cannot use currentUser. Use currentAdminUser instead.',
					);
				},
			);
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
				).mockResolvedValue(null);
				vi.mocked(
					mockContext.applicationServices.User.PersonalUser.queryByEmail,
				).mockResolvedValue(null);
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
					).mockResolvedValue(null);
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
				userType: 'personal-user',
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
				).mockResolvedValue(null);
				vi.mocked(
					mockContext.applicationServices.User.PersonalUser.queryByEmail,
				).mockResolvedValue(null);
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
		'Query currentUserAndCreateIfNotExists throws error for admin users',
		({ Given, When, Then }) => {
			let error: Error | undefined;

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

			Then(
				'it should throw "Forbidden: Admin users cannot use currentUserAndCreateIfNotExists. Use currentAdminUser instead."',
				() => {
					expect(error?.message).toBe(
						'Forbidden: Admin users cannot use currentUserAndCreateIfNotExists. Use currentAdminUser instead.',
					);
				},
			);
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
				).mockResolvedValue(null);
				vi.mocked(
					mockContext.applicationServices.User.PersonalUser.queryByEmail,
				).mockResolvedValue(null);
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

	Scenario(
		'User union resolveType returns PersonalUser',
		({ Given, When, Then }) => {
			Given('a user object with userType personal-user', () => {
				result = { id: 'personal-id-456', userType: 'personal-user' };
			});

			When('__resolveType is called', async () => {
				result = await userUnionResolvers.User?.__resolveType?.(
					result,
				);
			});

			Then('it should return "PersonalUser"', () => {
				expect(result).toBe('PersonalUser');
			});
		},
	);

	Scenario(
		'User union resolveType throws error for invalid type',
		({ Given, When, Then }) => {
			let error: Error | undefined;

			Given('a user object with invalid userType', () => {
				result = { id: 'invalid-user-type' };
			});

			When('__resolveType is called', async () => {
				try {
					await userUnionResolvers.User?.__resolveType?.(result, mockContext);
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
