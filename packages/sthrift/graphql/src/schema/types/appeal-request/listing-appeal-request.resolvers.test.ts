// @ts-nocheck - Test file with simplified mocks
import type { GraphQLResolveInfo } from 'graphql';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { GraphContext } from '../../../init/context.ts';
import listingAppealRequestResolvers from './listing-appeal-request.resolvers.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/listing-appeal-request.resolvers.feature'),
);

test.for(feature, ({ Background, Scenario, BeforeEachScenario }) => {
	let mockContext: GraphContext;
	let mockListingAppealRequest: {
		id: string;
		user: { id: string };
		listing: { id: string };
		blocker: { id: string };
		state: string;
		reason: string;
	};
	let mockUser: { id: string; email: string; userType?: string };
	let mockListing: { id: string; title: string };
	let mockBlocker: { id: string; email: string; userType?: string };
	let result: unknown;

	BeforeEachScenario(() => {
		mockUser = {
			id: '507f1f77bcf86cd799439011',
			email: 'user@test.com',
			userType: 'personal-users',
		};

		mockListing = {
			id: '507f1f77bcf86cd799439012',
			title: 'Test Listing',
		};

		mockBlocker = {
			id: '507f1f77bcf86cd799439013',
			email: 'admin@test.com',
			userType: 'admin-user',
		};

		mockListingAppealRequest = {
			id: '507f1f77bcf86cd799439014',
			user: { id: '507f1f77bcf86cd799439011' },
			listing: { id: '507f1f77bcf86cd799439012' },
			blocker: { id: '507f1f77bcf86cd799439013' },
			state: 'Draft',
			reason: 'Test reason',
		};

		// Initialize mockContext with mock data configured
		mockContext = {
			applicationServices: {
				AppealRequest: {
					ListingAppealRequest: {
						getById: vi.fn().mockResolvedValue(mockListingAppealRequest),
						getAll: vi.fn().mockResolvedValue({
							items: [mockListingAppealRequest],
							total: 1,
							page: 1,
							pageSize: 10,
						}),
						create: vi.fn().mockResolvedValue(mockListingAppealRequest),
						updateState: vi.fn().mockResolvedValue(mockListingAppealRequest),
					},
				},
				User: {
					PersonalUser: {
						queryById: vi.fn().mockImplementation(({ id }) => {
							if (id === '507f1f77bcf86cd799439011') return Promise.resolve(mockUser);
							return Promise.resolve(null);
						}),
					},
					AdminUser: {
						queryById: vi.fn().mockImplementation(({ id }) => {
							if (id === '507f1f77bcf86cd799439013') return Promise.resolve(mockBlocker);
							return Promise.resolve(null);
						}),
					},
				},
				Listing: {
					ItemListing: {
						queryById: vi.fn().mockResolvedValue(mockListing),
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
		'ListingAppealRequest user field resolver returns populated user',
		({ Given, When, Then }) => {
			Given('a listing appeal request with user ID', () => {
				expect(mockListingAppealRequest.user).toBeDefined();
			});

			When('the user field resolver is called', async () => {
				result =
					await listingAppealRequestResolvers.ListingAppealRequest?.user?.(
						mockListingAppealRequest,
						{},
						mockContext,
						{ fieldName: 'user' } as { fieldName: string },
					);
			});

			Then('it should return the populated user entity', () => {
				expect(result).toEqual(mockUser);
				expect(
					mockContext.applicationServices.User.PersonalUser.queryById,
				).toHaveBeenCalledWith({ id: '507f1f77bcf86cd799439011' });
			});
		},
	);

	Scenario(
		'ListingAppealRequest listing field resolver returns populated listing',
		({ Given, When, Then }) => {
			Given('a listing appeal request with listing ID', () => {
				expect(mockListingAppealRequest.listing).toBeDefined();
			});

			When('the listing field resolver is called', async () => {
				result =
					await listingAppealRequestResolvers.ListingAppealRequest?.listing?.(
						mockListingAppealRequest,
						{},
						mockContext,
						{ fieldName: 'listing' }
					);
			});

			Then('it should return the populated item listing entity', () => {
				expect(result).toEqual(mockListing);
				expect(
					mockContext.applicationServices.Listing.ItemListing.queryById,
				).toHaveBeenCalledWith({ id: '507f1f77bcf86cd799439012' });
			});
		},
	);

	Scenario(
		'ListingAppealRequest blocker field resolver returns populated blocker',
		({ Given, When, Then }) => {
			Given('a listing appeal request with blocker ID', () => {
				expect(mockListingAppealRequest.blocker).toBeDefined();
			});

			When('the blocker field resolver is called', async () => {
				result =
					await listingAppealRequestResolvers.ListingAppealRequest?.blocker?.(
						mockListingAppealRequest,
						{},
						mockContext,
						{ fieldName: 'blocker' } as { fieldName: string },
					);
			});

			Then('it should return the populated admin user entity', () => {
				expect(result).toEqual(mockBlocker);
				expect(
					mockContext.applicationServices.User.AdminUser.queryById,
				).toHaveBeenCalledWith({ id: '507f1f77bcf86cd799439013' });
			});
		},
	);

	Scenario(
		'Query getListingAppealRequest returns appeal request by ID',
		({ When, Then }) => {
			When(
				'getListingAppealRequest query is called with valid ID',
				async () => {
					result =
						await listingAppealRequestResolvers.Query?.getListingAppealRequest?.(
							{},
							{ id: 'appeal-id-abc' },
							mockContext,
							{} as GraphQLResolveInfo,
						);
				},
			);

		Then('it should return the listing appeal request entity', () => {
			expect(result).toEqual(mockListingAppealRequest);
			expect(
				mockContext.applicationServices.AppealRequest.ListingAppealRequest.getById,
			).toHaveBeenCalled();
			});
		},
	);

	Scenario(
		'Query getAllListingAppealRequests returns paginated requests',
		({ When, Then }) => {
			When(
				'getAllListingAppealRequests query is called with pagination params',
				async () => {
					result =
						await listingAppealRequestResolvers.Query?.getAllListingAppealRequests?.(
							{},
							{ input: { page: 1, pageSize: 10 } },
							mockContext,
							{} as GraphQLResolveInfo,
						);
				},
			);

			Then('it should return paginated listing appeal requests', () => {
				expect(result.items).toHaveLength(1);
				expect(result.total).toBe(1);
				expect(result.page).toBe(1);
				expect(result.pageSize).toBe(10);
				expect(
					mockContext.applicationServices.AppealRequest.ListingAppealRequest.getAll,
				).toHaveBeenCalledWith({
					page: 1,
					pageSize: 10,
				});
			});
		},
	);

	Scenario(
		'Query getAllListingAppealRequests returns empty list when none exist',
		({ When, Then }) => {
			When(
				'getAllListingAppealRequests query is called with no results',
				async () => {
					vi.mocked(
						mockContext.applicationServices.AppealRequest.ListingAppealRequest.getAll,
					).mockResolvedValue({
						items: [],
						total: 0,
						page: 1,
				pageSize: 10,
			});
				result =
					await listingAppealRequestResolvers.Query?.getAllListingAppealRequests?.(
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
		'Mutation createListingAppealRequest creates new appeal request',
		({ Given, When, Then }) => {
			let input: Record<string, unknown>;

			Given('valid listing appeal request input data', () => {
				input = {
					user: 'user-id-123',
					listing: 'listing-id-456',
					reason: 'Test reason',
				};
			});

			When('createListingAppealRequest mutation is called', async () => {
				result =
					await listingAppealRequestResolvers.Mutation?.createListingAppealRequest?.(
						{},
						{ input },
						mockContext,
						{} as GraphQLResolveInfo,
					);
			});

			Then('it should create and return the new listing appeal request', () => {
				expect(result).toEqual(mockListingAppealRequest);
				expect(
					mockContext.applicationServices.AppealRequest.ListingAppealRequest.create,
				).toHaveBeenCalledWith(input);
			});
		},
	);

	Scenario(
		'Mutation updateListingAppealRequestState updates request state',
		({ Given, When, Then }) => {
			let input: Record<string, unknown>;

			Given('a listing appeal request ID and new state', () => {
				input = {
					id: 'appeal-id-abc',
					state: 'Approved',
				};
			});

			When('updateListingAppealRequestState mutation is called', async () => {
				result =
					await listingAppealRequestResolvers.Mutation?.updateListingAppealRequestState?.(
						{},
						{ input },
						mockContext,
						{} as GraphQLResolveInfo,
					);
			});

			Then('it should update the request state successfully', () => {
				expect(result).toEqual(mockListingAppealRequest);
				expect(
					mockContext.applicationServices.AppealRequest.ListingAppealRequest.updateState,
				).toHaveBeenCalledWith({
					id: 'appeal-id-abc',
					state: 'approved',
				});
			});
		},
	);

	Scenario(
		'Mutation updateListingAppealRequestState normalizes state values',
		({ Given, When, Then }) => {
			let input: Record<string, unknown>;

			Given('a listing appeal request with Draft state', () => {
				input = {
					id: 'appeal-id-abc',
					state: 'draft',
				};
			});

			When(
				'updateListingAppealRequestState mutation is called with lowercase state',
				async () => {
					result =
						await listingAppealRequestResolvers.Mutation?.updateListingAppealRequestState?.(
							{},
							{ input },
							mockContext,
							{} as GraphQLResolveInfo,
						);
				},
			);

			Then('it should normalize the state to uppercase format', () => {
				expect(
					mockContext.applicationServices.AppealRequest.ListingAppealRequest.updateState,
				).toHaveBeenCalledWith({
					id: 'appeal-id-abc',
					state: 'draft',
				});
			});
		},
	);
});
