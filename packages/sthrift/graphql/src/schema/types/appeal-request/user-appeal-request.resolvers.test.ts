// @ts-nocheck - Test file with simplified mocks
import type { GraphQLResolveInfo } from 'graphql';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { GraphContext } from '../../../init/context.ts';
import userAppealRequestResolvers from './user-appeal-request.resolvers.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/user-appeal-request.resolvers.feature'),
);

test.for(feature, ({ Background, Scenario, BeforeEachScenario }) => {
	let mockContext: GraphContext;
	let mockUserAppealRequest: {
		id: string;
		user: { id: string };
		blocker: { id: string };
		state: string;
		reason: string;
	};
	let mockUser: { id: string; email: string; userType?: string };
	let mockBlocker: { id: string; email: string; userType?: string };
	let result: unknown;

	BeforeEachScenario(() => {
		mockUser = {
			id: '507f1f77bcf86cd799439015',
			email: 'user@test.com',
			userType: 'personal-users',
		};

		mockBlocker = {
			id: '507f1f77bcf86cd799439016',
			email: 'admin@test.com',
			userType: 'admin-user',
		};

		mockUserAppealRequest = {
			id: '507f1f77bcf86cd799439017',
			user: { id: '507f1f77bcf86cd799439015' },
			blocker: { id: '507f1f77bcf86cd799439016' },
			state: 'Draft',
			reason: 'Test appeal reason',
		};

		// Initialize mockContext with mock data configured
		mockContext = {
			applicationServices: {
				AppealRequest: {
					UserAppealRequest: {
						getById: vi.fn().mockResolvedValue(mockUserAppealRequest),
						getAll: vi.fn().mockResolvedValue({
							items: [mockUserAppealRequest],
							total: 1,
							page: 1,
							pageSize: 10,
						}),
						create: vi.fn().mockResolvedValue(mockUserAppealRequest),
						updateState: vi.fn().mockResolvedValue(mockUserAppealRequest),
					},
				},
				User: {
					PersonalUser: {
						queryById: vi.fn().mockImplementation(({ id }) => {
							if (id === '507f1f77bcf86cd799439015') return Promise.resolve(mockUser);
							return Promise.resolve(null);
						}),
					},
					AdminUser: {
						queryById: vi.fn().mockImplementation(({ id }) => {
							if (id === '507f1f77bcf86cd799439016') return Promise.resolve(mockBlocker);
							return Promise.resolve(null);
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
		'UserAppealRequest user field resolver returns populated user',
		({ Given, When, Then }) => {
			Given('a user appeal request with user ID', () => {
				expect(mockUserAppealRequest.user).toBeDefined();
			});

			When('the user field resolver is called', async () => {
				result = await userAppealRequestResolvers.UserAppealRequest?.user?.(
					mockUserAppealRequest,
					{},
					mockContext,
					{ fieldName: 'user' } as { fieldName: string },
				);
			});

			Then('it should return the populated personal user entity', () => {
				expect(result).toEqual(mockUser);
				expect(
					mockContext.applicationServices.User.PersonalUser.queryById,
				).toHaveBeenCalledWith({ id: '507f1f77bcf86cd799439015' });
			});
		},
	);

	Scenario(
		'UserAppealRequest blocker field resolver returns populated blocker',
		({ Given, When, Then }) => {
			Given('a user appeal request with blocker ID', () => {
				expect(mockUserAppealRequest.blocker).toBeDefined();
			});

			When('the blocker field resolver is called', async () => {
				result = await userAppealRequestResolvers.UserAppealRequest?.blocker?.(
					mockUserAppealRequest,
					{},
					mockContext,
					{ fieldName: 'blocker' } as { fieldName: string },
				);
			});

			Then('it should return the populated admin user entity', () => {
				expect(result).toEqual(mockBlocker);
				expect(
					mockContext.applicationServices.User.AdminUser.queryById,
				).toHaveBeenCalledWith({ id: '507f1f77bcf86cd799439016' });
			});
		},
	);

	Scenario(
		'Query getUserAppealRequest returns appeal request by ID',
		({ When, Then }) => {
			When('getUserAppealRequest query is called with valid ID', async () => {
				result = await userAppealRequestResolvers.Query?.getUserAppealRequest?.(
					{},
					{ id: 'appeal-id-xyz' },
					mockContext,
					{} as GraphQLResolveInfo,
				);
			});

			Then('it should return the user appeal request entity', () => {
				expect(result).toEqual(mockUserAppealRequest);
				expect(
					mockContext.applicationServices.AppealRequest.UserAppealRequest.getById,
				).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Query getAllUserAppealRequests returns paginated requests',
		({ When, Then }) => {
		When(
			'getAllUserAppealRequests query is called with pagination params',
			async () => {
				result =
					await userAppealRequestResolvers.Query?.getAllUserAppealRequests?.(
						{},
						{ input: { page: 1, pageSize: 10 } },
						mockContext,
						{} as GraphQLResolveInfo,
					);
			},
		);			Then('it should return paginated user appeal requests', () => {
				expect(result.items).toHaveLength(1);
				expect(result.total).toBe(1);
				expect(result.page).toBe(1);
				expect(result.pageSize).toBe(10);
				expect(
					mockContext.applicationServices.AppealRequest.UserAppealRequest.getAll,
				).toHaveBeenCalledWith({
					page: 1,
					pageSize: 10,
				});
			});
		},
	);

	Scenario(
		'Query getAllUserAppealRequests returns empty list when none exist',
		({ When, Then }) => {
			When(
				'getAllUserAppealRequests query is called with no results',
				async () => {
					vi.mocked(
						mockContext.applicationServices.AppealRequest.UserAppealRequest.getAll,
					).mockResolvedValue({
						items: [],
						total: 0,
						page: 1,
					pageSize: 10,
				});
				result =
					await userAppealRequestResolvers.Query?.getAllUserAppealRequests?.(
						{},
						{ input: { page: 1, pageSize: 10 } },
						mockContext,
						{} as GraphQLResolveInfo,
					);
			},
		);			Then('it should return empty items array', () => {
				expect(result.items).toHaveLength(0);
				expect(result.total).toBe(0);
			});
		},
	);

	Scenario(
		'Mutation createUserAppealRequest creates new appeal request',
		({ Given, When, Then }) => {
			let input: Record<string, unknown>;

			Given('valid user appeal request input data', () => {
				input = {
					user: 'user-id-123',
					reason: 'Test appeal reason',
				};
			});

			When('createUserAppealRequest mutation is called', async () => {
				result =
					await userAppealRequestResolvers.Mutation?.createUserAppealRequest?.(
						{},
						{ input },
						mockContext,
						{} as GraphQLResolveInfo,
					);
			});

			Then('it should create and return the new user appeal request', () => {
				expect(result).toEqual(mockUserAppealRequest);
				expect(
					mockContext.applicationServices.AppealRequest.UserAppealRequest.create,
				).toHaveBeenCalledWith(input);
			});
		},
	);

	Scenario(
		'Mutation updateUserAppealRequestState updates request state',
		({ Given, When, Then }) => {
			let input: Record<string, unknown>;

			Given('a user appeal request ID and new state', () => {
				input = {
					id: 'appeal-id-xyz',
					state: 'Approved',
				};
			});

			When('updateUserAppealRequestState mutation is called', async () => {
				result =
					await userAppealRequestResolvers.Mutation?.updateUserAppealRequestState?.(
						{},
						{ input },
						mockContext,
						{} as GraphQLResolveInfo,
					);
			});

			Then('it should update the request state successfully', () => {
				expect(result).toEqual(mockUserAppealRequest);
				expect(
					mockContext.applicationServices.AppealRequest.UserAppealRequest.updateState,
				).toHaveBeenCalledWith({
					id: 'appeal-id-xyz',
					state: 'approved',
				});
			});
		},
	);

	Scenario(
		'Mutation updateUserAppealRequestState normalizes state values',
		({ Given, When, Then }) => {
			let input: Record<string, unknown>;

			Given('a user appeal request with Draft state', () => {
				input = {
					id: 'appeal-id-xyz',
					state: 'draft',
				};
			});

			When(
				'updateUserAppealRequestState mutation is called with lowercase state',
				async () => {
					result =
						await userAppealRequestResolvers.Mutation?.updateUserAppealRequestState?.(
							{},
							{ input },
							mockContext,
							{} as GraphQLResolveInfo,
						);
				},
			);

			Then('it should normalize the state to uppercase format', () => {
				expect(
					mockContext.applicationServices.AppealRequest.UserAppealRequest.updateState,
				).toHaveBeenCalledWith({
					id: 'appeal-id-xyz',
					state: 'draft',
				});
			});
		},
	);
});
