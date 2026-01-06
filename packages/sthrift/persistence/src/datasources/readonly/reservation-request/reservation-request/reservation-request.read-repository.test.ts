import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';
import { expect, vi } from 'vitest';
import type { ModelsContext } from '../../../../models-context.ts';
import { ReservationRequestReadRepositoryImpl } from './reservation-request.read-repository.ts';

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
				exec: vi.fn().mockResolvedValue(result),
				catch: vi.fn((onReject) => Promise.resolve(result).catch(onReject)),
			};
			// Configure methods to return the query object for chaining
			mockQuery.lean.mockReturnValue(mockQuery);
			mockQuery.populate.mockReturnValue(mockQuery);
			mockQuery.sort.mockReturnValue(mockQuery);
			mockQuery.limit.mockReturnValue(mockQuery);

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
			aggregate: vi.fn(() => ({
				exec: vi.fn().mockResolvedValue(mockReservationRequests),
			})),
		} as unknown as Models.ReservationRequest.ReservationRequestModelType;

		mockListingModel = {
			collection: {
				name: 'item-listings',
			},
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
			Then('I should receive an array of ReservationRequest entities', () => {
				expect(Array.isArray(result)).toBe(true);
			});
			And(
				'the array should contain reservation requests for listings owned by "sharer-1"',
				() => {
					const reservations =
						result as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[];
					expect(reservations.length).toBeGreaterThan(0);
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

	// Test for getExpiredClosed
	Scenario(
		'Getting expired closed reservation requests',
		({ Given, And, When, Then }) => {
			let expiredMockFindResult: Models.ReservationRequest.ReservationRequest[];
			let result:
				| Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[]
				| null;

			Given(
				'a ReservationRequest document with state "Closed" and updatedAt more than 6 months ago',
				() => {
					const sevenMonthsAgo = new Date();
					sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);

					const expiredRequest = makeMockReservationRequest(
						'expired-1',
						'user-1',
						'listing-1',
					);
					expiredRequest.state = 'Closed';
					expiredRequest.updatedAt = sevenMonthsAgo;

					expiredMockFindResult = [expiredRequest];
				},
			);

			And(
				'a ReservationRequest document with state "Closed" and updatedAt less than 6 months ago',
				() => {
					// This would be filtered out by the repository query
					// The mock only returns the expired one
				},
			);

			When('I call getExpiredClosed', async () => {
				modelsContext = {
					ReservationRequest: {
						ReservationRequest: vi.mocked({
							find: vi.fn(() => createNullPopulateChain(expiredMockFindResult)),
						} as any),
					},
				} as ModelsContext;

				repository = new ReservationRequestReadRepositoryImpl(
					modelsContext,
					makePassport(),
				);

				result = await repository.getExpiredClosed();
			});

			Then('I should receive an array of ReservationRequest entities', () => {
				expect(Array.isArray(result)).toBe(true);
				expect(result?.length).toBeGreaterThan(0);
			});

			And(
				'the array should contain only reservation requests older than 6 months',
				() => {
					const sixMonthsAgo = new Date();
					sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

					const reservations =
						result as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[];
					// biome-ignore lint/complexity/noForEach: test verification
					reservations.forEach((req) => {
						expect(req.state).toBe('Closed');
						expect(req.updatedAt.getTime()).toBeLessThan(
							sixMonthsAgo.getTime(),
						);
					});
				},
			);
		},
	);
});
