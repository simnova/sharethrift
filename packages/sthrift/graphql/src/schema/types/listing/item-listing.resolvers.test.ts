import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import { expect, vi } from 'vitest';
import type { GraphContext } from '../../../init/context.ts';
import type { CreateItemListingInput, ListingAllPage } from '../../builder/generated.ts';
import itemListingResolvers from './item-listing.resolvers.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/item-listing.resolvers.feature'),
);

// Types for test results
type ItemListingEntity =
	Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;
type PersonalUserEntity =
	Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;

// Helper function to create mock listing
function createMockListing(
	overrides: Partial<ItemListingEntity> = {},
): ItemListingEntity {
	const baseListing: ItemListingEntity = {
		id: 'listing-1',
		title: 'Test Listing',
		description: 'Test description',
		category: 'Electronics',
		location: 'Delhi',
		sharingPeriodStart: new Date('2025-10-06'),
		sharingPeriodEnd: new Date('2025-11-06'),
		state: 'Published',
		sharer: {
			id: 'user-1',
		} as PersonalUserEntity,
		images: ['image1.jpg'],
		reports: 0,
		sharingHistory: [],
		createdAt: new Date('2020-01-01T00:00:00Z'),
		updatedAt: new Date('2020-01-02T00:00:00Z'),
		schemaVersion: '1.0.0',
		...overrides,
	};
	return baseListing;
}

// Helper function to create mock user
function createMockUser(
	overrides: Partial<PersonalUserEntity> = {},
): PersonalUserEntity {
	return {
		id: 'user-1',
		userType: 'end-user',
		isBlocked: false,
		hasCompletedOnboarding: true,
		schemaVersion: '1.0.0',
		account: {
			accountType: 'standard',
			email: 'test@example.com',
			username: 'testuser',
			profile: {
				firstName: 'Test',
				lastName: 'User',
				location: {
					address1: '123 Main St',
					address2: null,
					city: 'Test City',
					state: 'TS',
					country: 'Testland',
					zipCode: '12345',
				},
				billing: {
					subscriptionId: null,
					cybersourceCustomerId: null,
					paymentState: '',
					lastTransactionId: null,
					lastPaymentAmount: null,
				},
			},
		},
		createdAt: new Date(),
		updatedAt: new Date(),
		role: {} as Domain.Contexts.Role.PersonalUserRole.PersonalUserRoleEntityReference,
		loadRole: vi.fn(),
		...overrides,
	} as PersonalUserEntity;
}

function makeMockGraphContext(
	overrides: Partial<GraphContext> = {},
): GraphContext {
	return {
		applicationServices: {
			Listing: {
				ItemListing: {
					queryAll: vi.fn(),
					queryById: vi.fn(),
					queryBySharer: vi.fn(),
					queryPaged: vi.fn(),
					create: vi.fn(),
				},
			},
			User: {
				PersonalUser: {
					queryByEmail: vi.fn(),
				},
			},
			verifiedUser: {
				verifiedJwt: {
					sub: 'user-1',
					email: 'test@example.com',
				},
			},
		},
		...overrides,
	} as unknown as GraphContext;
}

