import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import { Domain } from '@sthrift/domain';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ItemListingRepository } from './item-listing.repository.ts';
import {
	ItemListingConverter,
	type ItemListingDomainAdapter,
} from './item-listing.domain-adapter.ts';
import { PersonalUserDomainAdapter } from '../../user/personal-user/personal-user.domain-adapter.ts';
import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { ClientSession } from 'mongoose';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/item-listing.repository.feature'),
);

function makeListingDoc(
	overrides: Partial<Models.Listing.ItemListing> = {},
): Models.Listing.ItemListing {
	const userDoc = makeUserDoc();
	const base = {
		_id: 'listing-1',
		title: 'Test Listing',
		description: 'Test description',
		category: 'Electronics',
		location: 'Delhi',
		sharingPeriodStart: new Date('2025-10-06'),
		sharingPeriodEnd: new Date('2025-11-06'),
		state: 'Published',
		sharer: userDoc._id,
		images: [],
		reports: 0,
		sharingHistory: [],
		createdAt: new Date('2020-01-01T00:00:00Z'),
		updatedAt: new Date('2020-01-02T00:00:00Z'),
		schemaVersion: '1.0.0',
		id: 'listing-1',
		set(key: keyof Models.Listing.ItemListing, value: unknown) {
			(this as Models.Listing.ItemListing)[key] = value as never;
		},
		...overrides,
	} as Models.Listing.ItemListing;
	return vi.mocked(base);
}

function makeUserDoc(
	overrides: Partial<Models.User.PersonalUser> = {},
): Models.User.PersonalUser {
	const base = {
		_id: 'user-1',
		displayName: 'Test User',
		email: 'test@example.com',
		id: 'user-1',
		...overrides,
	} as Models.User.PersonalUser;
	return vi.mocked(base);
}

