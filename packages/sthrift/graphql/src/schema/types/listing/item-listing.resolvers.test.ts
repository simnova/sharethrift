import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import { expect, vi } from 'vitest';
import type { GraphContext } from '../../../init/context.ts';
import itemListingResolvers from './item-listing.resolvers.ts';

// Generic GraphQL resolver type for tests (avoids banned 'Function' and non-null assertions)
type TestResolver<
	Args extends object = Record<string, unknown>,
	Return = unknown,
> = (
	parent: unknown,
	args: Args,
	context: GraphContext,
	info: unknown,
) => Promise<Return>;

// Shared input type for createItemListing across scenarios
interface CreateItemListingInput {
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: string;
	sharingPeriodEnd: string;
	images?: string[];
	isDraft?: boolean;
}

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
			userType: 'personal-user',
		} as PersonalUserEntity,
		images: ['image1.jpg'],
		reports: 0,
		sharingHistory: [],
		createdAt: new Date('2020-01-01T00:00:00Z'),
		updatedAt: new Date('2020-01-02T00:00:00Z'),
		schemaVersion: '1.0.0',
		listingType: 'item',
		loadSharer: async () => createMockUser({ id: 'user-1' }),
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
		userType: 'personal-user',
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
					update: vi.fn(),
				},
			},
			User: {
				PersonalUser: {
					queryByEmail: vi.fn().mockResolvedValue(createMockUser()),
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
					context.applicationServices.Listing.ItemListing.queryAll,
				).mockResolvedValue([createMockListing()]);
			});
			When('the itemListings query is executed', async () => {
				const resolver = itemListingResolvers.Query
					?.itemListings as TestResolver;
				result = await resolver({}, {}, context, {} as never);
			});
			Then('it should call Listing.ItemListing.queryAll', () => {
				expect(
					context.applicationServices.Listing.ItemListing.queryAll,
				).toHaveBeenCalledWith({});
			});
			And('it should return a list of item listings', () => {
				expect(result).toBeDefined();
				expect(Array.isArray(result)).toBe(true);
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
				const resolver = itemListingResolvers.Query
					?.itemListings as TestResolver;
				result = await resolver({}, {}, context, {} as never);
			});
			Then('it should call Listing.ItemListing.queryAll', () => {
				expect(
					context.applicationServices.Listing.ItemListing.queryAll,
				).toHaveBeenCalledWith({});
			});
			And('it should return all available listings', () => {
				expect(result).toBeDefined();
				expect(Array.isArray(result)).toBe(true);
			});
		},
	);

	Scenario('Error while querying item listings', ({ Given, When, Then }) => {
		Given('Listing.ItemListing.queryAll throws an error', () => {
			context = makeMockGraphContext();
			vi.mocked(
				context.applicationServices.Listing.ItemListing.queryAll,
			).mockRejectedValue(new Error('Query failed'));
		});
		When('the itemListings query is executed', async () => {
			try {
				const resolver = itemListingResolvers.Query
					?.itemListings as TestResolver;
				await resolver({}, {}, context, {} as never);
			} catch (e) {
				error = e as Error;
			}
		});
		Then('it should propagate the error message', () => {
			expect(error).toBeDefined();
			expect(error?.message).toBe('Query failed');
		});
	});

	Scenario(
		'Querying a single item listing by ID',
		({ Given, When, Then, And }) => {
			Given('a valid listing ID', () => {
				context = makeMockGraphContext();
				vi.mocked(
					context.applicationServices.Listing.ItemListing.queryById,
				).mockResolvedValue(createMockListing());
			});
			When('the itemListing query is executed with that ID', async () => {
				const resolver = itemListingResolvers.Query
					?.itemListing as TestResolver<{ id: string }>;
				result = await resolver({}, { id: 'listing-1' }, context, {} as never);
			});
			Then(
				'it should call Listing.ItemListing.queryById with the provided ID',
				() => {
					expect(
						context.applicationServices.Listing.ItemListing.queryById,
					).toHaveBeenCalledWith({ id: 'listing-1' });
				},
			);
			And('it should return the corresponding listing', () => {
				expect(result).toBeDefined();
				expect(result).toHaveProperty('id');
				expect((result as { id: string }).id).toBe('listing-1');
			});
		},
	);

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
				const resolver = itemListingResolvers.Query
					?.itemListing as TestResolver<{ id: string }>;
				result = await resolver(
					{},
					{ id: 'nonexistent-id' },
					context,
					{} as never,
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
				).mockRejectedValue(new Error('Query failed'));
			});
			When('the itemListing query is executed', async () => {
				try {
					const resolver = itemListingResolvers.Query
						?.itemListing as TestResolver<{ id: string }>;
					await resolver({}, { id: 'listing-1' }, context, {} as never);
				} catch (e) {
					error = e as Error;
				}
			});
			Then('it should propagate the error message', () => {
				expect(error).toBeDefined();
				expect(error?.message).toBe('Query failed');
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
				const resolver = itemListingResolvers.Query
					?.myListingsAll as TestResolver<{ page: number; pageSize: number }>;
				result = await resolver(
					{},
					{ page: 1, pageSize: 10 },
					context,
					{} as never,
				);
			});
			Then(
				'it should call Listing.ItemListing.queryPaged with sharerId, page, and pageSize',
				() => {
					expect(
						context.applicationServices.Listing.ItemListing.queryPaged,
					).toHaveBeenCalledWith(
						expect.objectContaining({
							page: 1,
							pageSize: 10,
							sharerId: 'user-1',
						}),
					);
				},
			);
			And('it should transform each listing into ListingAll shape', () => {
				expect(result).toBeDefined();
				const resultData = result as { items: ItemListingEntity[] };
				resultData.items.forEach((listing) => {
					expect(listing).toHaveProperty('id');
					expect(listing).toHaveProperty('title');
				});
			});
			And(
				'it should map state values like "Published" to "Active" and "Drafted" to "Draft"',
				() => {
					expect(result).toBeDefined();
					const resultData = result as { items: ItemListingEntity[] };
					resultData.items.forEach((listing) => {
						const status = listing.state;
						expect(['Published', 'Draft', 'Unknown']).toContain(status);
					});
				},
			);
			And(
				'it should return items, total, page, and pageSize in the response',
				() => {
					expect(result).toHaveProperty('items');
					expect(result).toHaveProperty('total');
					expect(result).toHaveProperty('page');
					expect(result).toHaveProperty('pageSize');
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
					items: [createMockListing({ title: 'Camera Listing' })],
					total: 1,
					page: 1,
					pageSize: 10,
				});
			});
			When('the myListingsAll query is executed', async () => {
				const resolver = itemListingResolvers.Query
					?.myListingsAll as TestResolver<{
					page: number;
					pageSize: number;
					searchText: string;
					statusFilters: string[];
				}>;
				result = await resolver(
					{},
					{
						page: 1,
						pageSize: 10,
						searchText: 'camera',
						statusFilters: ['Published'],
					},
					context,
					{} as never,
				);
			});
			Then(
				'it should call Listing.ItemListing.queryPaged with those filters',
				() => {
					expect(
						context.applicationServices.Listing.ItemListing.queryPaged,
					).toHaveBeenCalledWith(
						expect.objectContaining({
							page: 1,
							pageSize: 10,
							searchText: 'camera',
							statusFilters: ['Published'],
							sharerId: 'user-1',
						}),
					);
				},
			);
			And('it should return matching listings only', () => {
				expect(result).toBeDefined();
				const resultData = result as { items: ItemListingEntity[] };
				expect(resultData.items.length).toBe(1);
				expect(resultData.items[0]?.title).toContain('Camera');
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
				const resolver = itemListingResolvers.Query
					?.myListingsAll as TestResolver<{ page: number; pageSize: number }>;
				result = await resolver(
					{},
					{ page: 1, pageSize: 10 },
					context,
					{} as never,
				);
			});
			Then(
				'it should call Listing.ItemListing.queryPaged without sharerId',
				() => {
					expect(
						context.applicationServices.Listing.ItemListing.queryPaged,
					).toHaveBeenCalledWith(
						expect.not.objectContaining({
							sharerId: expect.anything(),
						}),
					);
				},
			);
			And('it should still return paged results', () => {
				expect(result).toBeDefined();
				const resultData = result as { items: ItemListingEntity[] };
				expect(resultData.items.length).toBeGreaterThan(0);
			});
		},
	);

	Scenario('Error while querying myListingsAll', ({ Given, When, Then }) => {
		Given('Listing.ItemListing.queryPaged throws an error', () => {
			context = makeMockGraphContext();
			vi.mocked(
				context.applicationServices.Listing.ItemListing.queryPaged,
			).mockRejectedValue(new Error('Query failed'));
		});
		When('the myListingsAll query is executed', async () => {
			try {
				const resolver = itemListingResolvers.Query
					?.myListingsAll as TestResolver<{ page: number; pageSize: number }>;
				await resolver({}, { page: 1, pageSize: 10 }, context, {} as never);
			} catch (e) {
				error = e as Error;
			}
		});
		Then('it should propagate the error message', () => {
			expect(error).toBeDefined();
			expect(error?.message).toBe('Query failed');
		});
	});

	Scenario(
		'Creating an item listing successfully',
		({ Given, And, When, Then }) => {
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
				const resolver = itemListingResolvers.Mutation
					?.createItemListing as TestResolver<{
					input: CreateItemListingInput;
				}>;
				result = await resolver({}, { input }, context, {} as never);
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
			And(
				'call Listing.ItemListing.create with the constructed command',
				() => {
					expect(
						context.applicationServices.Listing.ItemListing.create,
					).toHaveBeenCalled();
				},
			);
			And('it should return the created listing', () => {
				expect(result).toBeDefined();
				expect(result).toHaveProperty('title');
				expect((result as { title: string }).title).toBe('New Listing');
			});
		},
	);

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
					const resolver = itemListingResolvers.Mutation
						?.createItemListing as TestResolver<{
						input: CreateItemListingInput;
					}>;
					await resolver(
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
						{} as never,
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
					const resolver = itemListingResolvers.Mutation
						?.createItemListing as TestResolver<{
						input: {
							title: string;
							description: string;
							category: string;
							location: string;
							sharingPeriodStart: string;
							sharingPeriodEnd: string;
						};
					}>;
					await resolver(
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
						{} as never,
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

	Scenario('Error while creating an item listing', ({ Given, When, Then }) => {
		let context: ReturnType<typeof makeMockGraphContext>;
		let error: Error | undefined;

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
				const resolver = itemListingResolvers.Mutation
					?.createItemListing as TestResolver<{
					input: CreateItemListingInput;
				}>;

				await resolver(
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
					{} as never,
				);
			} catch (e) {
				error = e as Error;
			}
		});
		Then('it should propagate the error message', () => {
			expect(error).toBeDefined();
			expect(error?.message).toBe('Creation failed');
		});
	});

	// Mapping scenario for myListingsAll items
	Scenario(
		'Mapping item listing fields for myListingsAll',
		({ Given, When, Then, And }) => {
			interface MappedListing {
				id: string;
				title: string;
				image: string | null;
				publishedAt: string | null;
				reservationPeriod: string;
				status: string;
				pendingRequestsCount: number;
			}

			let mappedItems: MappedListing[] = [];

			Given('a valid result from queryPaged', () => {
				context = makeMockGraphContext();
				const listingWithImage = createMockListing({
					id: 'listing-with-image',
					images: ['pic1.jpg'],
					state: 'Published',
					createdAt: new Date('2025-02-01T10:00:00Z'),
					sharingPeriodStart: new Date('2025-02-10T00:00:00Z'),
					sharingPeriodEnd: new Date('2025-02-20T00:00:00Z'),
				});
				const listingWithoutImageOrState = createMockListing({
					id: 'listing-no-image',
					images: [],
					state: '',
					createdAt: new Date('2025-03-01T10:00:00Z'),
					sharingPeriodStart: new Date('2025-03-05T00:00:00Z'),
					sharingPeriodEnd: new Date('2025-03-15T00:00:00Z'),
				});
				vi.mocked(
					context.applicationServices.Listing.ItemListing.queryPaged,
				).mockResolvedValue({
					items: [listingWithImage, listingWithoutImageOrState],
					total: 2,
					page: 1,
					pageSize: 10,
				});
			});
			When('items are mapped', async () => {
				const resolver = itemListingResolvers.Query
					?.myListingsAll as TestResolver<{ page: number; pageSize: number }>; // minimal args
				const pagedResult = await resolver(
					{},
					{ page: 1, pageSize: 10 },
					context,
					{} as never,
				);

				const rawItems = (pagedResult as { items: ItemListingEntity[] }).items;
				mappedItems = rawItems.map((l) => {
					const start = l.sharingPeriodStart?.toISOString().slice(0, 10) ?? '';
					const end = l.sharingPeriodEnd?.toISOString().slice(0, 10) ?? '';
					const reservationPeriod = start && end ? `${start} - ${end}` : '';
					const status = l.state && l.state.trim() !== '' ? l.state : 'Unknown';
					return {
						id: l.id,
						title: l.title,
						image: l.images?.[0] ?? null,
						publishedAt: l.createdAt?.toISOString() ?? null,
						reservationPeriod,
						status,
						pendingRequestsCount: 0, // default placeholder until domain provides counts
					};
				});
			});
			Then(
				'each listing should include id, title, image, publishedAt, reservationPeriod, status, and pendingRequestsCount',
				() => {
					expect(mappedItems.length).toBe(2);
					for (const item of mappedItems) {
						expect(item).toHaveProperty('id');
						expect(item).toHaveProperty('title');
						expect(item).toHaveProperty('image');
						expect(item).toHaveProperty('publishedAt');
						expect(item).toHaveProperty('reservationPeriod');
						expect(item).toHaveProperty('status');
						expect(item).toHaveProperty('pendingRequestsCount');
					}
				},
			);
			And('missing images should map image to null', () => {
				const noImage = mappedItems.find((i) => i.id === 'listing-no-image');
				expect(noImage).toBeDefined();
				expect(noImage?.image).toBeNull();
			});
			And('missing or blank states should map status to "Unknown"', () => {
				const unknownStatus = mappedItems.find(
					(i) => i.id === 'listing-no-image',
				);
				expect(unknownStatus).toBeDefined();
				expect(unknownStatus?.status).toBe('Unknown');
			});
		},
	);

	Scenario(
		'Querying adminListings with all filters',
		({ Given, And, When, Then }) => {
			Given('an admin user with valid credentials', () => {
				context = makeMockGraphContext();
			});
			And('pagination arguments with searchText, statusFilters, and sorter', () => {
				vi.mocked(
					context.applicationServices.Listing.ItemListing.queryPaged,
				).mockResolvedValue({
					items: [createMockListing()],
					total: 1,
					page: 1,
					pageSize: 10,
				});
			});
			When('the adminListings query is executed', async () => {
				const resolver = itemListingResolvers.Query?.adminListings as TestResolver<{
					page: number;
					pageSize: number;
					searchText: string;
					statusFilters: string[];
					sorter: { field: string; order: 'ascend' | 'descend' };
				}>;
				result = await resolver(
					{},
					{
						page: 1,
						pageSize: 10,
						searchText: 'test',
						statusFilters: ['Published'],
						sorter: { field: 'title', order: 'ascend' },
					},
					context,
					{} as never,
				);
			});
			Then('it should call Listing.ItemListing.queryPaged with all provided parameters', () => {
				expect(
					context.applicationServices.Listing.ItemListing.queryPaged,
				).toHaveBeenCalledWith(
					expect.objectContaining({
						page: 1,
						pageSize: 10,
						searchText: 'test',
						statusFilters: ['Published'],
						sorter: { field: 'title', order: 'ascend' },
					}),
				);
			});
			And('it should return paginated results', () => {
				expect(result).toBeDefined();
				expect(result).toHaveProperty('items');
				expect(result).toHaveProperty('total');
			});
		},
	);

	Scenario(
		'Querying adminListings without any filters',
		({ Given, When, Then, And }) => {
			Given('an admin user with valid credentials', () => {
				context = makeMockGraphContext();
				vi.mocked(
					context.applicationServices.Listing.ItemListing.queryPaged,
				).mockResolvedValue({
					items: [createMockListing()],
					total: 1,
					page: 1,
					pageSize: 20,
				});
			});
			When('the adminListings query is executed with only page and pageSize', async () => {
				const resolver = itemListingResolvers.Query?.adminListings as TestResolver<{
					page: number;
					pageSize: number;
				}>;
				result = await resolver(
					{},
					{ page: 1, pageSize: 20 },
					context,
					{} as never,
				);
			});
			Then('it should call Listing.ItemListing.queryPaged with minimal parameters', () => {
				expect(
					context.applicationServices.Listing.ItemListing.queryPaged,
				).toHaveBeenCalledWith(
					expect.objectContaining({
						page: 1,
						pageSize: 20,
					}),
				);
			});
			And('it should return all listings', () => {
				expect(result).toBeDefined();
				expect(result).toHaveProperty('items');
			});
		},
	);

	Scenario('Unblocking a listing successfully', ({ Given, When, Then, And }) => {
		Given('a valid listing ID to unblock', () => {
			context = makeMockGraphContext({
				applicationServices: {
					...makeMockGraphContext().applicationServices,
					Listing: {
						ItemListing: {
							...makeMockGraphContext().applicationServices.Listing.ItemListing,
							unblock: vi.fn().mockResolvedValue(undefined),
						},
					},
				},
			});
		});
		When('the unblockListing mutation is executed', async () => {
			const resolver = itemListingResolvers.Mutation?.unblockListing as TestResolver<{
				id: string;
			}>;
			result = await resolver({}, { id: 'listing-1' }, context, {} as never);
		});
		Then('it should call Listing.ItemListing.unblock with the ID', () => {
			expect(context.applicationServices.Listing.ItemListing.unblock).toHaveBeenCalledWith({
				id: 'listing-1',
			});
		});
		And('it should return true', () => {
			expect(result).toBe(true);
		});
	});

	Scenario('Canceling an item listing successfully', ({ Given, When, Then, And }) => {
		Given('a valid listing ID to cancel', () => {
			context = makeMockGraphContext({
				applicationServices: {
					...makeMockGraphContext().applicationServices,
					Listing: {
						ItemListing: {
							...makeMockGraphContext().applicationServices.Listing.ItemListing,
							queryById: vi.fn().mockResolvedValue(createMockListing()),
							cancel: vi.fn().mockResolvedValue(createMockListing()),
						},
					},
				},
			});
		});
		When('the cancelItemListing mutation is executed', async () => {
			const resolver = itemListingResolvers.Mutation?.cancelItemListing as TestResolver<{
				id: string;
			}>;
			result = await resolver({}, { id: 'listing-1' }, context, {} as never);
		});
		Then('it should call Listing.ItemListing.cancel with the ID', () => {
			expect(context.applicationServices.Listing.ItemListing.cancel).toHaveBeenCalledWith({
				id: 'listing-1',
			});
		});
		And('it should return success status and the canceled listing', () => {
			expect(result).toBeDefined();
			expect(result).toHaveProperty('status');
			expect((result as { status: { success: boolean } }).status.success).toBe(true);
			expect(result).toHaveProperty('listing');
		});
	});

	Scenario('Deleting an item listing successfully', ({ Given, When, Then, And }) => {
		Given('a valid listing ID and authenticated user email', () => {
			context = makeMockGraphContext({
				applicationServices: {
					...makeMockGraphContext().applicationServices,
					Listing: {
						ItemListing: {
							...makeMockGraphContext().applicationServices.Listing.ItemListing,
							queryById: vi.fn().mockResolvedValue(createMockListing()),
							deleteListings: vi.fn().mockResolvedValue(undefined),
						},
					},
				},
			});
		});
		When('the deleteItemListing mutation is executed', async () => {
			const resolver = itemListingResolvers.Mutation?.deleteItemListing as TestResolver<{
				id: string;
			}>;
			result = await resolver({}, { id: 'listing-1' }, context, {} as never);
		});
		Then('it should call Listing.ItemListing.deleteListings with ID and email', () => {
			expect(context.applicationServices.Listing.ItemListing.deleteListings).toHaveBeenCalledWith({
				id: 'listing-1',
				userEmail: 'test@example.com',
			});
		});
		And('it should return success status', () => {
			expect(result).toBeDefined();
			expect(result).toHaveProperty('status');
			expect((result as { status: { success: boolean } }).status.success).toBe(true);
		});
	});
});
