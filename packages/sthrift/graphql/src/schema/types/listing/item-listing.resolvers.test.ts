import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import { expect, vi } from 'vitest';
import type { GraphContext } from '../../../init/context.ts';
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
		listingType: 'item',
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
					update: vi.fn(),
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
					context.applicationServices.Listing.ItemListing.queryAll,
				).mockResolvedValue([createMockListing()]);
			});
			When('the itemListings query is executed', async () => {
				const resolver = itemListingResolvers.Query!.itemListings as Function;
				result = await resolver({}, {}, context, {} as never);
			});
			Then(
				"it should call Listing.ItemListing.queryAll",
				() => {
					expect(
						context.applicationServices.Listing.ItemListing.queryAll,
					).toHaveBeenCalledWith({});
				},
			);
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
				const resolver = itemListingResolvers.Query!.itemListings as Function;
				result = await resolver({}, {}, context, {} as never);
			});
			Then('it should call Listing.ItemListing.queryAll', () => {
				expect(
					context.applicationServices.Listing.ItemListing.queryAll,
				).toHaveBeenCalledWith({});
			});
			And(
				'it should return all available listings',
				() => {
					expect(result).toBeDefined();
					expect(Array.isArray(result)).toBe(true);
				},
			);
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
				const resolver = itemListingResolvers.Query!.itemListings as Function;
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

	Scenario('Querying a single item listing by ID', ({ Given, When, Then, And }) => {
		Given('a valid listing ID', () => {
			context = makeMockGraphContext();
			vi.mocked(
				context.applicationServices.Listing.ItemListing.queryById,
			).mockResolvedValue(createMockListing());
		});
		When('the itemListing query is executed with that ID', async () => {
			const resolver = itemListingResolvers.Query!.itemListing as Function;
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
				const resolver = itemListingResolvers.Query!.itemListing as Function;
				result = await resolver({}, { id: 'nonexistent-id' }, context, {} as never);
			});
			Then('it should return null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario('Querying paginated listings for the current user', ({ Given, And, When, Then }) => {
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
			const resolver = itemListingResolvers.Query!.myListingsAll as Function;
			result = await resolver({}, { page: 1, pageSize: 10 }, context, {} as never);
		});
		Then('it should call Listing.ItemListing.queryPaged with sharerId, page, and pageSize', () => {
			expect(
				context.applicationServices.Listing.ItemListing.queryPaged,
			).toHaveBeenCalledWith(
				expect.objectContaining({
					page: 1,
					pageSize: 10,
					sharerId: 'user-1',
				}),
			);
		});
		And('it should return items, total, page, and pageSize in the response', () => {
			expect(result).toHaveProperty('items');
			expect(result).toHaveProperty('total');
			expect(result).toHaveProperty('page');
			expect(result).toHaveProperty('pageSize');
		});
	});

	Scenario('Querying myListingsAll without authentication', ({ Given, When, Then }) => {
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
			const resolver = itemListingResolvers.Query!.myListingsAll as Function;
			result = await resolver({}, { page: 1, pageSize: 10 }, context, {} as never);
		});
		Then('it should call Listing.ItemListing.queryPaged without sharerId', () => {
			expect(
				context.applicationServices.Listing.ItemListing.queryPaged,
			).toHaveBeenCalledWith(
				expect.not.objectContaining({
					sharerId: expect.anything(),
				}),
			);
		});
	});

	Scenario('Creating an item listing successfully', ({ Given, And, When, Then }) => {
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
			const resolver = itemListingResolvers.Mutation!.createItemListing as Function;
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
		And('call Listing.ItemListing.create with the constructed command', () => {
			expect(
				context.applicationServices.Listing.ItemListing.create,
			).toHaveBeenCalled();
		});
		And('it should return the created listing', () => {
			expect(result).toBeDefined();
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
					const resolver = itemListingResolvers.Mutation!.createItemListing as Function;
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
					const resolver = itemListingResolvers.Mutation!.createItemListing as Function;
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
});
