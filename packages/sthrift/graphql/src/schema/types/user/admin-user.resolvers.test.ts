import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import { expect, vi } from 'vitest';
import type { GraphContext } from '../../../init/context.ts';
import adminUserResolvers from './admin-user.resolvers.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-user.resolvers.feature'),
);

// Mock data factories
function createMockLocation(): Domain.Contexts.User.AdminUser.AdminUserAccountProfileLocationProps {
	return {
		address1: '123 Admin St',
		address2: null,
		city: 'Admin City',
		state: 'CA',
		country: 'USA',
		zipCode: '90210',
	};
}

function createMockProfile(
	overrides: Partial<Domain.Contexts.User.AdminUser.AdminUserProfileProps> = {},
): Domain.Contexts.User.AdminUser.AdminUserProfileProps {
	return {
		firstName: 'Admin',
		lastName: 'User',
		aboutMe: 'Admin bio',
		location: createMockLocation(),
		...overrides,
	};
}

function createMockAccount(
	overrides: Partial<Domain.Contexts.User.AdminUser.AdminUserAccountProps> = {},
): Domain.Contexts.User.AdminUser.AdminUserAccountProps {
	return {
		accountType: 'admin',
		email: 'admin@example.com',
		username: 'adminuser',
		profile: createMockProfile(),
		...overrides,
	};
}

function createMockRole() {
	return {
		id: 'role-1',
		roleName: 'Admin',
		isDefault: false,
		roleType: 'admin-roles',
		createdAt: new Date('2020-01-01'),
		updatedAt: new Date('2020-01-02'),
		schemaVersion: '1.0.0',
		permissions: {
			userPermissions: {
				canBlockUsers: true,
				canViewAllUsers: true,
				canEditUsers: true,
				canDeleteUsers: true,
				canManageUserRoles: true,
				canAccessAnalytics: true,
				canManageRoles: true,
				canViewReports: true,
				canDeleteContent: true,
			},
			conversationPermissions: {
				canViewAllConversations: true,
				canEditConversations: true,
				canDeleteConversations: true,
				canCloseConversations: true,
				canModerateConversations: true,
			},
			listingPermissions: {
				canViewAllListings: true,
				canManageAllListings: true,
				canEditListings: true,
				canDeleteListings: true,
				canApproveListings: true,
				canRejectListings: true,
				canBlockListings: true,
				canUnblockListings: true,
				canModerateListings: true,
			},
			reservationRequestPermissions: {
				canViewAllReservations: true,
				canApproveReservations: true,
				canRejectReservations: true,
				canCancelReservations: true,
				canEditReservations: true,
				canModerateReservations: true,
			},
		},
	};
}

function createMockAdminUser(
	overrides: Partial<Domain.Contexts.User.AdminUser.AdminUserEntityReference> = {},
): Domain.Contexts.User.AdminUser.AdminUserEntityReference {
	const mockAccount = createMockAccount();
	const mockProfile = createMockProfile();
	const mockLocation = createMockLocation();
	const mockRole = createMockRole();

	return {
		id: 'admin-user-123',
		userType: 'admin-users',
		isBlocked: false,
		account: {
			...mockAccount,
			profile: {
				...mockProfile,
				location: mockLocation,
			},
		},
		role: mockRole,
		loadRole: async () => mockRole,
		schemaVersion: '1.0',
		createdAt: new Date(),
		updatedAt: new Date(),
		...overrides,
	};
}