test.for(feature, ({ Scenario }) => {
	let context: GraphContext;
	let result: unknown;
	let error: Error | undefined;

	Scenario(
		'Querying item listings for a verified user',
		({ Given, When, Then, And }) => {
			Given('a user with a verifiedJwt in their context', () => {
				context = makeMockGraphContext();
				vi.mocked(
					context.applicationServices.Listing.ItemListing.queryBySharer,
				).mockResolvedValue([createMockListing()]);
			});
			When('the itemListings query is executed', async () => {
				result = await itemListingResolvers.Query.itemListings(
					{},
					{},
					context,
				);
			});
			Then(
				"it should call Listing.ItemListing.queryBySharer with the user's sub",
				() => {
					expect(
						context.applicationServices.Listing.ItemListing.queryBySharer,
					).toHaveBeenCalledWith({
						personalUser: 'user-1',
					});
				},
			);
			And('it should map the results using toGraphItem', () => {
				expect(result).toBeDefined();
				expect(Array.isArray(result)).toBe(true);
			});
			And('it should return a list of item listings', () => {
				expect((result as unknown[]).length).toBeGreaterThan(0);
			});
		},
	);

	Scenario(
		'Querying item listings without authentication',
		({ Given, When, Then, And }) => {
			Given('a user without a verifiedJwt in their context', () => {
				context = makeMockGraphContext({
					applicationServices: {
						...makeMockGraphContext().applicationServices,
						verifiedUser: null,
					},
				});
				vi.mocked(
					context.applicationServices.Listing.ItemListing.queryAll,
				).mockResolvedValue([createMockListing()]);
			});
			When('the itemListings query is executed', async () => {
				result = await itemListingResolvers.Query.itemListings(
					{},
					{},
					context,
				);
			});
			Then('it should call Listing.ItemListing.queryAll', () => {
				expect(
					context.applicationServices.Listing.ItemListing.queryAll,
				).toHaveBeenCalledWith({});
			});
			And(
				'it should return all available listings mapped with toGraphItem',
				() => {
					expect(result).toBeDefined();
					expect(Array.isArray(result)).toBe(true);
				},
			);
		},
	);

	Scenario('Error while querying item listings', ({ Given, When, Then }) => {
		Given('Listing.ItemListing.queryBySharer throws an error', () => {
			context = makeMockGraphContext();
			vi.mocked(
				context.applicationServices.Listing.ItemListing.queryBySharer,
			).mockRejectedValue(new Error('Query failed'));
		});
		When('the itemListings query is executed', async () => {
			try {
				await itemListingResolvers.Query.itemListings({}, {}, context);
			} catch (e) {
				error = e as Error;
			}
		});
		Then('it should propagate the error message', () => {
			expect(error).toBeDefined();
			expect(error?.message).toBe('Query failed');
		});
	});

	Scenario('Querying a single item listing by ID', ({ Given, When, Then, And }) => {
		Given('a valid listing ID', () => {
			context = makeMockGraphContext();
			vi.mocked(
				context.applicationServices.Listing.ItemListing.queryById,
			).mockResolvedValue(createMockListing());
		});
		When('the itemListing query is executed with that ID', async () => {
			result = await itemListingResolvers.Query.itemListing(
				{},
				{ id: 'listing-1' },
				context,
			);
		});
		Then(
			'it should call Listing.ItemListing.queryById with the provided ID',
			() => {
				expect(
					context.applicationServices.Listing.ItemListing.queryById,
				).toHaveBeenCalledWith({ id: 'listing-1' });
			},
		);
		And('it should map the result using toGraphItem', () => {
			expect(result).toBeDefined();
		});
		And('it should return the corresponding listing', () => {
			expect(result).toHaveProperty('id');
			expect((result as { id: string }).id).toBe('listing-1');
		});
	});

	Scenario(
		'Querying an item listing that does not exist',
		({ Given, When, Then }) => {
			Given('a listing ID that does not match any record', () => {
				context = makeMockGraphContext();
				vi.mocked(
					context.applicationServices.Listing.ItemListing.queryById,
				).mockResolvedValue(null);
			});
			When('the itemListing query is executed', async () => {
				result = await itemListingResolvers.Query.itemListing(
					{},
					{ id: 'nonexistent-id' },
					context,
				);
			});
			Then('it should return null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario(
		'Error while querying a single item listing',
		({ Given, When, Then }) => {
			Given('Listing.ItemListing.queryById throws an error', () => {
				context = makeMockGraphContext();
				vi.mocked(
					context.applicationServices.Listing.ItemListing.queryById,
				).mockRejectedValue(new Error('Database connection failed'));
			});
			When('the itemListing query is executed', async () => {
				try {
					await itemListingResolvers.Query.itemListing(
						{},
						{ id: 'listing-1' },
						context,
					);
				} catch (e) {
					error = e as Error;
				}
			});
			Then('it should propagate the error message', () => {
				expect(error).toBeDefined();
				expect(error?.message).toBe('Database connection failed');
			});
		},
	);

	Scenario(
		'Querying paginated listings for the current user',
		({ Given, And, When, Then }) => {
			Given('a user with a verifiedJwt in their context', () => {
				context = makeMockGraphContext();
			});
			And('valid pagination arguments (page, pageSize)', () => {
				vi.mocked(
					context.applicationServices.Listing.ItemListing.queryPaged,
				).mockResolvedValue({
					items: [createMockListing()],
					total: 1,
					page: 1,
					pageSize: 10,
				});
			});
			When('the myListingsAll query is executed', async () => {
				result = await itemListingResolvers.Query.myListingsAll(
					{},
					{ page: 1, pageSize: 10 },
					context,
				);
			});
			Then(
				'it should call Listing.ItemListing.queryPaged with sharerId, page, and pageSize',
				() => {
					expect(
						context.applicationServices.Listing.ItemListing.queryPaged,
					).toHaveBeenCalledWith({
						page: 1,
						pageSize: 10,
						sharerId: 'user-1',
					});
				},
			);
			And('it should transform each listing into ListingAll shape', () => {
				expect(result).toHaveProperty('items');
				const resultPage = result as ListingAllPage;
				expect(resultPage.items).toHaveLength(1);
				const firstItem = resultPage.items[0];
				expect(firstItem).toHaveProperty('id');
				expect(firstItem).toHaveProperty('title');
				expect(firstItem).toHaveProperty('status');
			});
			And(
				'it should map state values like "Published" to "Active" and "Drafted" to "Draft"',
				() => {
					const resultPage = result as ListingAllPage;
					const firstItem = resultPage.items[0];
					expect(firstItem?.status).toBe('Active'); // Published -> Active
				},
			);
			And(
				'it should return items, total, page, and pageSize in the response',
				() => {
					expect(result).toHaveProperty('items');
					expect(result).toHaveProperty('total', 1);
					expect(result).toHaveProperty('page', 1);
					expect(result).toHaveProperty('pageSize', 10);
				},
			);
		},
	);

	Scenario(
		'Querying myListingsAll with search and filters',
		({ Given, And, When, Then }) => {
			Given('a verified user and valid pagination arguments', () => {
				context = makeMockGraphContext();
			});
			And('a searchText "camera" and statusFilters ["Published"]', () => {
				vi.mocked(
					context.applicationServices.Listing.ItemListing.queryPaged,
				).mockResolvedValue({
					items: [createMockListing({ title: 'Digital Camera' })],
					total: 1,
					page: 1,
					pageSize: 10,
				});
			});
			When('the myListingsAll query is executed', async () => {
				result = await itemListingResolvers.Query.myListingsAll(
					{},
					{
						page: 1,
						pageSize: 10,
						searchText: 'camera',
						statusFilters: ['Published'],
					},
					context,
				);
			});
			Then(
				'it should call Listing.ItemListing.queryPaged with those filters',
				() => {
					expect(
						context.applicationServices.Listing.ItemListing.queryPaged,
					).toHaveBeenCalledWith({
						page: 1,
						pageSize: 10,
						searchText: 'camera',
						statusFilters: ['Published'],
						sharerId: 'user-1',
					});
				},
			);
			And('it should return matching listings only', () => {
				const resultPage = result as ListingAllPage;
				const firstItem = resultPage.items[0];
				expect(firstItem?.title).toBe('Digital Camera');
			});
		},
	);

	Scenario(
		'Querying myListingsAll without authentication',
		({ Given, When, Then, And }) => {
			Given('a user without a verifiedJwt in their context', () => {
				context = makeMockGraphContext({
					applicationServices: {
						...makeMockGraphContext().applicationServices,
						verifiedUser: null,
					},
				});
				vi.mocked(
					context.applicationServices.Listing.ItemListing.queryPaged,
				).mockResolvedValue({
					items: [createMockListing()],
					total: 1,
					page: 1,
					pageSize: 10,
				});
			});
			When('the myListingsAll query is executed', async () => {
				result = await itemListingResolvers.Query.myListingsAll(
					{},
					{ page: 1, pageSize: 10 },
					context,
				);
			});
			Then('it should call Listing.ItemListing.queryPaged without sharerId', () => {
				expect(
					context.applicationServices.Listing.ItemListing.queryPaged,
				).toHaveBeenCalledWith({
					page: 1,
					pageSize: 10,
				});
			});
			And('it should still return paged results', () => {
				expect(result).toHaveProperty('items');
				expect(result).toHaveProperty('total');
			});
		},
	);

	Scenario('Error while querying myListingsAll', ({ Given, When, Then }) => {
		Given('Listing.ItemListing.queryPaged throws an error', () => {
			context = makeMockGraphContext();
			vi.mocked(
				context.applicationServices.Listing.ItemListing.queryPaged,
			).mockRejectedValue(new Error('Pagination failed'));
		});
		When('the myListingsAll query is executed', async () => {
			try {
				await itemListingResolvers.Query.myListingsAll(
					{},
					{ page: 1, pageSize: 10 },
					context,
				);
			} catch (e) {
				error = e as Error;
			}
		});
		Then('it should propagate the error message', () => {
			expect(error).toBeDefined();
			expect(error?.message).toBe('Pagination failed');
		});
	});

	Scenario('Creating an item listing successfully', ({ Given, And, When, Then }) => {
		let input: CreateItemListingInput;
		Given('a user with a verifiedJwt containing email', () => {
			context = makeMockGraphContext();
		});
		And(
			'a valid CreateItemListingInput with title, description, category, location, sharing period, and images',
			() => {
				input = {
					title: 'New Listing',
					description: 'New description',
					category: 'Electronics',
					location: 'Delhi',
					sharingPeriodStart: '2025-10-06',
					sharingPeriodEnd: '2025-11-06',
					images: ['image1.jpg'],
					isDraft: false,
				};
				vi.mocked(
					context.applicationServices.User.PersonalUser.queryByEmail,
				).mockResolvedValue(createMockUser());
				vi.mocked(
					context.applicationServices.Listing.ItemListing.create,
				).mockResolvedValue(createMockListing({ title: 'New Listing' }));
			},
		);
		When('the createItemListing mutation is executed', async () => {
			result = await itemListingResolvers.Mutation.createItemListing(
				{},
				{ input },
				context,
			);
		});
		Then(
			"it should call User.PersonalUser.queryByEmail with the user's email",
			() => {
				expect(
					context.applicationServices.User.PersonalUser.queryByEmail,
				).toHaveBeenCalledWith({
					email: 'test@example.com',
				});
			},
		);
		And('call Listing.ItemListing.create with the constructed command', () => {
			expect(
				context.applicationServices.Listing.ItemListing.create,
			).toHaveBeenCalled();
		});
		And('map the result using toGraphItem', () => {
			expect(result).toBeDefined();
		});
		And('it should return the created listing', () => {
			expect(result).toHaveProperty('title');
			expect((result as { title: string }).title).toBe('New Listing');
		});
	});

	Scenario(
		'Creating an item listing without authentication',
		({ Given, When, Then }) => {
			Given('a user without a verifiedJwt in their context', () => {
				context = makeMockGraphContext({
					applicationServices: {
						...makeMockGraphContext().applicationServices,
						verifiedUser: null,
					},
				});
			});
			When('the createItemListing mutation is executed', async () => {
				try {
					await itemListingResolvers.Mutation.createItemListing(
						{},
						{
							input: {
								title: 'Test',
								description: 'Test',
								category: 'Test',
								location: 'Test',
								sharingPeriodStart: '2025-10-06',
								sharingPeriodEnd: '2025-11-06',
							},
						},
						context,
					);
				} catch (e) {
					error = e as Error;
				}
			});
			Then('it should throw an "Authentication required" error', () => {
				expect(error).toBeDefined();
				expect(error?.message).toBe('Authentication required');
			});
		},
	);

	Scenario(
		'Creating an item listing for a non-existent user',
		({ Given, When, Then }) => {
			Given(
				'a user with a verifiedJwt containing an email not found in the database',
				() => {
					context = makeMockGraphContext();
					vi.mocked(
						context.applicationServices.User.PersonalUser.queryByEmail,
					).mockResolvedValue(null);
				},
			);
			When('the createItemListing mutation is executed', async () => {
				try {
					await itemListingResolvers.Mutation.createItemListing(
						{},
						{
							input: {
								title: 'Test',
								description: 'Test',
								category: 'Test',
								location: 'Test',
								sharingPeriodStart: '2025-10-06',
								sharingPeriodEnd: '2025-11-06',
							},
						},
						context,
					);
				} catch (e) {
					error = e as Error;
				}
			});
			Then('it should throw a "User not found" error', () => {
				expect(error).toBeDefined();
				expect(error?.message).toContain('User not found');
			});
		},
	);

	Scenario(
		'Error while creating an item listing',
		({ Given, When, Then }) => {
			Given('Listing.ItemListing.create throws an error', () => {
				context = makeMockGraphContext();
				vi.mocked(
					context.applicationServices.User.PersonalUser.queryByEmail,
				).mockResolvedValue(createMockUser());
				vi.mocked(
					context.applicationServices.Listing.ItemListing.create,
				).mockRejectedValue(new Error('Creation failed'));
			});
			When('the createItemListing mutation is executed', async () => {
				try {
					await itemListingResolvers.Mutation.createItemListing(
						{},
						{
							input: {
								title: 'Test',
								description: 'Test',
								category: 'Test',
								location: 'Test',
								sharingPeriodStart: '2025-10-06',
								sharingPeriodEnd: '2025-11-06',
							},
						},
						context,
					);
				} catch (e) {
					error = e as Error;
				}
			});
			Then('it should propagate the error message', () => {
				expect(error).toBeDefined();
				expect(error?.message).toBe('Creation failed');
			});
		},
	);

	Scenario(
		'Mapping item listing fields for myListingsAll',
		({ Given, When, Then, And }) => {
			Given('a valid result from queryPaged', () => {
				context = makeMockGraphContext();
				const mockListing = createMockListing({
					id: 'test-id',
					title: 'Test Title',
					images: ['test-image.jpg'],
					state: 'Drafted',
					createdAt: new Date('2023-01-01T00:00:00Z'),
					sharingPeriodStart: new Date('2025-01-01'),
					sharingPeriodEnd: new Date('2025-01-31'),
				});
				vi.mocked(
					context.applicationServices.Listing.ItemListing.queryPaged,
				).mockResolvedValue({
					items: [mockListing],
					total: 1,
					page: 1,
					pageSize: 10,
				});
			});
			When('items are mapped', async () => {
				result = await itemListingResolvers.Query.myListingsAll(
					{},
					{ page: 1, pageSize: 10 },
					context,
				);
			});
			Then(
				'each listing should include id, title, image, publishedAt, reservationPeriod, status, and pendingRequestsCount',
				() => {
					const resultPage = result as ListingAllPage;
					const { items } = resultPage;
					const firstItem = items[0];
					expect(firstItem).toHaveProperty('id', 'test-id');
					expect(firstItem).toHaveProperty('title', 'Test Title');
					expect(firstItem).toHaveProperty('image', 'test-image.jpg');
					expect(firstItem).toHaveProperty('publishedAt');
					expect(firstItem).toHaveProperty('reservationPeriod');
					expect(firstItem).toHaveProperty('status');
					expect(firstItem).toHaveProperty('pendingRequestsCount', 0);
				},
			);
			And('missing images should map image to null', () => {
				// Test with empty images array
				const mockListingNoImages = createMockListing({ images: [] });
				vi.mocked(
					context.applicationServices.Listing.ItemListing.queryPaged,
				).mockResolvedValue({
					items: [mockListingNoImages],
					total: 1,
					page: 1,
					pageSize: 10,
				});
			});
			And('missing or blank states should map status to "Unknown"', () => {
				const resultPage = result as ListingAllPage;
				const { items } = resultPage;
				const firstItem = items[0];
				expect(firstItem?.status).toBe('Draft'); // 'Drafted' -> 'Draft'
			});
		},
	);
});
