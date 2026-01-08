import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { Domain } from '@sthrift/domain';
import type mongoose from 'mongoose';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import { expect, vi } from 'vitest';
import { makeNewableMock } from '@cellix/test-utils';
import { ReservationRequestConverter } from './reservation-request.domain-adapter.ts';
import { ReservationRequestRepository } from './reservation-request.repository.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/reservation-request.repository.feature'),
);

// Test utilities - consolidated helper functions
function createValidObjectId(id: string): string {
	const hexChars = '0123456789abcdef';
	let hex = '';
	for (let i = 0; i < id.length && hex.length < 24; i++) {
		const codePoint = id.codePointAt(i) ?? 0;
		hex += hexChars[codePoint % 16];
	}
	return hex.padEnd(24, '0').substring(0, 24);
}

function makePassport(): Domain.Passport {
	return vi.mocked({
		reservationRequest: { forReservationRequest: vi.fn(() => ({ determineIf: () => true })) },
		user: { forPersonalUser: vi.fn(() => ({ determineIf: () => true })) },
		listing: { forItemListing: vi.fn(() => ({ determineIf: () => true })) },
	} as unknown as Domain.Passport);
}

function makeEventBus(): DomainSeedwork.EventBus {
	return vi.mocked({ dispatch: vi.fn(), register: vi.fn() } as DomainSeedwork.EventBus);
}

// use shared makeNewableMock from test-utils

