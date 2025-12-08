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
	let mockInvalidUserType: {
		id: string;
		userType: string;
	};

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

		mockInvalidUserType = {
			id: 'invalid-user-type',
			userType: 'invalid-type',
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
					await userUnionResolvers.Query?.allSystemUsers?.(
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
					await userUnionResolvers.Query?.allSystemUsers?.(
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
				result = { id: 'admin-id-123' , userType: 'admin-user'};
				vi.mocked(
					mockContext.applicationServices.User.User.queryById,
				).mockResolvedValue(mockAdminUser);
			});

			When('__resolveType is called', async () => {
				result = await userUnionResolvers.User?.__resolveType?.(
					result,
				);
			});

			Then('it should return "AdminUser"', () => {
				expect(result).toBe('AdminUser');
			});
		},
	);

	Scenario(
		'User union resolveType returns PersonalUser',
		({ Given, When, Then }) => {
			Given('a user object with userType personal-user', () => {
				result = { id: 'personal-id-456', userType: 'personal-user' };
				vi.mocked(
					mockContext.applicationServices.User.User.queryById,
				).mockResolvedValue(mockPersonalUser);
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
					vi.mocked(
						mockContext.applicationServices.User.User.queryById,
					).mockResolvedValue(mockInvalidUserType);
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
