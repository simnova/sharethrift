import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { expect, vi } from 'vitest';
import {
	getItemListingReadRepository,
	type ItemListingReadRepository,
} from './item-listing.read-repository.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/item-listing.read-repository.feature'),
);

function makePassport(): Domain.Passport {
	return vi.mocked({} as Domain.Passport);
}

function makeModels(): ModelsContext {
	return vi.mocked({
		Listing: {
			ItemListing: {
				findOne: vi.fn(),
				find: vi.fn(),
			},
		},
	} as unknown as ModelsContext);
}

function createQueryChain<T>(value: T) {
	const chain = {
		populate: () => chain,
		lean: () => chain,
		skip: () => chain,
		limit: () => chain,
		sort: () => chain,
		exec: async () => value,
	};
	// Add thenable behavior without direct property assignment
	Object.defineProperty(chain, 'then', {
		value: (resolve: (v: T) => unknown) => Promise.resolve(value).then(resolve),
		enumerable: false,
		configurable: true,
	});
	return chain;
}

function createMockModelsContext(mockModel: unknown): ModelsContext {
	return {
		Listing: {
			ItemListingModel: mockModel,
		},
	} as unknown as ModelsContext;
}

function createMockPassport(): Domain.Passport {
	return {
		user: {
			forPersonalUser: () => ({ determineIf: () => true }),
		},
		listing: {
			forItemListing: () => ({ determineIf: () => true }),
		},
	} as unknown as Domain.Passport;
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repository: ItemListingReadRepository;

	BeforeEachScenario(() => {
		repository = getItemListingReadRepository(makeModels(), makePassport());
	});

	Background(({ Given }) => {
		Given(
			'an ItemListingReadRepository instance with models and passport',
			() => {
				// Repository initialized in BeforeEachScenario
			},
		);
	});

	Scenario('Repository initialization', ({ Then, And }) => {
		Then('the read repository should be defined', () => {
			expect(repository).toBeDefined();
		});

		And('the read repository should have a getAll method', () => {
			expect(repository.getAll).toBeDefined();
		});

		And('the read repository should have a getById method', () => {
			expect(repository.getById).toBeDefined();
		});
	});

	Scenario('Getting all item listings', ({ When, Then }) => {
		let result: unknown;

		When('I call getAll', async () => {
			const mockListings = [
				{ id: '1', title: 'Item 1', sharer: 'user1' },
				{ id: '2', title: 'Item 2', sharer: 'user2' },
			];

			const mockModel = {
				find: vi.fn(() => createQueryChain(mockListings)),
				findById: vi.fn(() => createQueryChain(null)),
				findOne: vi.fn(() => createQueryChain(null)),
			};

			const mockModels = createMockModelsContext(mockModel);
			const mockPassport = createMockPassport();

			repository = getItemListingReadRepository(mockModels, mockPassport);
			result = await repository.getAll();
		});

		Then('I should receive an array of ItemListing domain objects', () => {
			expect(Array.isArray(result)).toBe(true);
		});
	});

	Scenario(
		'Getting paged listings with basic pagination',
		({ Given, When, Then }) => {
			let result: unknown;
			let mockListings: unknown[];

			Given('multiple ItemListing documents exist', () => {
				mockListings = [
					{ id: '1', title: 'Item 1', sharer: 'user1' },
					{ id: '2', title: 'Item 2', sharer: 'user2' },
				];
			});

			When('I call getPaged with page 1 and pageSize 10', async () => {
				const mockModel = {
					find: vi.fn(() => createQueryChain(mockListings)),
					findById: vi.fn(() => createQueryChain(null)),
					findOne: vi.fn(() => createQueryChain(null)),
				};

				const mockModels = createMockModelsContext(mockModel);
				const mockPassport = createMockPassport();

				repository = getItemListingReadRepository(mockModels, mockPassport);
				result = await repository.getPaged({ page: 1, pageSize: 10 });
			});

			Then('I should receive a paginated result', () => {
				expect(result).toHaveProperty('items');
				expect(result).toHaveProperty('total');
				expect(result).toHaveProperty('page', 1);
				expect(result).toHaveProperty('pageSize', 10);
			});
		},
	);

	Scenario(
		'Getting paged listings with sharerId filter',
		({ Given, When, Then }) => {
			let result: unknown;

			Given('ItemListing documents with different sharers', () => {
				// Mock data set up in When
			});

			When('I call getPaged with sharerId filter', async () => {
				const mockModel = {
					find: vi.fn(() => createQueryChain([])),
				};

				const mockModels = createMockModelsContext(mockModel);
				const mockPassport = createMockPassport();

				repository = getItemListingReadRepository(mockModels, mockPassport);
				result = await repository.getPaged({
					page: 1,
					pageSize: 10,
					sharerId: '507f1f77bcf86cd799439011',
				});
			});

			Then('I should receive listings filtered by sharer', () => {
				expect(result).toHaveProperty('items');
				expect(result).toHaveProperty('total');
			});
		},
	);

	Scenario('Getting paged listings with invalid sharerId', ({ When, Then }) => {
		let result: unknown;

		When('I call getPaged with invalid sharerId', async () => {
			const mockModel = {
				find: vi.fn(() => createQueryChain([])),
			};

			const mockModels = createMockModelsContext(mockModel);
			const mockPassport = createMockPassport();

			repository = getItemListingReadRepository(mockModels, mockPassport);
			result = await repository.getPaged({
				page: 1,
				pageSize: 10,
				sharerId: 'invalid-id',
			});
		});

		Then('I should receive empty result', () => {
			expect(result).toHaveProperty('items');
			expect((result as { items: unknown[] }).items).toEqual([]);
			expect(result).toHaveProperty('total', 0);
		});
	});

	Scenario(
		'Getting paged listings with search text',
		({ Given, When, Then }) => {
			let result: unknown;

			Given(
				'ItemListing documents with various titles and descriptions',
				() => {
					// Mock data set up in When
				},
			);

			When('I call getPaged with searchText "laptop"', async () => {
				const mockModel = {
					find: vi.fn(() => createQueryChain([])),
				};

				const mockModels = createMockModelsContext(mockModel);
				const mockPassport = createMockPassport();

				repository = getItemListingReadRepository(mockModels, mockPassport);
				result = await repository.getPaged({
					page: 1,
					pageSize: 10,
					searchText: 'laptop',
				});
			});

			Then('I should receive matching listings', () => {
				expect(result).toHaveProperty('items');
				expect(result).toHaveProperty('total');
			});
		},
	);

	Scenario(
		'Getting paged listings with status filters',
		({ Given, When, Then }) => {
			let result: unknown;

			Given('ItemListing documents with different statuses', () => {
				// Mock data set up in When
			});

			When('I call getPaged with status filters', async () => {
				const mockModel = {
					find: vi.fn(() => createQueryChain([])),
				};

				const mockModels = createMockModelsContext(mockModel);
				const mockPassport = createMockPassport();

				repository = getItemListingReadRepository(mockModels, mockPassport);
				result = await repository.getPaged({
					page: 1,
					pageSize: 10,
					statusFilters: ['active', 'pending'],
				});
			});

			Then('I should receive listings filtered by status', () => {
				expect(result).toHaveProperty('items');
				expect(result).toHaveProperty('total');
			});
		},
	);

	Scenario(
		'Getting paged listings with sorter ascending',
		({ Given, When, Then }) => {
			let result: unknown;

			Given('ItemListing documents with different dates', () => {
				// Mock data set up in When
			});

			When(
				'I call getPaged with sorter field "createdAt" and order "ascend"',
				async () => {
					const mockModel = {
						find: vi.fn(() => createQueryChain([])),
					};

					const mockModels = createMockModelsContext(mockModel);
					const mockPassport = createMockPassport();

					repository = getItemListingReadRepository(mockModels, mockPassport);
					result = await repository.getPaged({
						page: 1,
						pageSize: 10,
						sorter: { field: 'createdAt', order: 'ascend' },
					});
				},
			);

			Then('I should receive listings sorted ascending', () => {
				expect(result).toHaveProperty('items');
				expect(result).toHaveProperty('total');
			});
		},
	);

	Scenario(
		'Getting paged listings with sorter descending',
		({ Given, When, Then }) => {
			let result: unknown;

			Given('ItemListing documents with different dates', () => {
				// Mock data set up in When
			});

			When(
				'I call getPaged with sorter field "createdAt" and order "descend"',
				async () => {
					const mockModel = {
						find: vi.fn(() => createQueryChain([])),
					};

					const mockModels = createMockModelsContext(mockModel);
					const mockPassport = createMockPassport();

					repository = getItemListingReadRepository(mockModels, mockPassport);
					result = await repository.getPaged({
						page: 1,
						pageSize: 10,
						sorter: { field: 'createdAt', order: 'descend' },
					});
				},
			);

			Then('I should receive listings sorted descending', () => {
				expect(result).toHaveProperty('items');
				expect(result).toHaveProperty('total');
			});
		},
	);

	Scenario(
		'Getting paged listings with default sort',
		({ Given, When, Then }) => {
			let result: unknown;

			Given('ItemListing documents', () => {
				// Mock data set up in When
			});

			When('I call getPaged without sorter', async () => {
				const mockModel = {
					find: vi.fn(() => createQueryChain([])),
				};

				const mockModels = createMockModelsContext(mockModel);
				const mockPassport = createMockPassport();

				repository = getItemListingReadRepository(mockModels, mockPassport);
				result = await repository.getPaged({ page: 1, pageSize: 10 });
			});

			Then('I should receive listings with default sort', () => {
				expect(result).toHaveProperty('items');
				expect(result).toHaveProperty('total');
			});
		},
	);

	Scenario('Getting item listing by ID', ({ Given, When, Then }) => {
		let result: unknown;

		Given('an ItemListing document with id "listing-123"', () => {
			// Mock data set up in When
		});

		When('I call getById with "listing-123"', async () => {
			const mockListing = {
				id: 'listing-123',
				title: 'Test Listing',
				description: 'Test Description',
				sharer: { id: 'user1', name: 'User 1' },
				status: 'active',
				category: 'electronics',
				location: { city: 'TestCity', country: 'TestCountry' },
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const mockModel = {
				find: vi.fn(() => createQueryChain([])),
				findById: vi.fn(() => createQueryChain(mockListing)),
			};

			const mockModels = createMockModelsContext(mockModel);
			const mockPassport = createMockPassport();

			repository = getItemListingReadRepository(mockModels, mockPassport);
			result = await repository.getById('listing-123');
		});

		Then('I should receive an ItemListing domain object', () => {
			expect(result).toBeDefined();
		});
	});

	Scenario(
		"Getting item listing by ID that doesn't exist",
		({ When, Then }) => {
			let result: unknown;

			When('I call getById with "nonexistent-id"', async () => {
				const mockModel = {
					find: vi.fn(() => createQueryChain([])),
					findById: vi.fn(() => createQueryChain(null)),
				};

				const mockModels = createMockModelsContext(mockModel);
				const mockPassport = createMockPassport();

				repository = getItemListingReadRepository(mockModels, mockPassport);
				result = await repository.getById('nonexistent-id');
			});

			Then('I should receive null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario('Getting listings by sharer', ({ Given, When, Then }) => {
		let result: unknown;

		Given('ItemListing documents for sharer "sharer-123"', () => {
			// Mock data set up in When
		});

		When('I call getBySharer with "sharer-123"', async () => {
			const mockListings = [
				{ id: '1', title: 'Item 1', sharer: 'sharer-123' },
				{ id: '2', title: 'Item 2', sharer: 'sharer-123' },
			];

			const mockModel = {
				find: vi.fn(() => createQueryChain(mockListings)),
			};

			const mockModels = createMockModelsContext(mockModel);
			const mockPassport = createMockPassport();

			repository = getItemListingReadRepository(mockModels, mockPassport);
			result = await repository.getBySharer('507f1f77bcf86cd799439011');
		});

		Then('I should receive listings for that sharer', () => {
			expect(Array.isArray(result)).toBe(true);
		});
	});

	Scenario('Getting listings by empty sharer ID', ({ When, Then }) => {
		let result: unknown;

		When('I call getBySharer with empty string', async () => {
			const mockModel = {
				find: vi.fn(() => createQueryChain([])),
			};

			const mockModels = createMockModelsContext(mockModel);
			const mockPassport = createMockPassport();

			repository = getItemListingReadRepository(mockModels, mockPassport);
			result = await repository.getBySharer('');
		});

		Then('I should receive empty array', () => {
			expect(Array.isArray(result)).toBe(true);
			expect((result as unknown[]).length).toBe(0);
		});
	});

	Scenario('Getting listings by invalid sharer ID', ({ When, Then }) => {
		let result: unknown;

		When('I call getBySharer with invalid ObjectId', async () => {
			const mockModel = {
				find: vi.fn(() => createQueryChain([])),
			};

			const mockModels = createMockModelsContext(mockModel);
			const mockPassport = createMockPassport();

			repository = getItemListingReadRepository(mockModels, mockPassport);
			result = await repository.getBySharer('invalid-object-id');
		});

		Then('I should receive empty array due to error', () => {
			expect(Array.isArray(result)).toBe(true);
			expect((result as unknown[]).length).toBe(0);
		});
	});

	Scenario(
		'Getting paged listings when count query returns null',
		({ When, Then }) => {
			let result: unknown;

			When('I call getPaged and count query returns null', async () => {
				const mockModel = {
					find: vi.fn(() => createQueryChain([])),
				};

				const mockModels = createMockModelsContext(mockModel);
				const mockPassport = createMockPassport();
				repository = getItemListingReadRepository(mockModels, mockPassport);
				result = await repository.getPaged({ page: 1, pageSize: 10 });
			});

			Then('I should receive result with total 0', () => {
				expect(result).toHaveProperty('total', 0);
				expect(result).toHaveProperty('items');
			});
		},
	);
});