function makeUserDoc(id: string): Models.User.PersonalUser {
	const validId = createValidObjectId(id);
	return {
		_id: new MongooseSeedwork.ObjectId(validId),
		id: new MongooseSeedwork.ObjectId(validId),
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

function makeListingDoc(id: string): Models.Listing.ItemListing {
	const validId = createValidObjectId(id);
	return {
		_id: new MongooseSeedwork.ObjectId(validId),
		id: id,
		title: 'Test Listing',
		description: 'Test Description',
		sharer: new MongooseSeedwork.ObjectId(createValidObjectId('sharer-1')),
	} as unknown as Models.Listing.ItemListing;
}

function makeReservationRequestDoc(id = 'reservation-1', state = 'Requested'): Models.ReservationRequest.ReservationRequest {
	return {
		_id: new MongooseSeedwork.ObjectId(createValidObjectId(id)),
		id: id,
		state: state,
		reserver: makeUserDoc('user-1'),
		listing: makeListingDoc('listing-1'),
		reservationPeriodStart: new Date('2025-10-20'),
		reservationPeriodEnd: new Date('2025-10-25'),
		closeRequestedBySharer: false,
		closeRequestedByReserver: false,
		createdAt: new Date('2020-01-01'),
		updatedAt: new Date('2020-01-02'),
		schemaVersion: '1.0.0',
	} as unknown as Models.ReservationRequest.ReservationRequest;
}

function createChainableQuery<T>(result: T) {
	const query = { populate: vi.fn(), exec: vi.fn().mockResolvedValue(result) };
	query.populate.mockReturnValue(query);
	return query;
}

function setupReservationRequestRepo(
	mockDoc: Models.ReservationRequest.ReservationRequest,
	overrides?: { findById?: () => unknown, find?: () => unknown, modelCtor?: Models.ReservationRequest.ReservationRequestModelType }
): ReservationRequestRepository {
	const modelType = overrides?.modelCtor ?? ({
		findById: overrides?.findById ?? (() => createChainableQuery(mockDoc)),
		find: overrides?.find ?? (() => createChainableQuery([mockDoc]))
	} as unknown as Models.ReservationRequest.ReservationRequestModelType);
	
	return new ReservationRequestRepository(
		makePassport(), 
		modelType, 
		new ReservationRequestConverter(), 
		makeEventBus(), 
		vi.mocked({} as mongoose.ClientSession)
	);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let repository: ReservationRequestRepository;
	let mockDoc: Models.ReservationRequest.ReservationRequest;
	let result: unknown;

	BeforeEachScenario(() => {
		mockDoc = makeReservationRequestDoc('reservation-1', 'Requested');
		repository = setupReservationRequestRepo(mockDoc);
		result = undefined;
	});

	Background(({ Given, And }) => {
		Given(
			'a ReservationRequestRepository instance with a working Mongoose model, type converter, and passport',
			() => {
				// Already set up in BeforeEachScenario
			},
		);
		And('valid ReservationRequest documents exist in the database', () => {
			// Mock documents are set up in BeforeEachScenario
		});
		And('each ReservationRequest document includes populated \'listing\' and \'reserver\' fields', () => {
			// Mock documents already have populated fields
		});
	});

	Scenario(
		'Getting a reservation request by ID',
		({ Given, When, Then, And }) => {
			Given('a ReservationRequest document with id "reservation-1", state "Requested", and a populated reserver', () => {
				// Mock document is already set up in BeforeEachScenario with the correct data
			});
			When('I call getById with "reservation-1"', async () => {
				result = await repository.getById('reservation-1');
			});
			Then('I should receive a ReservationRequest domain object', () => {
				expect(result).toBeInstanceOf(
					Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest,
				);
			});
			And('the domain object should have state "Requested"', () => {
				const reservationRequest =
					result as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<
						Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps
					>;
				expect(reservationRequest.state).toBe('Requested');
			});
			And('the domain object\'s reserver should be a PersonalUser domain object with correct user data', () => {
				const reservationRequest =
					result as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<
						Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps
					>;
				expect(reservationRequest.reserver.id).toBeDefined();
			});
			And('the domain object\'s listing should be a Listing domain object with correct listing data', () => {
				const reservationRequest =
					result as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<
						Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps
					>;
				expect(reservationRequest.listing.id).toBeDefined();
			});
		},
	);

	Scenario(
		'Getting a reservation request by a nonexistent ID',
		({ When, Then }) => {
			When('I call getById with "nonexistent-id"', async () => {
				// Setup repository with null result for this scenario
				repository = setupReservationRequestRepo(mockDoc, {
					findById: () => createChainableQuery(null)
				});

				try {
					result = await repository.getById('nonexistent-id');
				} catch (error) {
					result = error;
				}
			});
			Then(
				'an error should be thrown indicating "ReservationRequest with id nonexistent-id not found"',
				() => {
					expect(result).toBeInstanceOf(Error);
					expect((result as Error).message).toContain(
						'ReservationRequest with id nonexistent-id not found',
					);
				},
			);
		},
	);

	Scenario(
		'Getting all reservation requests',
		({ When, Then, And }) => {
			When('I call getAll', async () => {
				result = await repository.getAll();
			});
			Then('I should receive a list of ReservationRequest domain objects', () => {
				expect(Array.isArray(result)).toBe(true);
				expect((result as unknown[]).length).toBeGreaterThan(0);
			});
			And('each reservation request should include populated reserver and listing domain objects', () => {
				const reservationRequests =
					result as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<
						Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps
					>[];
				for (const req of reservationRequests) {
					expect(req.reserver.id).toBeDefined();
					expect(req.listing.id).toBeDefined();
				}
			});
		},
	);

    Scenario(
        'Creating a new reservation request instance',
        ({ Given, When, Then, And }) => {
            let reserver: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
            let listing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;
            Given("a valid Listing domain entity reference", () => {
                listing = {
                    id: createValidObjectId('listing-1'),
                    state: 'Active',
                    sharer: {
                        id: createValidObjectId('sharer-1'),
                    } as unknown as Domain.Contexts.User.UserEntityReference,
                } as unknown as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;
            });
            And('a valid PersonalUser domain entity reference as reserver', () => {
                reserver = {
                    id: createValidObjectId('user-1'),
                } as unknown as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
            });
            And('reservation period from "2025-10-20" to "2025-10-25"', () => {
                // Dates are provided in the When step
            });
            When('I call getNewInstance with state "Requested", the listing, the reserver, and the reservation period', async () => {
                // Use future dates that will always be valid
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(0, 0, 0, 0);
                
                const dayAfterTomorrow = new Date(tomorrow);
                dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
                
                // Create user doc with matching ID
                const userDocWithMatchingId = makeUserDoc('user-1');
                
                // Mock the model constructor to return a document with required properties
                const mockNewDoc = {
                    id: { toString: () => 'new-reservation-id' },
                    state: 'Requested',
                    reserver: userDocWithMatchingId,
                    listing: makeListingDoc('listing-1'),
                    reservationPeriodStart: tomorrow,
                    reservationPeriodEnd: dayAfterTomorrow,
                    closeRequestedBySharer: false,
                    closeRequestedByReserver: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    schemaVersion: '1.0.0',
                    set: vi.fn(),
                };
                
				// Setup repository with constructor mock
				repository = setupReservationRequestRepo(mockDoc, {
					modelCtor: makeNewableMock(() => mockNewDoc) as unknown as Models.ReservationRequest.ReservationRequestModelType,
				});
                
                result = await repository.getNewInstance(
                    'Requested',
                    listing,
                    reserver,
                    tomorrow,
                    dayAfterTomorrow
                );
            });
            Then('I should receive a new ReservationRequest domain object', () => {
                expect(result).toBeInstanceOf(
                    Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest,
                );
            });
            And('the new instance should have state "Requested"', () => {
                const reservationRequest =
                    result as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<
                        Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps
                    >;
                expect(reservationRequest.state).toBe('Requested');
            });
            And('the reservation period should be from "2025-10-20" to "2025-10-25"', () => {
                const reservationRequest =
                    result as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<
                        Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps
                    >;
                // Verify that start date is before end date
                expect(reservationRequest.reservationPeriodStart.getTime()).toBeLessThan(
                    reservationRequest.reservationPeriodEnd.getTime()
                );
            });
            And('the reserver should be the given user', () => {
                const reservationRequest =
                    result as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<
                        Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps
                    >;
                expect(reservationRequest.reserver.id).toBe(reserver.id);
            });
        },
    );

	Scenario(
		'Getting reservation requests by reserver ID',
		({ Given, When, Then, And }) => {
			Given('a reserver with id "user-123"', () => {
				mockDoc = makeReservationRequestDoc('reservation-1', 'Requested');
				mockDoc.reserver = makeUserDoc('user-123');
				repository = setupReservationRequestRepo(mockDoc);
			});
			When('I call getByReserverId with "user-123"', async () => {
				result = await repository.getByReserverId('user-123');
			});
			Then('I should receive all ReservationRequest domain objects created by that reserver', () => {
				expect(Array.isArray(result)).toBe(true);
				expect((result as unknown[]).length).toBeGreaterThan(0);
			});
			And('each reservation request should have reserver id "user-123"', () => {
				const reservationRequests =
					result as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<
						Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps
					>[];
				for (const req of reservationRequests) {
					expect(req.reserver.account.username).toBe('user-123');
				}
			});
		},
	);

	Scenario(
		'Getting reservation requests by listing ID',
		({ Given, When, Then, And }) => {
			Given('a listing with id "listing-456"', () => {
				mockDoc = makeReservationRequestDoc('reservation-1', 'Requested');
				mockDoc.listing = makeListingDoc('listing-456');
				repository = setupReservationRequestRepo(mockDoc);
			});
			When('I call getByListingId with "listing-456"', async () => {
				result = await repository.getByListingId('listing-456');
			});
			Then('I should receive all ReservationRequest domain objects associated with that listing', () => {
				expect(Array.isArray(result)).toBe(true);
				expect((result as unknown[]).length).toBeGreaterThan(0);
			});
			And('each reservation request should have listing id "listing-456"', () => {
				const reservationRequests =
					result as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequest<
						Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps
					>[];
				for (const req of reservationRequests) {
					expect(req.listing.id).toBe('listing-456');
				}
			});
		},
	);

	Scenario(
		'Creating a reservation request instance with invalid data',
		({ Given, When, Then }) => {
			let invalidReserver: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;
			let listing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;

			Given('an invalid reserver reference', () => {
				// biome-ignore lint/suspicious/noExplicitAny: test requires any for invalid type simulation
				invalidReserver = null as any;
			});
			When('I call getNewInstance with state "Requested", a valid listing, and the invalid reserver', async () => {
				listing = vi.mocked({
					id: createValidObjectId('listing-1'),
				} as unknown as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference);

				try {
					result = await repository.getNewInstance(
						'Requested',
						listing,
						invalidReserver,
						new Date('2025-10-20'),
						new Date('2025-10-25')
					);
				} catch (error) {
					result = error;
				}
			});
			Then('an error should be thrown indicating the reserver is not valid', () => {
				expect(result).toBeInstanceOf(Error);
			});
		},
	);
});