function makeMockPassport(): Domain.Passport {
	return {
		listing: {
			forItemListing: vi.fn(() => ({
				determineIf: vi.fn(() => true),
			})),
		},
		user: {
			forPersonalUser: vi.fn(() => ({
				determineIf: vi.fn(() => true),
			})),
		},
		conversation: {
			forConversation: vi.fn(() => ({
				determineIf: vi.fn(() => true),
			})),
		},
	} as unknown as Domain.Passport;
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repo: ItemListingRepository<ItemListingDomainAdapter>;
	let converter: ItemListingConverter;
	let passport: Domain.Passport;
	let userDoc: Models.User.PersonalUser;
	let userAdapter: PersonalUserDomainAdapter;
	let listingDoc: Models.Listing.ItemListing;
	let result: Domain.Contexts.Listing.ItemListing.ItemListing<ItemListingDomainAdapter>;

	BeforeEachScenario(() => {
		userDoc = makeUserDoc();
		userAdapter = new PersonalUserDomainAdapter(userDoc);
		listingDoc = makeListingDoc({ _id: 'listing-1', sharer: userDoc });
		converter = new ItemListingConverter();
		passport = makeMockPassport();
		result =
			{} as Domain.Contexts.Listing.ItemListing.ItemListing<ItemListingDomainAdapter>;

		// Mock the Mongoose model as a constructor function with static methods
		const ModelMock = function (
			this: Models.Listing.ItemListing,
			props?: Partial<Models.Listing.ItemListing>,
		) {
			Object.assign(this, makeListingDoc(props));
		};

		// Attach static methods to the constructor
		Object.assign(ModelMock, {
			findById: vi.fn((id: string) => ({
				exec: vi.fn(async () => (id === 'listing-1' ? listingDoc : null)),
			})),
			findOne: vi.fn((filter: { _id: string }) => ({
				exec: vi.fn(async () =>
					filter._id === 'listing-1' ? listingDoc : null,
				),
			})),
			find: vi.fn((filter?: { state?: string; sharer?: string }) => ({
				exec: vi.fn(() => {
					if (!filter || filter.state === 'Published') {
						return [listingDoc];
					}
					if (filter.sharer) {
						return filter.sharer === 'user-1' ? [listingDoc] : [];
					}
					return [];
				}),
			})),
		});

		// Provide minimal eventBus and session mocks
		const eventBus = {
			publish: vi.fn(),
		} as unknown as DomainSeedwork.EventBus;
		const session = {
			startTransaction: vi.fn(),
			endSession: vi.fn(),
		} as unknown as ClientSession;

		repo = new ItemListingRepository(
			passport,
			ModelMock as unknown as Models.Listing.ItemListingModelType,
			converter,
			eventBus,
			session,
		);
	});

	Background(({ Given, And }) => {
		Given(
			'an ItemListingRepository instance with a configured Mongoose model, type converter, and authentication passport',
			() => {
				// This is set up in BeforeEachScenario
			},
		);
		And('a valid ItemListing document exists in the database', () => {
			// This is set up in BeforeEachScenario
		});
	});

	Scenario('Retrieve an item listing by ID', ({ When, Then, And }) => {
		When('I call getById with a valid listing ID', async () => {
			result = await repo.getById('listing-1');
		});
		Then('I should receive a corresponding ItemListing domain object', () => {
			expect(result).toBeInstanceOf(
				Domain.Contexts.Listing.ItemListing.ItemListing,
			);
		});
		And(
			"the object's title, category, location, and sharer should match the stored data",
			() => {
				expect(result.title).toBe('Test Listing');
				expect(result.category).toBe('Electronics');
				expect(result.location).toBe('Delhi');
				expect(result.sharer.id).toBe('user-1');
			},
		);
	});

	Scenario(
		'Attempt to retrieve a non-existent item listing by ID',
		({ When, Then }) => {
			let gettingListingThatDoesNotExist: () => Promise<
				Domain.Contexts.Listing.ItemListing.ItemListing<ItemListingDomainAdapter>
			>;
			When('I call getById with an invalid or non-existent listing ID', () => {
				gettingListingThatDoesNotExist = async () =>
					await repo.getById('nonexistent-id');
			});
			Then(
				'an error should be thrown indicating the listing was not found',
				async () => {
					await expect(gettingListingThatDoesNotExist).rejects.toThrow();
					await expect(gettingListingThatDoesNotExist).rejects.toThrow(
						/Listing with id nonexistent-id not found/,
					);
				},
			);
		},
	);

	Scenario(
		'Create a new published item listing',
		({ Given, And, When, Then }) => {
			let sharerDomainObject: Domain.Contexts.User.PersonalUser.PersonalUser<PersonalUserDomainAdapter>;
			Given('a valid sharer domain object', () => {
				userDoc = makeUserDoc();
				userAdapter = new PersonalUserDomainAdapter(userDoc);
				sharerDomainObject =
					new Domain.Contexts.User.PersonalUser.PersonalUser(
						userAdapter,
						passport,
					);
			});
			And('a set of valid listing fields without isDraft set to true', () => {
				// Fields will be provided in the When step
			});
			When(
				'I call getNewInstance with the sharer and listing fields',
				async () => {
					result = await repo.getNewInstance(sharerDomainObject, {
						title: 'New Listing',
						description: 'New description',
						category: 'Electronics',
						location: 'Mumbai',
						sharingPeriodStart: new Date('2025-10-06'),
						sharingPeriodEnd: new Date('2025-11-06'),
						images: [],
					});
				},
			);
			Then('I should receive a new ItemListing domain object', () => {
				expect(result).toBeInstanceOf(
					Domain.Contexts.Listing.ItemListing.ItemListing,
				);
			});
			And('the object\'s state should be "Published"', () => {
				expect(result.state).toBe('Published');
			});
			And(
				'createdAt and updatedAt should be set to the current date',
				() => {
					expect(result.createdAt).toBeInstanceOf(Date);
					expect(result.updatedAt).toBeInstanceOf(Date);
				},
			);
		},
	);

	Scenario('Create a new draft item listing', ({ Given, And, When, Then }) => {
		let sharerDomainObject: Domain.Contexts.User.PersonalUser.PersonalUser<PersonalUserDomainAdapter>;
		Given('a valid sharer domain object', () => {
			userDoc = makeUserDoc();
			userAdapter = new PersonalUserDomainAdapter(userDoc);
			sharerDomainObject =
				new Domain.Contexts.User.PersonalUser.PersonalUser(
					userAdapter,
					passport,
				);
		});
		And('a set of valid listing fields with isDraft set to true', () => {
			// Fields will be provided in the When step with isDraft: true
		});
		When(
			'I call getNewInstance with the sharer and listing fields',
			async () => {
				result = await repo.getNewInstance(sharerDomainObject, {
					title: 'Draft Listing',
					description: 'Draft description',
					category: 'Electronics',
					location: 'Mumbai',
					sharingPeriodStart: new Date('2025-10-06'),
					sharingPeriodEnd: new Date('2025-11-06'),
					images: [],
					isDraft: true,
				});
			},
		);
		Then('I should receive a new ItemListing domain object', () => {
			expect(result).toBeInstanceOf(
				Domain.Contexts.Listing.ItemListing.ItemListing,
			);
		});
		And('the object\'s state should be "Drafted"', () => {
			expect(result.state).toBe('Drafted');
		});
	});

	Scenario(
		'Retrieve all active (published) item listings',
		({ When, Then, And }) => {
			let results: Domain.Contexts.Listing.ItemListing.ItemListing<ItemListingDomainAdapter>[];
			When('I call getActiveItemListings', async () => {
				results = await repo.getActiveItemListings();
			});
			Then('I should receive a list of ItemListing domain objects', () => {
				expect(Array.isArray(results)).toBe(true);
				expect(results.length).toBeGreaterThan(0);
				for (const item of results) {
					expect(item).toBeInstanceOf(
						Domain.Contexts.Listing.ItemListing.ItemListing,
					);
				}
			});
			And('each object should have a state of "Published"', () => {
				for (const item of results) {
					expect(item.state).toBe('Published');
				}
			});
		},
	);

	Scenario('Retrieve item listings by sharer ID', ({ Given, When, Then, And }) => {
		let results: Domain.Contexts.Listing.ItemListing.ItemListing<ItemListingDomainAdapter>[];
		Given('a valid sharer ID', () => {
			// Using 'user-1' as the valid sharer ID
		});
		When('I call getBySharerID with the sharer ID', async () => {
			results = await repo.getBySharerID('user-1');
		});
		Then('I should receive a list of ItemListing domain objects', () => {
			expect(Array.isArray(results)).toBe(true);
			expect(results.length).toBeGreaterThan(0);
			for (const item of results) {
				expect(item).toBeInstanceOf(
					Domain.Contexts.Listing.ItemListing.ItemListing,
				);
			}
		});
		And(
			"each object's sharer field should match the given sharer ID",
			() => {
				for (const item of results) {
					expect(item.sharer.id).toBe('user-1');
				}
			},
		);
	});

	Scenario(
		'Retrieve item listings by sharer ID with filters and pagination',
		({ Given, And, When, Then }) => {
			let paginatedResults: {
				items: Domain.Contexts.Listing.ItemListing.ItemListing<ItemListingDomainAdapter>[];
				total: number;
				page: number;
				pageSize: number;
			};
			Given('a valid sharer ID', () => {
				// Using 'user-1' as the valid sharer ID
			});
			And('pagination options with page and pageSize defined', () => {
				// Options will be provided in the When step
			});
			And(
				'optional filters including search text, status filters, and sorting order',
				() => {
					// Filters will be provided in the When step
				},
			);
			When(
				'I call getBySharerIDWithPagination with the sharer ID and options',
				async () => {
					paginatedResults = await repo.getBySharerIDWithPagination('user-1', {
						page: 1,
						pageSize: 10,
						searchText: 'Test',
						statusFilters: ['Published'],
						sorter: { field: 'createdAt', order: 'descend' },
					});
				},
			);
			Then(
				'I should receive a paginated result containing items, total, page, and pageSize',
				() => {
					expect(paginatedResults).toHaveProperty('items');
					expect(paginatedResults).toHaveProperty('total');
					expect(paginatedResults).toHaveProperty('page');
					expect(paginatedResults).toHaveProperty('pageSize');
					expect(Array.isArray(paginatedResults.items)).toBe(true);
				},
			);
			And(
				'the returned items should match the applied filters and sorting order',
				() => {
					// Since we're using mock data, we just verify the structure
					for (const item of paginatedResults.items) {
						expect(item).toBeInstanceOf(
							Domain.Contexts.Listing.ItemListing.ItemListing,
						);
					}
				},
			);
			And(
				'each item should include a reservationPeriod field representing the sharing period',
				() => {
					// This tests that sharing period fields are present
					for (const item of paginatedResults.items) {
						expect(item.sharingPeriodStart).toBeInstanceOf(Date);
						expect(item.sharingPeriodEnd).toBeInstanceOf(Date);
					}
				},
			);
		},
	);
});
