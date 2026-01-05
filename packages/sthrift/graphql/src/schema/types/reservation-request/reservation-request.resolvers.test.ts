import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import { expect, vi } from 'vitest';
import type { GraphContext } from '../../../init/context.ts';
import reservationRequestResolvers from './reservation-request.resolvers.ts';

// Generic GraphQL resolver type for tests
type TestResolver<
	Args extends object = Record<string, unknown>,
	Return = unknown,
> = (
	parent: unknown,
	args: Args,
	context: GraphContext,
	info: unknown,
) => Promise<Return>;

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/reservation-request.resolvers.feature'),
);

// Types for test entities
type ReservationRequestEntity =
	Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference;
type ItemListingEntity =
	Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;
type PersonalUserEntity =
	Domain.Contexts.User.PersonalUser.PersonalUserEntityReference;

// Helper function to create mock reservation request
function createMockReservationRequest(
	overrides: Partial<ReservationRequestEntity> = {},
): ReservationRequestEntity {
	const baseRequest: ReservationRequestEntity = {
		id: 'request-1',
		state: 'Pending',
		reservationPeriodStart: new Date('2025-10-15'),
		reservationPeriodEnd: new Date('2025-10-20'),
		createdAt: new Date('2025-10-01T00:00:00Z'),
		updatedAt: new Date('2025-10-01T00:00:00Z'),
		schemaVersion: '1.0.0',
		listing: {
			id: 'listing-1',
			title: 'Test Listing',
		} as ItemListingEntity,
		reserver: {
			id: 'user-1',
			account: {
				username: 'testuser',
			},
		} as PersonalUserEntity,
		loadListing: vi.fn(),
		loadReserver: vi.fn(),
		closeRequestedBySharer: false,
		closeRequestedByReserver: false,
		...overrides,
	};
	return baseRequest;
}