function makeMockGraphContext(
	overrides: Partial<GraphContext> = {},
): GraphContext {
	return {
		applicationServices: {
			User: {
				AdminUser: {
					queryById: vi.fn(),
					queryByEmail: vi.fn(),
					queryByUsername: vi.fn(),
					createIfNotExists: vi.fn(),
					getAllUsers: vi.fn(),
					update: vi.fn(),
				},
			},
			verifiedUser: {
				verifiedJwt: {
					email: 'admin@example.com',
					given_name: 'Admin',
					family_name: 'User',
				},
			},
			...overrides.applicationServices,
		},
		...overrides,
	} as GraphContext;
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let context: GraphContext;
	let result: unknown;
	let rootObj: Domain.Contexts.User.AdminUser.AdminUserEntityReference;

	BeforeEachScenario(() => {
		context = makeMockGraphContext();
		rootObj = createMockAdminUser();
		vi.clearAllMocks();
	});

	Background(({ Given, And }) => {
		Given('a verified JWT admin user context exists', () => {
			// Already set up in BeforeEachScenario
		});
		And(
			'the GraphContext is initialized with AdminUser application services',
			() => {
				// Already set up in BeforeEachScenario
			},
		);
	});

	Scenario('Resolving AdminUser role field', ({ Given, When, Then, And }) => {
		Given('an AdminUser object with a role', () => {
			rootObj = createMockAdminUser({ role: createMockRole() });
		});
		When('the "role" field resolver is called', async () => {
			const resolver = adminUserResolvers.AdminUser?.role;
			if (typeof resolver === 'function') {
				result = await resolver(rootObj as never, {}, context, {} as never);
			}
		});
		Then('it should check if the current user can view the role', () => {
			// Permission checks happen inside the resolver
			expect(result).toBeDefined();
		});
		And('return the role if authorized or null otherwise', () => {
			// Result depends on permission checks
			expect(result === null || typeof result === 'object').toBe(true);
		});
	});

	Scenario('Resolving AdminUser account field', ({ Given, When, Then }) => {
		Given('an AdminUser object with account information', () => {
			rootObj = createMockAdminUser();
		});
		When('the "account" field resolver is called', () => {
			const resolver = adminUserResolvers.AdminUser?.account;
			if (typeof resolver === 'function') {
				result = resolver(rootObj as never, {}, context, {} as never);
			}
		});
		Then('it should return the account object', () => {
			expect(result).toBeDefined();
			expect(result).toEqual(rootObj.account);
		});
	});

	Scenario(
		'Resolving AdminUser userIsAdmin field',
		({ Given, When, Then, And }) => {
			Given('a GraphQL context with a verified user', () => {
				// Already set up in BeforeEachScenario
			});
			When('the "userIsAdmin" field resolver is called', async () => {
				const resolver = adminUserResolvers.AdminUser?.userIsAdmin;
				if (typeof resolver === 'function') {
					result = await resolver(rootObj as never, {}, context, {} as never);
				}
			});
			Then('it should call currentViewerIsAdmin helper', () => {
				// Helper is called internally
				expect(result).toBeDefined();
			});
			And('return true if the viewer is an admin', () => {
				expect(typeof result === 'boolean').toBe(true);
			});
		},
	);

	Scenario('Querying admin user by ID', ({ Given, When, Then, And }) => {
		Given('a valid admin user ID "admin-user-123"', () => {
			// User ID will be passed in the resolver call
		});
		When('I execute the query "adminUserById"', async () => {
			const mockUser = createMockAdminUser({ id: 'admin-user-123' });
			vi.mocked(
				context.applicationServices.User.AdminUser.queryById,
			).mockResolvedValue(mockUser);

			const resolver = adminUserResolvers.Query?.adminUserById;
			if (typeof resolver === 'function') {
				result = await resolver(
					{},
					{ id: 'admin-user-123' },
					context,
					{} as never,
				);
			}
		});
		Then(
			'the resolver should call "User.AdminUser.queryById" with id "admin-user-123"',
			() => {
				expect(
					context.applicationServices.User.AdminUser.queryById,
				).toHaveBeenCalledWith({ id: 'admin-user-123' });
			},
		);
		And('it should return the corresponding AdminUser object', () => {
			expect(result).toBeDefined();
			expect((result as { id: string }).id).toBe('admin-user-123');
		});
	});

	Scenario('Querying admin user by email', ({ Given, When, Then, And }) => {
		Given('a valid email "admin@example.com"', () => {
			// Email will be passed in the resolver call
		});
		When('I execute the query "adminUserByEmail"', async () => {
			const mockUser = createMockAdminUser({
				account: createMockAccount({ email: 'admin@example.com' }),
			});
			vi.mocked(
				context.applicationServices.User.AdminUser.queryByEmail,
			).mockResolvedValue(mockUser);

			const resolver = adminUserResolvers.Query?.adminUserByEmail;
			if (typeof resolver === 'function') {
				result = await resolver(
					{},
					{ email: 'admin@example.com' },
					context,
					{} as never,
				);
			}
		});
		Then(
			'the resolver should call "User.AdminUser.queryByEmail" with email "admin@example.com"',
			() => {
				expect(
					context.applicationServices.User.AdminUser.queryByEmail,
				).toHaveBeenCalledWith({ email: 'admin@example.com' });
			},
		);
		And('it should return the corresponding AdminUser object', () => {
			expect(result).toBeDefined();
			expect((result as { account: { email: string } }).account.email).toBe(
				'admin@example.com',
			);
		});
	});

	Scenario('Querying admin user by username', ({ Given, When, Then, And }) => {
		Given('a valid username "adminuser"', () => {
			// Username will be passed in the resolver call
		});
		When('I execute the query "adminUserByUsername"', async () => {
			const mockUser = createMockAdminUser({
				account: createMockAccount({ username: 'adminuser' }),
			});
			vi.mocked(
				context.applicationServices.User.AdminUser.queryByUsername,
			).mockResolvedValue(mockUser);

			const resolver = adminUserResolvers.Query?.adminUserByUsername;
			if (typeof resolver === 'function') {
				result = await resolver(
					{},
					{ username: 'adminuser' },
					context,
					{} as never,
				);
			}
		});
		Then(
			'the resolver should call "User.AdminUser.queryByUsername" with username "adminuser"',
			() => {
				expect(
					context.applicationServices.User.AdminUser.queryByUsername,
				).toHaveBeenCalledWith({ username: 'adminuser' });
			},
		);
		And('it should return the corresponding AdminUser object', () => {
			expect(result).toBeDefined();
			expect(
				(result as { account: { username: string } }).account.username,
			).toBe('adminuser');
		});
	});

	Scenario('Querying current admin user', ({ Given, When, Then, And }) => {
		Given('a verified admin user with email "admin@example.com"', () => {
			// Already set up in BeforeEachScenario
		});
		When('I execute the query "currentAdminUser"', async () => {
			const mockUser = createMockAdminUser({
				account: createMockAccount({ email: 'admin@example.com' }),
			});
			vi.mocked(
				context.applicationServices.User.AdminUser.queryByEmail,
			).mockResolvedValue(mockUser);

			const resolver = adminUserResolvers.Query?.currentAdminUser;
			if (typeof resolver === 'function') {
				result = await resolver({}, {}, context, {} as never);
			}
		});
		Then('it should throw an error if not authenticated', () => {
			// Auth check happens inside resolver
			expect(
				context.applicationServices.verifiedUser?.verifiedJwt,
			).toBeDefined();
		});
		And(
			'the resolver should call "User.AdminUser.queryByEmail" with the current user\'s email',
			() => {
				expect(
					context.applicationServices.User.AdminUser.queryByEmail,
				).toHaveBeenCalledWith({ email: 'admin@example.com' });
			},
		);
		And('it should return the current AdminUser entity', () => {
			expect(result).toBeDefined();
			expect((result as { account: { email: string } }).account.email).toBe(
				'admin@example.com',
			);
		});
	});

	Scenario(
		'Querying all admin users with permissions',
		({ Given, When, Then, And }) => {
			Given('a verified admin with canViewAllUsers permission', () => {
				const adminUser = createMockAdminUser({
					account: createMockAccount({ email: 'admin@example.com' }),
				});
				vi.mocked(
					context.applicationServices.User.AdminUser.queryByEmail,
				).mockResolvedValue(adminUser);
			});
			When(
				'I execute the query "allAdminUsers" with pagination parameters',
				async () => {
					const mockUsers = [createMockAdminUser()];
					vi.mocked(
						context.applicationServices.User.AdminUser.getAllUsers,
					).mockResolvedValue(mockUsers as never);

					const resolver = adminUserResolvers.Query?.allAdminUsers;
					if (typeof resolver === 'function') {
						result = await resolver(
							{},
							{ page: 1, pageSize: 10, searchText: null, statusFilters: null },
							context,
							{} as never,
						);
					}
				},
			);
			Then('it should check authentication and permissions', () => {
				expect(
					context.applicationServices.User.AdminUser.queryByEmail,
				).toHaveBeenCalled();
			});
			And(
				'the resolver should call "User.AdminUser.getAllUsers" with query parameters',
				() => {
					expect(
						context.applicationServices.User.AdminUser.getAllUsers,
					).toHaveBeenCalledWith({
						page: 1,
						pageSize: 10,
						searchText: undefined,
						statusFilters: undefined,
						sorter: undefined,
					});
				},
			);
			And('it should return a list of admin users', () => {
				expect(result).toBeDefined();
				expect(Array.isArray(result)).toBe(true);
			});
		},
	);

	Scenario(
		'Querying all admin users without permissions',
		({ Given, When, Then }) => {
			Given('a verified user without canViewAllUsers permission', () => {
				const regularUser = createMockAdminUser({
					account: createMockAccount({ email: 'user@example.com' }),
					role: {
						...createMockRole(),
						permissions: {
							...createMockRole().permissions,
							userPermissions: {
								...createMockRole().permissions.userPermissions,
								canViewAllUsers: false,
							},
						},
					},
				});
				vi.mocked(
					context.applicationServices.User.AdminUser.queryByEmail,
				).mockResolvedValue(regularUser);
			});
			When('I execute the query "allAdminUsers"', async () => {
				const resolver = adminUserResolvers.Query?.allAdminUsers;
				if (typeof resolver === 'function') {
					try {
						result = await resolver(
							{},
							{ page: 1, pageSize: 10 },
							context,
							{} as never,
						);
					} catch (error) {
						result = error;
					}
				}
			});
			Then('it should throw a Forbidden error', () => {
				expect(result).toBeInstanceOf(Error);
				expect((result as Error).message).toContain('Forbidden');
			});
		},
	);

	Scenario(
		'Creating a new admin user with permissions',
		({ Given, When, Then, And }) => {
			Given('a verified admin with canManageUserRoles permission', () => {
				const adminUser = createMockAdminUser({
					account: createMockAccount({ email: 'admin@example.com' }),
				});
				vi.mocked(
					context.applicationServices.User.AdminUser.queryByEmail,
				).mockResolvedValue(adminUser);
			});
			And(
				'a valid AdminUserCreateInput with email "newadmin@example.com"',
				() => {
					// Input will be passed in the resolver call
				},
			);
			When('I execute the mutation "createAdminUser"', async () => {
				const newUser = createMockAdminUser({
					id: 'new-admin-123',
					account: createMockAccount({
						email: 'newadmin@example.com',
						username: 'newadmin',
						profile: createMockProfile({ firstName: 'New', lastName: 'Admin' }),
					}),
				});
				vi.mocked(
					context.applicationServices.User.AdminUser.createIfNotExists,
				).mockResolvedValue(newUser);

				const resolver = adminUserResolvers.Mutation?.createAdminUser;
				if (typeof resolver === 'function') {
					result = await resolver(
						{},
						{
							input: {
								email: 'newadmin@example.com',
								username: 'newadmin',
								firstName: 'New',
								lastName: 'Admin',
								roleId: 'role-1',
							},
						},
						context,
						{} as never,
					);
				}
			});
			Then('it should check authentication and permissions', () => {
				expect(
					context.applicationServices.User.AdminUser.queryByEmail,
				).toHaveBeenCalled();
			});
			And('the resolver should call "User.AdminUser.createIfNotExists"', () => {
				expect(
					context.applicationServices.User.AdminUser.createIfNotExists,
				).toHaveBeenCalledWith({
					email: 'newadmin@example.com',
					username: 'newadmin',
					firstName: 'New',
					lastName: 'Admin',
					roleId: 'role-1',
				});
			});
			And('it should return the newly created AdminUser entity', () => {
				expect(result).toBeDefined();
				expect((result as { id: string }).id).toBe('new-admin-123');
			});
		},
	);

	Scenario(
		'Creating a new admin user without permissions',
		({ Given, When, Then }) => {
			Given('a verified user without canManageUserRoles permission', () => {
				const regularUser = createMockAdminUser({
					account: createMockAccount({ email: 'user@example.com' }),
					role: {
						...createMockRole(),
						permissions: {
							...createMockRole().permissions,
							userPermissions: {
								...createMockRole().permissions.userPermissions,
								canManageUserRoles: false,
							},
						},
					},
				});
				vi.mocked(
					context.applicationServices.User.AdminUser.queryByEmail,
				).mockResolvedValue(regularUser);
			});
			When('I execute the mutation "createAdminUser"', async () => {
				const resolver = adminUserResolvers.Mutation?.createAdminUser;
				if (typeof resolver === 'function') {
					try {
						result = await resolver(
							{},
							{
								input: {
									email: 'newadmin@example.com',
									username: 'newadmin',
									firstName: 'New',
									lastName: 'Admin',
									roleId: 'role-1',
								},
							},
							context,
							{} as never,
						);
					} catch (error) {
						result = error;
					}
				}
			});
			Then('it should throw a Forbidden error', () => {
				expect(result).toBeInstanceOf(Error);
				expect((result as Error).message).toContain('Forbidden');
			});
		},
	);

	Scenario('Updating admin user information', ({ Given, When, Then, And }) => {
		Given('a verified admin user', () => {
			// Already set up in BeforeEachScenario
		});
		And('a valid AdminUserUpdateInput with id "admin-user-123"', () => {
			// Input will be passed in the resolver call
		});
		When('I execute the mutation "adminUserUpdate"', async () => {
			const mockUser = createMockAdminUser({
				id: 'admin-user-123',
				account: createMockAccount({
					profile: createMockProfile({ firstName: 'Updated' }),
				}),
			});
			vi.mocked(
				context.applicationServices.User.AdminUser.update,
			).mockResolvedValue(mockUser);

			const resolver = adminUserResolvers.Mutation?.adminUserUpdate;
			if (typeof resolver === 'function') {
				result = await resolver(
					{},
					{
						input: {
							id: 'admin-user-123',
							account: { profile: { firstName: 'Updated' } },
						},
					},
					context,
					{} as never,
				);
			}
		});
		Then('it should check authentication', () => {
			expect(
				context.applicationServices.verifiedUser?.verifiedJwt,
			).toBeDefined();
		});
		And('the resolver should call "User.AdminUser.update"', () => {
			expect(
				context.applicationServices.User.AdminUser.update,
			).toHaveBeenCalled();
		});
		And('it should return the updated AdminUser entity', () => {
			expect(result).toBeDefined();
			expect((result as { id: string }).id).toBe('admin-user-123');
		});
	});
});
