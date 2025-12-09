// @ts-nocheck - Test file with simplified mocks
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { GraphQLResolveInfo } from 'graphql';
import { expect, vi } from 'vitest';
import type { GraphContext } from '../init/context.ts';
import {
	currentViewerIsAdmin,
	getRequestedFieldPaths,
	getUserByEmail,
	PopulateItemListingFromField,
	PopulateUserFromField,
} from './resolver-helper.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'resolver-helper.feature'),
);

test.for(feature, ({ Background, Scenario, BeforeEachScenario }) => {
	let mockContext: GraphContext;
	let mockAdminUser: {
		id: string;
		email: string;
		role: { permissions: { userPermissions: { canViewAllUsers: boolean } } };
	};
	let mockPersonalUser: {
		id: string;
		email: string;
	};
	let mockListing: {
		id: string;
		title: string;
	};
	let result: unknown;

	BeforeEachScenario(() => {
		mockAdminUser = {
			id: '507f1f77bcf86cd799439011',
			email: 'admin@test.com',
			userType: 'admin-user',
			role: { roleName: 'Admin' },
		};

		mockPersonalUser = {
			id: '507f1f77bcf86cd799439012',
			email: 'user@test.com',
			userType: 'personal-user',
		};

		mockListing = {
			id: '507f1f77bcf86cd799439013',
			title: 'Test Listing',
		};

		mockContext = {
			applicationServices: {
				verifiedUser: undefined,
				Listing: {
					ItemListing: {
						queryById: vi.fn(),
					},
				},
				User: {
					AdminUser: {
						queryByEmail: vi.fn(),
						queryById: vi.fn(),
					},
					PersonalUser: {
						queryByEmail: vi.fn(),
						queryById: vi.fn(),
					},
					User: {
						queryById: vi.fn(),
					},
				},
			},
		} as GraphContext;

		result = undefined;
	});

	Background(({ Given }) => {
		Given('a GraphQL context with application services', () => {
			// mockContext properly initialized in BeforeEachScenario
		});
	});

	Scenario('getUserByEmail finds AdminUser', ({ When, Then }) => {
		When('getUserByEmail is called with an admin user email', async () => {
			vi.mocked(
				mockContext.applicationServices.User.AdminUser.queryByEmail,
			).mockResolvedValue(mockAdminUser);
			result = await getUserByEmail('admin@test.com', mockContext);
		});

		Then('it should return the AdminUser entity', () => {
			expect(result).toEqual(mockAdminUser);
			expect(result.userType).toBe('admin-user');
		});
	});

	Scenario('getUserByEmail finds PersonalUser', ({ When, Then }) => {
		When('getUserByEmail is called with a personal user email', async () => {
			vi.mocked(
				mockContext.applicationServices.User.AdminUser.queryByEmail,
			).mockRejectedValue(new Error('Not found'));
			vi.mocked(
				mockContext.applicationServices.User.PersonalUser.queryByEmail,
			).mockResolvedValue(mockPersonalUser);
			result = await getUserByEmail('user@test.com', mockContext);
		});

		Then('it should return the PersonalUser entity', () => {
			expect(result).toEqual(mockPersonalUser);
			expect(result.userType).toBe('personal-user');
		});
	});

	Scenario(
		'getUserByEmail returns null when user not found',
		({ When, Then }) => {
			When('getUserByEmail is called with a non-existent email', async () => {
				vi.mocked(
					mockContext.applicationServices.User.AdminUser.queryByEmail,
				).mockRejectedValue(new Error('Not found'));
				vi.mocked(
					mockContext.applicationServices.User.PersonalUser.queryByEmail,
				).mockRejectedValue(new Error('Not found'));
				result = await getUserByEmail('notfound@test.com', mockContext);
			});

			Then('it should return null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario(
		'currentViewerIsAdmin returns true for admin user',
		({ Given, When, Then }) => {
			Given('the verified user is an admin', () => {
				mockContext.applicationServices.verifiedUser = {
					verifiedJwt: { email: 'admin@test.com' },
				} as { verifiedJwt: { email: string } };
				vi.mocked(
					mockContext.applicationServices.User.AdminUser.queryByEmail,
				).mockResolvedValue(mockAdminUser);
			});

			When('currentViewerIsAdmin is called', async () => {
				result = await currentViewerIsAdmin(mockContext);
			});

			Then('it should return true', () => {
				expect(result).toBe(true);
			});
		},
	);

	Scenario(
		'currentViewerIsAdmin returns false for personal user',
		({ Given, When, Then }) => {
			Given('the verified user is a personal user', () => {
				mockContext.applicationServices.verifiedUser = {
					verifiedJwt: { email: 'user@test.com' },
				} as { verifiedJwt: { email: string } };
				vi.mocked(
					mockContext.applicationServices.User.AdminUser.queryByEmail,
				).mockRejectedValue(new Error('Not found'));
				vi.mocked(
					mockContext.applicationServices.User.PersonalUser.queryByEmail,
				).mockResolvedValue(mockPersonalUser);
			});

			When('currentViewerIsAdmin is called', async () => {
				result = await currentViewerIsAdmin(mockContext);
			});

			Then('it should return false', () => {
				expect(result).toBe(false);
			});
		},
	);

	Scenario(
		'currentViewerIsAdmin returns false when no verified user',
		({ Given, When, Then }) => {
			Given('there is no verified user', () => {
				mockContext.applicationServices.verifiedUser = undefined;
			});

			When('currentViewerIsAdmin is called', async () => {
				result = await currentViewerIsAdmin(mockContext);
			});

			Then('it should return false', () => {
				expect(result).toBe(false);
			});
		},
	);

	Scenario(
		'PopulateUserFromField resolves AdminUser by ID',
		({ Given, When, Then }) => {
			const parent = { userId: { id: '507f1f77bcf86cd799439011' } };

			Given('a parent object with a valid admin user ID field', () => {
				vi.mocked(
					mockContext.applicationServices.User.AdminUser.queryById,
				).mockResolvedValue(mockAdminUser);
			});

			When('PopulateUserFromField resolver is called', async () => {
				const resolver = PopulateUserFromField('userId');
				result = await resolver(parent, {}, mockContext);
			});

			Then('it should return the AdminUser entity', () => {
				expect(result).toEqual(mockAdminUser);
			});
		},
	);

	Scenario(
		'PopulateUserFromField resolves PersonalUser by ID',
		({ Given, When, Then }) => {
			const parent = { userId: { id: '507f1f77bcf86cd799439012' } };

			Given('a parent object with a valid personal user ID field', () => {
				vi.mocked(
					mockContext.applicationServices.User.AdminUser.queryById,
				).mockRejectedValue(new Error('Not found'));
				vi.mocked(
					mockContext.applicationServices.User.PersonalUser.queryById,
				).mockResolvedValue(mockPersonalUser);
			});

			When('PopulateUserFromField resolver is called', async () => {
				const resolver = PopulateUserFromField('userId');
				result = await resolver(parent, {}, mockContext);
			});

			Then('it should return the PersonalUser entity', () => {
				expect(result).toEqual(mockPersonalUser);
			});
		},
	);

	Scenario(
		'PopulateUserFromField returns field value for invalid ID',
		({ Given, When, Then }) => {
			const parent = { userId: { id: 'invalid-id' } };

			Given('a parent object with an invalid user ID', () => {
				// Invalid ObjectId shape but still includes id field
				expect(parent.userId.id).toBe('invalid-id');
			});

			When('PopulateUserFromField resolver is called', async () => {
				const resolver = PopulateUserFromField('userId');
				result = await resolver(parent, {}, mockContext);
			});

			Then('it should return the original field value', () => {
				expect(result).toBe(parent.userId);
			});
		},
	);

		Scenario(
			'PopulateUserFromField returns original object when lookups fail',
			({ Given, When, Then }) => {
				const parent = {
					userId: { id: '507f1f77bcf86cd799439099', name: 'Cached User' },
				};

				Given('both AdminUser and PersonalUser lookups return null', () => {
					vi.mocked(
						mockContext.applicationServices.User.AdminUser.queryById,
					).mockResolvedValue(null);
					vi.mocked(
						mockContext.applicationServices.User.PersonalUser.queryById,
					).mockResolvedValue(null);
				});

				When('PopulateUserFromField resolver is called', async () => {
					const resolver = PopulateUserFromField('userId');
					result = await resolver(parent, {}, mockContext);
				});

				Then('it should fall back to the original field object', () => {
					expect(result).toBe(parent.userId);
					expect(
						mockContext.applicationServices.User.AdminUser.queryById,
					).toHaveBeenCalledWith({ id: '507f1f77bcf86cd799439099' });
					expect(
						mockContext.applicationServices.User.PersonalUser.queryById,
					).toHaveBeenCalledWith({ id: '507f1f77bcf86cd799439099' });
				});
			},
		);

	Scenario(
		'PopulateItemListingFromField resolves listing by ID',
		({ Given, When, Then }) => {
			const parent = { listingId: { id: '507f1f77bcf86cd799439013' } };

			Given('a parent object with a valid listing ID field', () => {
				vi.mocked(
					mockContext.applicationServices.Listing.ItemListing.queryById,
				).mockResolvedValue(mockListing);
			});

			When('PopulateItemListingFromField resolver is called', async () => {
				const resolver = PopulateItemListingFromField('listingId');
				result = await resolver(parent, {}, mockContext);
			});

			Then('it should return the ItemListing entity', () => {
				expect(result).toEqual(mockListing);
			});
		},
	);

	Scenario(
		'PopulateItemListingFromField returns field value for invalid ID',
		({ Given, When, Then }) => {
			const parent = { listingId: 'invalid-id' };

			Given('a parent object with an invalid listing ID', () => {
				expect(parent.listingId).toBe('invalid-id');
			});

			When('PopulateItemListingFromField resolver is called', async () => {
				const resolver = PopulateItemListingFromField('listingId');
				result = await resolver(parent, {}, mockContext);
			});

			Then('it should return the original field value', () => {
				expect(result).toBe('invalid-id');
			});
		},
	);

		Scenario(
			'PopulateItemListingFromField skips lookup for non-ObjectId shapes',
			({ Given, When, Then }) => {
				const parent = { listingId: { id: 'not-a-valid-object-id', title: 'Cached' } };

				Given('listingId has an id field that is not a valid ObjectId', () => {
					expect(parent.listingId.id).toBe('not-a-valid-object-id');
				});

				When('PopulateItemListingFromField resolver is called', async () => {
					const resolver = PopulateItemListingFromField('listingId');
					result = await resolver(parent, {}, mockContext);
				});

				Then('it should return the original listing object without querying', () => {
					expect(result).toBe(parent.listingId);
					expect(
						mockContext.applicationServices.Listing.ItemListing.queryById,
					).not.toHaveBeenCalled();
				});
			},
		);

	Scenario(
		'getRequestedFieldPaths extracts field paths from selection',
		({ Given, When, Then }) => {
			let mockInfo: GraphQLResolveInfo;

			Given('a GraphQL resolve info with field selections', () => {
				mockInfo = {
					fieldNodes: [
						{
							selectionSet: {
								selections: [
									{ kind: 'Field', name: { value: 'id' } },
									{ kind: 'Field', name: { value: 'email' } },
									{
										kind: 'Field',
										name: { value: 'profile' },
										selectionSet: {
											selections: [
												{ kind: 'Field', name: { value: 'firstName' } },
												{ kind: 'Field', name: { value: 'lastName' } },
											],
										},
									},
								],
							},
						},
					],
					fragments: {},
				} as unknown as GraphQLResolveInfo;
			});

			When('getRequestedFieldPaths is called', () => {
				result = getRequestedFieldPaths(mockInfo);
			});

			Then('it should return all leaf field paths', () => {
				expect(result).toContain('id');
				expect(result).toContain('email');
				expect(result).toContain('profile.firstName');
				expect(result).toContain('profile.lastName');
			});
		},
	);

	Scenario(
		'getRequestedFieldPaths handles fragments',
		({ Given, When, Then }) => {
			let mockInfo: GraphQLResolveInfo;

			Given('a GraphQL resolve info with fragment spreads', () => {
				mockInfo = {
					fieldNodes: [
						{
							selectionSet: {
								selections: [
									{ kind: 'Field', name: { value: 'id' } },
									{ kind: 'FragmentSpread', name: { value: 'UserFields' } },
								],
							},
						},
					],
					fragments: {
						UserFields: {
							selectionSet: {
								selections: [
									{ kind: 'Field', name: { value: 'email' } },
									{ kind: 'Field', name: { value: 'name' } },
								],
							},
						},
					},
				} as unknown as GraphQLResolveInfo;
			});

			When('getRequestedFieldPaths is called', () => {
				result = getRequestedFieldPaths(mockInfo);
			});

			Then('it should expand fragments and return all field paths', () => {
				expect(result).toContain('id');
				expect(result).toContain('email');
				expect(result).toContain('name');
			});
		},
	);

	Scenario(
		'getRequestedFieldPaths handles inline fragments',
		({ Given, When, Then }) => {
			let mockInfo: GraphQLResolveInfo;

			Given('a GraphQL resolve info with inline fragments', () => {
				mockInfo = {
					fieldNodes: [
						{
							selectionSet: {
								selections: [
									{ kind: 'Field', name: { value: 'id' } },
									{
										kind: 'InlineFragment',
										selectionSet: {
											selections: [{ kind: 'Field', name: { value: 'email' } }],
										},
									},
								],
							},
						},
					],
					fragments: {},
				} as unknown as GraphQLResolveInfo;
			});

			When('getRequestedFieldPaths is called', () => {
				result = getRequestedFieldPaths(mockInfo);
			});

			Then('it should include fields from inline fragments', () => {
				expect(result).toContain('id');
				expect(result).toContain('email');
			});
		},
	);

	Scenario(
		'getRequestedFieldPaths excludes __typename',
		({ Given, When, Then }) => {
			let mockInfo: GraphQLResolveInfo;

			Given('a GraphQL resolve info with __typename selections', () => {
				mockInfo = {
					fieldNodes: [
						{
							selectionSet: {
								selections: [
									{ kind: 'Field', name: { value: '__typename' } },
									{ kind: 'Field', name: { value: 'id' } },
									{ kind: 'Field', name: { value: 'email' } },
								],
							},
						},
					],
					fragments: {},
				} as unknown as GraphQLResolveInfo;
			});

			When('getRequestedFieldPaths is called', () => {
				result = getRequestedFieldPaths(mockInfo);
			});

			Then('it should exclude __typename from results', () => {
				expect(result).not.toContain('__typename');
				expect(result).toContain('id');
				expect(result).toContain('email');
			});
		},
	);
});