function makeMockGraphContext(
	overrides: Partial<GraphContext> = {},
): GraphContext {
	return {
		applicationServices: {
			ReservationRequest: {
				ReservationRequest: {
					queryActiveByReserverId: vi.fn(),
					queryPastByReserverId: vi.fn(),
					queryListingRequestsBySharerId: vi.fn(),
					queryActiveByReserverIdAndListingId: vi.fn(),
					queryActiveByListingId: vi.fn(),
					create: vi.fn(),
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
		'Querying active reservations for a user',
		({ Given, When, Then, And }) => {
			const userId = 'user-123';
			Given('a valid userId', () => {
				context = makeMockGraphContext();
				const mockReservations = [
					createMockReservationRequest({ id: '1', state: 'Accepted' }),
				];
				vi.mocked(
					context.applicationServices.ReservationRequest.ReservationRequest
						.queryActiveByReserverId,
				).mockResolvedValue(mockReservations);
			});
			When('the myActiveReservations query is executed', async () => {
				const resolver = reservationRequestResolvers.Query
					?.myActiveReservations as TestResolver<{ userId: string }>;
				result = await resolver({}, { userId }, context, {} as never);
			});
			Then(
				'it should call ReservationRequest.queryActiveByReserverId with the provided userId',
				() => {
					expect(
						context.applicationServices.ReservationRequest.ReservationRequest
							.queryActiveByReserverId,
					).toHaveBeenCalledWith({ reserverId: userId });
				},
			);
			And('it should return a list of active reservations', () => {
				expect(result).toBeDefined();
				expect(Array.isArray(result)).toBe(true);
			});
		},
	);

	Scenario(
		'No active reservations for a user',
		({ Given, And, When, Then }) => {
			const userId = 'user-123';
			Given('a valid userId', () => {
				context = makeMockGraphContext();
			});
			And(
				'ReservationRequest.queryActiveByReserverId returns an empty list',
				() => {
					vi.mocked(
						context.applicationServices.ReservationRequest.ReservationRequest
							.queryActiveByReserverId,
					).mockResolvedValue([]);
				},
			);
			When('the myActiveReservations query is executed', async () => {
				const resolver = reservationRequestResolvers.Query
					?.myActiveReservations as TestResolver<{ userId: string }>;
				result = await resolver({}, { userId }, context, {} as never);
			});
			Then('it should return an empty array', () => {
				expect(Array.isArray(result)).toBe(true);
				expect((result as unknown[]).length).toBe(0);
			});
		},
	);

	Scenario(
		'Error while querying active reservations',
		({ Given, When, Then }) => {
			const userId = 'user-123';
			Given(
				'ReservationRequest.queryActiveByReserverId throws an error',
				() => {
					context = makeMockGraphContext();
					vi.mocked(
						context.applicationServices.ReservationRequest.ReservationRequest
							.queryActiveByReserverId,
					).mockRejectedValue(new Error('Database error'));
				},
			);
			When('the myActiveReservations query is executed', async () => {
				try {
					const resolver = reservationRequestResolvers.Query
						?.myActiveReservations as TestResolver<{ userId: string }>;
					await resolver({}, { userId }, context, {} as never);
				} catch (e) {
					error = e as Error;
				}
			});
			Then('it should propagate the error message', () => {
				expect(error).toBeDefined();
				expect(error?.message).toContain('Database error');
			});
		},
	);

	Scenario(
		'Querying past reservations for a user',
		({ Given, When, Then, And }) => {
			const userId = 'user-123';
			Given('a valid userId', () => {
				context = makeMockGraphContext();
				const mockReservations = [
					createMockReservationRequest({ id: '1', state: 'Closed' }),
				];
				vi.mocked(
					context.applicationServices.ReservationRequest.ReservationRequest
						.queryPastByReserverId,
				).mockResolvedValue(mockReservations);
			});
			When('the myPastReservations query is executed', async () => {
				const resolver = reservationRequestResolvers.Query
					?.myPastReservations as TestResolver<{ userId: string }>;
				result = await resolver({}, { userId }, context, {} as never);
			});
			Then(
				'it should call ReservationRequest.queryPastByReserverId with the provided userId',
				() => {
					expect(
						context.applicationServices.ReservationRequest.ReservationRequest
							.queryPastByReserverId,
					).toHaveBeenCalledWith({ reserverId: userId });
				},
			);
			And('it should return a list of past reservations', () => {
				expect(result).toBeDefined();
				expect(Array.isArray(result)).toBe(true);
			});
		},
	);

	Scenario('No past reservations for a user', ({ Given, And, When, Then }) => {
		const userId = 'user-123';
		Given('a valid userId', () => {
			context = makeMockGraphContext();
		});
		And(
			'ReservationRequest.queryPastByReserverId returns an empty list',
			() => {
				vi.mocked(
					context.applicationServices.ReservationRequest.ReservationRequest
						.queryPastByReserverId,
				).mockResolvedValue([]);
			},
		);
		When('the myPastReservations query is executed', async () => {
			const resolver = reservationRequestResolvers.Query
				?.myPastReservations as TestResolver<{ userId: string }>;
			result = await resolver({}, { userId }, context, {} as never);
		});
		Then('it should return an empty array', () => {
			expect(Array.isArray(result)).toBe(true);
			expect((result as unknown[]).length).toBe(0);
		});
	});

	Scenario(
		'Error while querying past reservations',
		({ Given, When, Then }) => {
			const userId = 'user-123';
			Given('ReservationRequest.queryPastByReserverId throws an error', () => {
				context = makeMockGraphContext();
				vi.mocked(
					context.applicationServices.ReservationRequest.ReservationRequest
						.queryPastByReserverId,
				).mockRejectedValue(new Error('Database error'));
			});
			When('the myPastReservations query is executed', async () => {
				try {
					const resolver = reservationRequestResolvers.Query
						?.myPastReservations as TestResolver<{ userId: string }>;
					await resolver({}, { userId }, context, {} as never);
				} catch (e) {
					error = e as Error;
				}
			});
			Then('it should propagate the error message', () => {
				expect(error).toBeDefined();
				expect(error?.message).toContain('Database error');
			});
		},
	);

	Scenario(
		'Querying reservation requests for listings owned by sharer',
		({ Given, And, When, Then }) => {
			const sharerId = 'sharer-123';
			Given('a valid sharerId', () => {
				context = makeMockGraphContext();
			});
			And('valid pagination arguments (page, pageSize)', () => {
				const mockRequests = {
					items: [
						{
							id: '1',
							title: 'Test Item',
							image: '/assets/item-images/placeholder.png',
							requestedBy: '@testuser',
							requestedOn: new Date('2024-01-01').toISOString(),
							reservationPeriod: '2024-02-01 - 2024-02-10',
							status: 'Requested',
						},
					],
					total: 1,
					page: 1,
					pageSize: 10,
				};
				vi.mocked(
					context.applicationServices.ReservationRequest.ReservationRequest
						.queryListingRequestsBySharerId,
				).mockResolvedValue(mockRequests);
			});
			When('the myListingsRequests query is executed', async () => {
				const resolver = reservationRequestResolvers.Query
					?.myListingsRequests as TestResolver<{
					sharerId: string;
					page: number;
					pageSize: number;
					searchText: string;
					statusFilters: string[];
					sorter: { field: string; order: string };
				}>;
				result = await resolver(
					{},
					{
						sharerId,
						page: 1,
						pageSize: 10,
						searchText: '',
						statusFilters: [],
						sorter: { field: 'requestedOn', order: 'descend' },
					},
					context,
					{} as never,
				);
			});
			Then(
				'it should call ReservationRequest.queryListingRequestsBySharerId with the provided arguments',
				() => {
					expect(
						context.applicationServices.ReservationRequest.ReservationRequest
							.queryListingRequestsBySharerId,
					).toHaveBeenCalledWith({
						sharerId,
						page: 1,
						pageSize: 10,
						searchText: '',
						statusFilters: [],
						sorter: { field: 'requestedOn', order: 'descend' },
					});
				},
			);
			And('it should return items, total, page, and pageSize', () => {
				expect(result).toHaveProperty('items');
				expect(result).toHaveProperty('total');
				expect(result).toHaveProperty('page');
				expect(result).toHaveProperty('pageSize');
			});
		},
	);

	Scenario(
		'Querying active reservation for a specific listing',
		({ Given, When, Then, And }) => {
			const listingId = 'listing-123';
			const userId = 'user-456';
			Given('a valid listingId and userId', () => {
				context = makeMockGraphContext();
				const mockReservation = createMockReservationRequest({
					id: '1',
					state: 'Accepted',
				});
				vi.mocked(
					context.applicationServices.ReservationRequest.ReservationRequest
						.queryActiveByReserverIdAndListingId,
				).mockResolvedValue(mockReservation);
			});
			When('the myActiveReservationForListing query is executed', async () => {
				const resolver = reservationRequestResolvers.Query
					?.myActiveReservationForListing as TestResolver<{
					listingId: string;
					userId: string;
				}>;
				result = await resolver(
					{},
					{ listingId, userId },
					context,
					{} as never,
				);
			});
			Then(
				'it should call ReservationRequest.queryActiveByReserverIdAndListingId with those IDs',
				() => {
					expect(
						context.applicationServices.ReservationRequest.ReservationRequest
							.queryActiveByReserverIdAndListingId,
					).toHaveBeenCalledWith({ listingId, reserverId: userId });
				},
			);
			And('it should return the corresponding reservation if found', () => {
				expect(result).toBeDefined();
			});
		},
	);

	Scenario(
		'No active reservation found for listing',
		({ Given, And, When, Then }) => {
			const listingId = 'listing-123';
			const userId = 'user-456';
			Given('a valid listingId and userId', () => {
				context = makeMockGraphContext();
			});
			And(
				'ReservationRequest.queryActiveByReserverIdAndListingId returns null',
				() => {
					vi.mocked(
						context.applicationServices.ReservationRequest.ReservationRequest
							.queryActiveByReserverIdAndListingId,
					).mockResolvedValue(null);
				},
			);
			When('the myActiveReservationForListing query is executed', async () => {
				const resolver = reservationRequestResolvers.Query
					?.myActiveReservationForListing as TestResolver<{
					listingId: string;
					userId: string;
				}>;
				result = await resolver(
					{},
					{ listingId, userId },
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
		'Error while querying active reservation for listing',
		({ Given, When, Then }) => {
			const listingId = 'listing-123';
			const userId = 'user-456';
			Given(
				'ReservationRequest.queryActiveByReserverIdAndListingId throws an error',
				() => {
					context = makeMockGraphContext();
					vi.mocked(
						context.applicationServices.ReservationRequest.ReservationRequest
							.queryActiveByReserverIdAndListingId,
					).mockRejectedValue(new Error('Database error'));
				},
			);
			When('the myActiveReservationForListing query is executed', async () => {
				try {
					const resolver = reservationRequestResolvers.Query
						?.myActiveReservationForListing as TestResolver<{
						listingId: string;
						userId: string;
					}>;
					await resolver({}, { listingId, userId }, context, {} as never);
				} catch (e) {
					error = e as Error;
				}
			});
			Then('it should propagate the error message', () => {
				expect(error).toBeDefined();
				expect(error?.message).toContain('Database error');
			});
		},
	);

	Scenario(
		'Querying active reservations by listing ID',
		({ Given, When, Then, And }) => {
			const listingId = 'listing-789';
			Given('a valid listingId', () => {
				context = makeMockGraphContext();
				const mockReservations = [
					createMockReservationRequest({ id: '1', state: 'Accepted' }),
					createMockReservationRequest({ id: '2', state: 'Requested' }),
				];
				vi.mocked(
					context.applicationServices.ReservationRequest.ReservationRequest
						.queryActiveByListingId,
				).mockResolvedValue(mockReservations);
			});
			When('the queryActiveByListingId query is executed', async () => {
				const resolver = reservationRequestResolvers.Query
					?.queryActiveByListingId as TestResolver<{
					listingId: string;
				}>;
				result = await resolver({}, { listingId }, context, {} as never);
			});
			Then(
				'it should call ReservationRequest.queryActiveByListingId with that listingId',
				() => {
					expect(
						context.applicationServices.ReservationRequest.ReservationRequest
							.queryActiveByListingId,
					).toHaveBeenCalledWith({ listingId });
				},
			);
			And('it should return all active reservations for that listing', () => {
				expect(result).toBeDefined();
				expect(Array.isArray(result)).toBe(true);
			});
		},
	);

	Scenario(
		'No active reservations found for listing',
		({ Given, And, When, Then }) => {
			const listingId = 'listing-789';
			Given('a valid listingId', () => {
				context = makeMockGraphContext();
			});
			And(
				'ReservationRequest.queryActiveByListingId returns an empty list',
				() => {
					vi.mocked(
						context.applicationServices.ReservationRequest.ReservationRequest
							.queryActiveByListingId,
					).mockResolvedValue([]);
				},
			);
			When('the queryActiveByListingId query is executed', async () => {
				const resolver = reservationRequestResolvers.Query
					?.queryActiveByListingId as TestResolver<{
					listingId: string;
				}>;
				result = await resolver({}, { listingId }, context, {} as never);
			});
			Then('it should return an empty array', () => {
				expect(Array.isArray(result)).toBe(true);
				expect((result as unknown[]).length).toBe(0);
			});
		},
	);

	Scenario(
		'Error while querying active reservations by listing ID',
		({ Given, When, Then }) => {
			const listingId = 'listing-789';
			Given('ReservationRequest.queryActiveByListingId throws an error', () => {
				context = makeMockGraphContext();
				vi.mocked(
					context.applicationServices.ReservationRequest.ReservationRequest
						.queryActiveByListingId,
				).mockRejectedValue(new Error('Database error'));
			});
			When('the queryActiveByListingId query is executed', async () => {
				try {
					const resolver = reservationRequestResolvers.Query
						?.queryActiveByListingId as TestResolver<{
						listingId: string;
					}>;
					await resolver({}, { listingId }, context, {} as never);
				} catch (e) {
					error = e as Error;
				}
			});
			Then('it should propagate the error message', () => {
				expect(error).toBeDefined();
				expect(error?.message).toContain('Database error');
			});
		},
	);

	Scenario(
		'Creating a reservation request successfully',
		({ Given, And, When, Then }) => {
			const input = {
				listingId: 'listing-123',
				reservationPeriodStart: '2024-02-01T00:00:00Z',
				reservationPeriodEnd: '2024-02-10T00:00:00Z',
			};
			Given('a verified user with a valid verifiedJwt containing email', () => {
				context = makeMockGraphContext();
			});
			And('a valid input with listingId and reservationPeriod dates', () => {
				const mockCreatedReservation = createMockReservationRequest({
					id: 'new-reservation',
					state: 'Requested',
				});
				vi.mocked(
					context.applicationServices.ReservationRequest.ReservationRequest
						.create,
				).mockResolvedValue(mockCreatedReservation);
			});
			When('the createReservationRequest mutation is executed', async () => {
				const resolver = reservationRequestResolvers.Mutation
					?.createReservationRequest as TestResolver<{
					input: {
						listingId: string;
						reservationPeriodStart: string;
						reservationPeriodEnd: string;
					};
				}>;
				result = await resolver({}, { input }, context, {} as never);
			});
			Then(
				'it should call ReservationRequest.create with listingId, reservationPeriodStart, reservationPeriodEnd, and reserverEmail',
				() => {
					expect(
						context.applicationServices.ReservationRequest.ReservationRequest
							.create,
					).toHaveBeenCalledWith({
						listingId: input.listingId,
						reservationPeriodStart: new Date(input.reservationPeriodStart),
						reservationPeriodEnd: new Date(input.reservationPeriodEnd),
						reserverEmail: 'test@example.com',
					});
				},
			);
			And('it should return the created reservation request', () => {
				expect(result).toBeDefined();
			});
		},
	);

	Scenario(
		'Creating a reservation request without authentication',
		({ Given, When, Then }) => {
			const input = {
				listingId: 'listing-123',
				reservationPeriodStart: '2024-02-01T00:00:00Z',
				reservationPeriodEnd: '2024-02-10T00:00:00Z',
			};
			Given('a user without a verifiedJwt in their context', () => {
				context = makeMockGraphContext({
					applicationServices: {
						...makeMockGraphContext().applicationServices,
						verifiedUser: null,
					},
				});
			});
			When('the createReservationRequest mutation is executed', async () => {
				try {
					const resolver = reservationRequestResolvers.Mutation
						?.createReservationRequest as TestResolver<{
						input: {
							listingId: string;
							reservationPeriodStart: string;
							reservationPeriodEnd: string;
						};
					}>;
					await resolver({}, { input }, context, {} as never);
				} catch (e) {
					error = e as Error;
				}
			});
			Then(
				'it should throw a "User must be authenticated to create a reservation request" error',
				() => {
					expect(error).toBeDefined();
					expect(error?.message).toContain(
						'User must be authenticated to create a reservation request',
					);
				},
			);
		},
	);

	Scenario(
		'Error while creating a reservation request',
		({ Given, And, When, Then }) => {
			const input = {
				listingId: 'listing-123',
				reservationPeriodStart: '2024-02-01T00:00:00Z',
				reservationPeriodEnd: '2024-02-10T00:00:00Z',
			};
			Given('a verified user', () => {
				context = makeMockGraphContext();
			});
			And('ReservationRequest.create throws an error', () => {
				vi.mocked(
					context.applicationServices.ReservationRequest.ReservationRequest
						.create,
				).mockRejectedValue(new Error('Creation failed'));
			});
			When('the createReservationRequest mutation is executed', async () => {
				try {
					const resolver = reservationRequestResolvers.Mutation
						?.createReservationRequest as TestResolver<{
						input: {
							listingId: string;
							reservationPeriodStart: string;
							reservationPeriodEnd: string;
						};
					}>;
					await resolver({}, { input }, context, {} as never);
				} catch (e) {
					error = e as Error;
				}
			});
			Then('it should propagate the error message', () => {
				expect(error).toBeDefined();
				expect(error?.message).toContain('Creation failed');
			});
		},
	);


	Scenario(
		'Error while querying myListingsRequests',
		({ Given, When, Then }) => {
			Given(
				'ReservationRequest.queryListingRequestsBySharerId throws an error',
				() => {
					context = makeMockGraphContext();
					vi.mocked(
						context.applicationServices.ReservationRequest.ReservationRequest
							.queryListingRequestsBySharerId,
					).mockRejectedValue(new Error('Database error'));
				},
			);
			When('the myListingsRequests query is executed', async () => {
				try {
					const resolver = reservationRequestResolvers.Query
						?.myListingsRequests as TestResolver<{
						sharerId: string;
						page: number;
						pageSize: number;
						searchText: string;
						statusFilters: string[];
						sorter: { field: string; order: string };
					}>;
					await resolver(
						{},
						{
							sharerId: 'sharer-123',
							page: 1,
							pageSize: 10,
							searchText: '',
							statusFilters: [],
							sorter: { field: 'requestedOn', order: 'descend' },
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
				expect(error?.message).toContain('Database error');
			});
		},
	);

	Scenario(
		'Creating a reservation request with invalid dates',
		({ Given, When, Then }) => {
			const input = {
				listingId: 'listing-123',
				reservationPeriodStart: '2024-02-10T00:00:00Z',
				reservationPeriodEnd: '2024-02-01T00:00:00Z',
			};
			Given(
				'a verified user and input where reservationPeriodStart is after reservationPeriodEnd',
				() => {
					context = makeMockGraphContext();
					vi.mocked(
						context.applicationServices.ReservationRequest.ReservationRequest
							.create,
					).mockRejectedValue(
						new Error('Reservation start date must be before end date'),
					);
				},
			);
			When('the createReservationRequest mutation is executed', async () => {
				try {
					const resolver = reservationRequestResolvers.Mutation
						?.createReservationRequest as TestResolver<{
						input: {
							listingId: string;
							reservationPeriodStart: string;
							reservationPeriodEnd: string;
						};
					}>;
					await resolver({}, { input }, context, {} as never);
				} catch (e) {
					error = e as Error;
				}
			});
			Then('it should throw a validation or business rule error', () => {
				expect(error).toBeDefined();
				expect(error?.message).toContain('start date must be before end date');
			});
		},
	);

});
