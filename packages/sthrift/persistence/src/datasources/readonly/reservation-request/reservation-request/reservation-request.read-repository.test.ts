import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { ModelsContext } from '../../../../models-context.ts';
import type { Domain } from '@sthrift/domain';
import { ReservationRequestReadRepositoryImpl } from './reservation-request.read-repository.ts';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';

// Helper to create a valid 24-character hex string from a simple ID
function createValidObjectId(id: string): string {
	const hexChars = '0123456789abcdef';
	let hex = '';
	for (let i = 0; i < id.length && hex.length < 24; i++) {
		const charCode = id.charCodeAt(i);
		hex += hexChars[charCode % 16];
	}
	return hex.padEnd(24, '0').substring(0, 24);
}

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(
		__dirname,
		'features/reservation-request.read-repository.feature',
	),
);

function makePassport(): Domain.Passport {
	return vi.mocked({
		reservationRequest: {
			forReservationRequest: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
		user: {
			forPersonalUser: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
		listing: {
			forItemListing: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
	} as unknown as Domain.Passport);
}

function createNullPopulateChain<T>(result: T) {
	const innerLean = { lean: vi.fn(async () => result) };
	const innerPopulate = { populate: vi.fn(() => innerLean) };
	return { populate: vi.fn(() => innerPopulate) };
}

function makeMockUser(id: string): Models.User.PersonalUser {
	return {
		_id: new MongooseSeedwork.ObjectId(createValidObjectId(id)),
		id: id,
		userType: 'end-user',
		isBlocked: false,
		hasCompletedOnboarding: false,
		account: {
			accountType: 'standard',
			email: `${id}@example.com`,
			username: id,
			profile: {
				firstName: 'Test',
				lastName: 'User',
				aboutMe: 'Hello',
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
		role: { id: 'role-1' },
		createdAt: new Date('2020-01-01'),
		updatedAt: new Date('2020-01-02'),
	} as unknown as Models.User.PersonalUser;
}

function makeMockListing(
	id: string,
	sharerId = 'sharer-1',
): Models.Listing.ItemListing {
	return {
		_id: new MongooseSeedwork.ObjectId(createValidObjectId(id)),
		id: id,
		title: 'Test Listing',
		description: 'Test Description',
		sharer: new MongooseSeedwork.ObjectId(createValidObjectId(sharerId)),
	} as unknown as Models.Listing.ItemListing;
}

function makeMockReservationRequest(
	overrides: Partial<Models.ReservationRequest.ReservationRequest> = {},
): Models.ReservationRequest.ReservationRequest {
	const reservationId = overrides.id || 'reservation-1';
	const defaultReservation = {
		_id: new MongooseSeedwork.ObjectId(
			createValidObjectId(reservationId as string),
		),
		id: reservationId,
		state: 'Pending',
		reserver: makeMockUser('user-1'),
		listing: makeMockListing('listing-1'),
		reservationPeriodStart: new Date('2025-10-20'),
		reservationPeriodEnd: new Date('2025-10-25'),
		closeRequestedBySharer: false,
		closeRequestedByReserver: false,
		createdAt: new Date('2020-01-01'),
		updatedAt: new Date('2020-01-02'),
		schemaVersion: '1.0.0',
	};
	return {
		...defaultReservation,
		...overrides,
	} as unknown as Models.ReservationRequest.ReservationRequest;
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repository: ReservationRequestReadRepositoryImpl;
	let mockModel: Models.ReservationRequest.ReservationRequestModelType;
	let mockListingModel: Models.Listing.ItemListingModelType;
	let passport: Domain.Passport;
	let mockReservationRequests: Models.ReservationRequest.ReservationRequest[];
	let result: unknown;

	BeforeEachScenario(() => {
		passport = makePassport();
		mockReservationRequests = [makeMockReservationRequest()];

		// Create mock query that supports chaining and is thenable
		const createMockQuery = (result: unknown) => {
			const mockQuery = {
				lean: vi.fn(),
				populate: vi.fn(),
				sort: vi.fn(),
				limit: vi.fn(),
				select: vi.fn(),
				exec: vi.fn().mockResolvedValue(result),
				catch: vi.fn((onReject) => Promise.resolve(result).catch(onReject)),
			};
			// Configure methods to return the query object for chaining
			mockQuery.lean.mockReturnValue(mockQuery);
			mockQuery.populate.mockReturnValue(mockQuery);
			mockQuery.sort.mockReturnValue(mockQuery);
			mockQuery.limit.mockReturnValue(mockQuery);
			mockQuery.select.mockReturnValue(mockQuery);

			// Make the query thenable (like Mongoose queries are) by adding then as property
			Object.defineProperty(mockQuery, 'then', {
				value: vi.fn((onResolve) => Promise.resolve(result).then(onResolve)),
				enumerable: false,
			});
			return mockQuery;
		};

		mockModel = {
			find: vi.fn(() => createMockQuery(mockReservationRequests)),
			findById: vi.fn(() => createMockQuery(mockReservationRequests[0])),
			findOne: vi.fn(() => createMockQuery(mockReservationRequests[0] || null)),
			countDocuments: vi.fn(() => ({
				exec: vi.fn().mockResolvedValue(mockReservationRequests.length),
			})),
			aggregate: vi.fn(() => ({
				exec: vi.fn().mockResolvedValue(mockReservationRequests),
			})),
		} as unknown as Models.ReservationRequest.ReservationRequestModelType;

		mockListingModel = {
			collection: {
				name: 'item-listings',
			},
			find: vi.fn(() => ({
				select: vi.fn(() => ({
					exec: vi.fn().mockResolvedValue([makeMockListing('listing-1', 'sharer-1')]),
				})),
			})),
		} as unknown as Models.Listing.ItemListingModelType;

		const modelsContext = {
			ReservationRequest: {
				ReservationRequest: mockModel,
			},
			Listing: {
				ItemListingModel: mockListingModel,
			},
		} as unknown as ModelsContext;

		repository = new ReservationRequestReadRepositoryImpl(
			modelsContext,
			passport,
		);
		result = undefined;
	});

	Background(({ Given, And }) => {
		Given(
			'a ReservationRequestReadRepository instance with a working Mongoose model and passport',
			() => {
				// Already set up in BeforeEachScenario
			},
		);
		And('valid ReservationRequest documents exist in the database', () => {
			// Mock documents are set up in BeforeEachScenario
		});
	});

	Scenario('Getting all reservation requests', ({ Given, When, Then, And }) => {
		Given('multiple ReservationRequest documents in the database', () => {
			mockReservationRequests = [
				makeMockReservationRequest(),
				makeMockReservationRequest({
					id: 'reservation-2',
				} as unknown as Partial<Models.ReservationRequest.ReservationRequest>),
			];
		});
		When('I call getAll', async () => {
			result = await repository.getAll();
		});
		Then('I should receive an array of ReservationRequest entities', () => {
			expect(Array.isArray(result)).toBe(true);
			expect((result as unknown[]).length).toBeGreaterThan(0);
		});
		And('the array should contain all reservation requests', () => {
			const reservations =
				result as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[];
			expect(reservations.length).toBe(mockReservationRequests.length);
		});
	});

	Scenario(
		'Getting a reservation request by ID',
		({ Given, When, Then, And }) => {
			Given('a ReservationRequest document with id "reservation-1"', () => {
				mockReservationRequests = [makeMockReservationRequest()];
			});
			When('I call getById with "reservation-1"', async () => {
				const validObjectId = createValidObjectId('reservation-1');
				result = await repository.getById(validObjectId);
			});
			Then('I should receive a ReservationRequest entity', () => {
				expect(result).toBeDefined();
				expect(result).not.toBeNull();
			});
			And('the entity\'s id should be "reservation-1"', () => {
				const reservation =
					result as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference;
				expect(reservation.id).toBeDefined();
			});
		},
	);

	Scenario(
		'Getting a reservation request by nonexistent ID',
		({ When, Then }) => {
			When('I call getById with "nonexistent-id"', async () => {
				mockModel.findById = vi.fn(() =>
					createNullPopulateChain(null),
				) as unknown as typeof mockModel.findById;

				result = await repository.getById('nonexistent-id');
			});
			Then('it should return null', () => {
				expect(result).toBeNull();
			});
		},
	);

	Scenario(
		'Getting reservation requests by reserver ID',
		({ Given, When, Then, And }) => {
			Given('a ReservationRequest document with reserver "user-1"', () => {
				mockReservationRequests = [
					makeMockReservationRequest({
						reserver: makeMockUser('user-1'),
					}),
				];
			});
			When('I call getByReserverId with "user-1"', async () => {
				result = await repository.getByReserverId(
					createValidObjectId('user-1'),
				);
			});
			Then('I should receive an array of ReservationRequest entities', () => {
				expect(Array.isArray(result)).toBe(true);
			});
			And(
				'the array should contain reservation requests where reserver is "user-1"',
				() => {
					const reservations =
						result as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[];
					expect(reservations.length).toBeGreaterThan(0);
				},
			);
		},
	);

	Scenario(
		'Getting active reservation requests by reserver ID with listing and sharer',
		({ Given, When, Then, And }) => {
			Given(
				'a ReservationRequest document with reserver "user-1" and state "Accepted"',
				() => {
					mockReservationRequests = [
						makeMockReservationRequest({
							reserver: makeMockUser('user-1'),
							state: 'Accepted',
						}),
					];
				},
			);
			When(
				'I call getActiveByReserverIdWithListingWithSharer with "user-1"',
				async () => {
					result = await repository.getActiveByReserverIdWithListingWithSharer(
						createValidObjectId('user-1'),
					);
				},
			);
			Then('I should receive an array of ReservationRequest entities', () => {
				expect(Array.isArray(result)).toBe(true);
			});
			And(
				'the array should contain active reservation requests with populated listing and reserver',
				() => {
					const reservations =
						result as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[];
					expect(reservations.length).toBeGreaterThan(0);
				},
			);
		},
	);

	Scenario(
		'Getting past reservation requests by reserver ID',
		({ Given, When, Then, And }) => {
			Given(
				'a ReservationRequest document with reserver "user-1" and state "Closed"',
				() => {
					mockReservationRequests = [
						makeMockReservationRequest({
							reserver: makeMockUser('user-1'),
							state: 'Closed',
						}),
					];
				},
			);
			When(
				'I call getPastByReserverIdWithListingWithSharer with "user-1"',
				async () => {
					result = await repository.getPastByReserverIdWithListingWithSharer(
						createValidObjectId('user-1'),
					);
				},
			);
			Then('I should receive an array of ReservationRequest entities', () => {
				expect(Array.isArray(result)).toBe(true);
			});
			And('the array should contain past reservation requests', () => {
				const reservations =
					result as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[];
				expect(reservations.length).toBeGreaterThan(0);
			});
		},
	);

	Scenario(
		'Getting listing requests by sharer ID',
		({ Given, When, Then, And }) => {
			Given(
				'a ReservationRequest document with listing owned by "sharer-1"',
				() => {
					mockReservationRequests = [
						makeMockReservationRequest({
							listing: makeMockListing('listing-1', 'sharer-1'),
						}),
					];
				},
			);
			When('I call getListingRequestsBySharerId with "sharer-1"', async () => {
				result = await repository.getListingRequestsBySharerId(
					createValidObjectId('sharer-1'),
				);
			});
			Then('I should receive a paginated result with items', () => {
				expect(result).toBeDefined();
				expect(typeof result).toBe('object');
				expect(result).toHaveProperty('items');
				expect(result).toHaveProperty('total');
				expect(result).toHaveProperty('page');
				expect(result).toHaveProperty('pageSize');
			});
			And(
				'the items array should contain reservation requests for listings owned by "sharer-1"',
				() => {
					const paginatedResult = result as {
						items: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[];
						total: number;
						page: number;
						pageSize: number;
					};
					expect(paginatedResult.items).toBeDefined();
					expect(Array.isArray(paginatedResult.items)).toBe(true);
					expect(paginatedResult.items.length).toBeGreaterThan(0);
					expect(paginatedResult.items[0].listing.sharer.id).toBeDefined();
				},
			);
		},
	);

	Scenario(
		'Getting listing requests by sharer ID with pagination',
		({ Given, When, Then, And }) => {
			Given(
				'multiple ReservationRequest documents for listings owned by "sharer-1"',
				() => {
					mockReservationRequests = [
						makeMockReservationRequest({
							id: 'req-1',
							listing: makeMockListing('listing-1', 'sharer-1'),
						}),
						makeMockReservationRequest({
							id: 'req-2',
							listing: makeMockListing('listing-2', 'sharer-1'),
						}),
						makeMockReservationRequest({
							id: 'req-3',
							listing: makeMockListing('listing-3', 'sharer-1'),
						}),
						makeMockReservationRequest({
							id: 'req-4',
							listing: makeMockListing('listing-4', 'sharer-1'),
						}),
					];
					// Mock countDocuments to return 4
					mockModel.countDocuments = vi.fn(() => ({
						exec: vi.fn().mockResolvedValue(4),
					})) as any;
				},
			);
			When(
				'I call getListingRequestsBySharerId with "sharer-1", page 2, and pageSize 2',
				async () => {
					result = await repository.getListingRequestsBySharerId(
						createValidObjectId('sharer-1'),
						{ page: 2, pageSize: 2 },
					);
				},
			);
			Then(
				'I should receive a paginated result with page 2 and pageSize 2',
				() => {
					const paginatedResult = result as {
						items: unknown[];
						total: number;
						page: number;
						pageSize: number;
					};
					expect(paginatedResult.page).toBe(2);
					expect(paginatedResult.pageSize).toBe(2);
					expect(paginatedResult.total).toBe(4);
				},
			);
			And('the items array should contain 2 reservation requests', () => {
				const paginatedResult = result as {
					items: unknown[];
					total: number;
					page: number;
					pageSize: number;
				};
				expect(paginatedResult.items).toHaveLength(2);
			});
		},
	);

	Scenario(
		'Getting listing requests by sharer ID with search',
		({ Given, When, Then, And }) => {
			Given(
				'ReservationRequest documents with different listing titles',
				() => {
					mockReservationRequests = [
						makeMockReservationRequest({
							id: 'req-1',
							listing: { ...makeMockListing('listing-1', 'sharer-1'), title: 'Camera' },
						}),
						makeMockReservationRequest({
							id: 'req-2',
							listing: { ...makeMockListing('listing-2', 'sharer-1'), title: 'Drone' },
						}),
					];
					// Mock aggregate for search
					mockModel.aggregate = vi.fn(() => ({
						exec: vi.fn().mockResolvedValue([
							{
								_id: 'req-1',
								listing: { title: 'Camera' },
								state: 'Requested',
								createdAt: new Date(),
								reservationPeriodStart: new Date(),
								reservationPeriodEnd: new Date(),
								reserver: makeMockUser('user-1'),
							},
						]),
					})) as any;
				},
			);
			When(
				'I call getListingRequestsBySharerId with "sharer-1" and searchText "camera"',
				async () => {
					result = await repository.getListingRequestsBySharerId(
						createValidObjectId('sharer-1'),
						{ searchText: 'camera' },
					);
				},
			);
			Then('I should receive a paginated result with items', () => {
				expect(result).toBeDefined();
				expect(result).toHaveProperty('items');
			});
			And(
				'only items with listing titles containing "camera" should be included',
				() => {
					const paginatedResult = result as {
						items: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[];
					};
					expect(paginatedResult.items).toHaveLength(1);
					expect(paginatedResult.items[0].listing.title).toBe('Camera');
				},
			);
		},
	);

	Scenario(
		'Getting listing requests by sharer ID with status filters',
		({ Given, When, Then, And }) => {
			Given('ReservationRequest documents with different states', () => {
				mockReservationRequests = [
					makeMockReservationRequest({
						id: 'req-1',
						state: 'Approved',
						listing: makeMockListing('listing-1', 'sharer-1'),
					}),
					makeMockReservationRequest({
						id: 'req-2',
						state: 'Requested',
						listing: makeMockListing('listing-2', 'sharer-1'),
					}),
				];
			});
			When(
				'I call getListingRequestsBySharerId with "sharer-1" and statusFilters ["Approved"]',
				async () => {
					result = await repository.getListingRequestsBySharerId(
						createValidObjectId('sharer-1'),
						{ statusFilters: ['Approved'] },
					);
				},
			);
			Then('I should receive a paginated result with items', () => {
				expect(result).toBeDefined();
				expect(result).toHaveProperty('items');
			});
			And('only items with state "Approved" should be included', () => {
				const paginatedResult = result as {
					items: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[];
				};
				expect(paginatedResult.items).toHaveLength(1);
				expect(paginatedResult.items[0].state).toBe('Approved');
			});
		},
	);

	Scenario(
		'Getting listing requests by sharer ID with sorting',
		({ Given, When, Then, And }) => {
			Given(
				'ReservationRequest documents with different createdAt dates',
				() => {
					mockReservationRequests = [
						makeMockReservationRequest({
							id: 'req-1',
							createdAt: new Date('2024-01-01'),
							listing: makeMockListing('listing-1', 'sharer-1'),
						}),
						makeMockReservationRequest({
							id: 'req-2',
							createdAt: new Date('2024-01-02'),
							listing: makeMockListing('listing-2', 'sharer-1'),
						}),
					];
				},
			);
			When(
				'I call getListingRequestsBySharerId with "sharer-1" and sorter field "createdAt" order "descend"',
				async () => {
					result = await repository.getListingRequestsBySharerId(
						createValidObjectId('sharer-1'),
						{ sorter: { field: 'createdAt', order: 'descend' } },
					);
				},
			);
			Then('I should receive a paginated result with items', () => {
				expect(result).toBeDefined();
				expect(result).toHaveProperty('items');
			});
			And(
				'the items should be sorted by createdAt in descending order',
				() => {
					const paginatedResult = result as {
						items: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[];
					};
					expect(paginatedResult.items).toHaveLength(2);
					expect(paginatedResult.items[0].createdAt.getTime()).toBeGreaterThan(
						paginatedResult.items[1].createdAt.getTime(),
					);
				},
			);
		},
	);

	Scenario(
		'Getting active reservation by reserver ID and listing ID',
		({ Given, When, Then, And }) => {
			Given(
				'a ReservationRequest document with reserver "user-1", listing "listing-1", and state "Accepted"',
				() => {
					mockReservationRequests = [
						makeMockReservationRequest({
							reserver: makeMockUser('user-1'),
							listing: makeMockListing('listing-1'),
							state: 'Accepted',
						}),
					];
				},
			);
			When(
				'I call getActiveByReserverIdAndListingId with "user-1" and "listing-1"',
				async () => {
					result = await repository.getActiveByReserverIdAndListingId(
						createValidObjectId('user-1'),
						createValidObjectId('listing-1'),
					);
				},
			);
			Then('I should receive a ReservationRequest entity', () => {
				expect(result).toBeDefined();
				expect(result).not.toBeNull();
			});
			And('the entity\'s reserver id should be "user-1"', () => {
				const reservation =
					result as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference;
				expect(reservation.reserver.id).toBeDefined();
			});
			And('the entity\'s listing id should be "listing-1"', () => {
				const reservation =
					result as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference;
				expect(reservation.listing.id).toBeDefined();
			});
		},
	);

	Scenario(
		'Getting overlapping active reservation requests for a listing',
		({ Given, When, Then, And }) => {
			Given(
				'a ReservationRequest document for listing "listing-1" from "2025-10-20" to "2025-10-25" with state "Accepted"',
				() => {
					mockReservationRequests = [
						makeMockReservationRequest({
							listing: makeMockListing('listing-1'),
							reservationPeriodStart: new Date('2025-10-20'),
							reservationPeriodEnd: new Date('2025-10-25'),
							state: 'Accepted',
						}),
					];
				},
			);
			When(
				'I call getOverlapActiveReservationRequestsForListing with "listing-1", start "2025-10-22", end "2025-10-27"',
				async () => {
					result =
						await repository.getOverlapActiveReservationRequestsForListing(
							createValidObjectId('listing-1'),
							new Date('2025-10-22'),
							new Date('2025-10-27'),
						);
				},
			);
			Then('I should receive an array of ReservationRequest entities', () => {
				expect(Array.isArray(result)).toBe(true);
			});
			And(
				'the array should contain overlapping active reservation requests',
				() => {
					const reservations =
						result as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[];
					expect(reservations.length).toBeGreaterThan(0);
				},
			);
		},
	);

	Scenario(
		'Getting active reservations by listing ID',
		({ Given, When, Then, And }) => {
			Given(
				'a ReservationRequest document with listing "listing-1" and state "Requested"',
				() => {
					mockReservationRequests = [
						makeMockReservationRequest({
							listing: makeMockListing('listing-1'),
							state: 'Requested',
						}),
					];
				},
			);
			When('I call getActiveByListingId with "listing-1"', async () => {
				result = await repository.getActiveByListingId(
					createValidObjectId('listing-1'),
				);
			});
			Then('I should receive an array of ReservationRequest entities', () => {
				expect(Array.isArray(result)).toBe(true);
			});
			And(
				'the array should contain active reservation requests for the listing',
				() => {
					const reservations =
						result as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[];
					expect(reservations.length).toBeGreaterThan(0);
				},
			);
		},
	);
});
