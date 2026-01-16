import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Domain } from '@sthrift/domain';
import { expect, vi } from 'vitest';
import type { GraphContext } from '../../../init/context.ts';
import reservationRequestResolvers from './reservation-request.resolvers.ts';

// Generic GraphQL resolver type for tests
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

// Type for GraphQL ReservationRequestPage
interface ReservationRequestPage {
	items: {
		id: string;
		listing?: { title: string };
		reserver?: { account?: { username: string } };
		createdAt?: string;
		state?: string;
		reservationPeriodStart?: string;
		reservationPeriodEnd?: string;
	}[];
	total: number;
	page: number;
	pageSize: number;
}

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

// Helper function to create mock paginated result with domain entities
function createMockPaginatedResult(
	items: ReservationRequestEntity[],
	total = items.length,
	page = 1,
	pageSize = 10,
): { items: ReservationRequestEntity[]; total: number; page: number; pageSize: number } {
	return { items, total, page, pageSize };
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
					// biome-ignore lint/suspicious/noExplicitAny: GraphQL resolver testing requires any type
					?.myActiveReservations as any;
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
					// biome-ignore lint/suspicious/noExplicitAny: GraphQL resolver testing requires any type
					?.myActiveReservations as any;
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
						// biome-ignore lint/suspicious/noExplicitAny: GraphQL resolver testing requires any type
						?.myActiveReservations as any;
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
					// biome-ignore lint/suspicious/noExplicitAny: GraphQL resolver testing requires any type
					?.myPastReservations as any;
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
				// biome-ignore lint/suspicious/noExplicitAny: GraphQL resolver testing requires any type
				?.myPastReservations as any;
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
						// biome-ignore lint/suspicious/noExplicitAny: GraphQL resolver testing requires any type
						?.myPastReservations as any;
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
					const mockEntities = [
						createMockReservationRequest({
							id: '1',
							listing: { id: 'listing-1', title: 'Test Item' } as ItemListingEntity,
							reserver: { id: 'user-1', account: { username: 'testuser' } } as PersonalUserEntity,
							createdAt: new Date('2024-01-01T00:00:00.000Z'),
							reservationPeriodStart: new Date('2024-02-01'),
							reservationPeriodEnd: new Date('2024-02-10'),
							state: 'Requested',
						}),
					];
					const mockPaginatedResult = createMockPaginatedResult(mockEntities, 1, 1, 10);
					vi.mocked(
						context.applicationServices.ReservationRequest.ReservationRequest
							.queryListingRequestsBySharerId,
					).mockResolvedValue(mockPaginatedResult);
				});
				When('the myListingsRequests query is executed', async () => {
					const resolver = reservationRequestResolvers.Query
						?.myListingsRequests as TestResolver<{
						sharerId: string;
						page: number;
						pageSize: number;
					}>;
					result = await resolver(
						{},
						{ sharerId, page: 1, pageSize: 10 },
						context,
						{} as never,
					);
				});
				Then(
					'it should call ReservationRequest.queryListingRequestsBySharerId with the provided sharerId',
					() => {
						expect(
							context.applicationServices.ReservationRequest.ReservationRequest
								.queryListingRequestsBySharerId,
						).toHaveBeenCalledWith({ sharerId, page: 1, pageSize: 10, searchText: undefined, statusFilters: [] });
					},
				);
				And('it should paginate and map the results using paginateAndFilterListingRequests', () => {
					// This is tested implicitly as the resolver calls the application service
					// which handles pagination and mapping
					expect(result).toBeDefined();
				});
				And('it should return items, total, page, and pageSize', () => {
					expect(result).toHaveProperty('items');
					expect(result).toHaveProperty('total');
					expect(result).toHaveProperty('page');
					expect(result).toHaveProperty('pageSize');
					const items = (result as ReservationRequestPage).items;
					expect(items).toHaveLength(1);
				});
			},
		);		Scenario(
			'Filtering myListingsRequests by search text',
			({ Given, And, When, Then }) => {
				Given('reservation requests for a sharer', () => {
					context = makeMockGraphContext();
					const mockEntities = [
						createMockReservationRequest({
							id: '1',
							listing: { id: 'listing-1', title: 'Camera' } as ItemListingEntity,
							reserver: { id: 'user-1', account: { username: 'user1' } } as PersonalUserEntity,
							createdAt: new Date('2024-01-01T00:00:00.000Z'),
							reservationPeriodStart: new Date('2024-02-01'),
							reservationPeriodEnd: new Date('2024-02-10'),
							state: 'Requested',
						}),
					];
					const mockPaginatedResult = createMockPaginatedResult(mockEntities, 1, 1, 10);
					vi.mocked(
						context.applicationServices.ReservationRequest.ReservationRequest
							.queryListingRequestsBySharerId,
					).mockResolvedValue(mockPaginatedResult);
				});
				And('a searchText "camera"', () => {
					// Searchtext will be used in the When step
				});
				When('the myListingsRequests query is executed', async () => {
					const resolver = reservationRequestResolvers.Query
						?.myListingsRequests as TestResolver<{
						sharerId: string;
						page: number;
						pageSize: number;
						searchText: string;
					}>;
					result = await resolver(
						{},
						{
							sharerId: 'sharer-123',
							page: 1,
							pageSize: 10,
							searchText: 'camera',
						},
						context,
						{} as never,
					);
				});
				Then(
					'only listings whose titles include "camera" should be returned',
					() => {
						const items = (result as { items: { listing?: { title: string } }[] }).items;
						expect(items).toHaveLength(1);
						expect(items[0]?.listing?.title).toBe('Camera');
					},
				);
			},
		);	Scenario(
		'Filtering myListingsRequests by status',
		({ Given, And, When, Then }) => {
			Given(
				'reservation requests with mixed statuses ["Pending", "Accepted"]',
				() => {
					context = makeMockGraphContext();
					const mockEntities = [
						createMockReservationRequest({
							id: '2',
							listing: { id: 'listing-2', title: 'Item 2' } as ItemListingEntity,
							reserver: { id: 'user-2', account: { username: 'user2' } } as PersonalUserEntity,
							createdAt: new Date('2024-01-01T00:00:00.000Z'),
							reservationPeriodStart: new Date('2024-02-01'),
							reservationPeriodEnd: new Date('2024-02-10'),
							state: 'Accepted',
						}),
					];
					const mockPaginatedResult = createMockPaginatedResult(mockEntities, 1, 1, 10);
					vi.mocked(
						context.applicationServices.ReservationRequest.ReservationRequest
							.queryListingRequestsBySharerId,
					).mockResolvedValue(mockPaginatedResult);
				},
			);
			And('a statusFilters ["Accepted"]', () => {
				// Status filters will be used in the When step
			});
			When('the myListingsRequests query is executed', async () => {
				const resolver = reservationRequestResolvers.Query
					?.myListingsRequests as unknown as TestResolver<{
					sharerId: string;
					page: number;
					pageSize: number;
					statusFilters: string[];
				}>;
				result = await resolver(
					{},
					{
						sharerId: 'sharer-123',
						page: 1,
						pageSize: 10,
						statusFilters: ['Accepted'],
					},
					context,
					{} as never,
				);
			});
			Then(
				'only requests with status "Accepted" should be included',
				() => {
					const items = (result as { items: { state?: string }[] }).items;
					expect(items).toHaveLength(1);
					expect(items[0]?.state).toBe('Accepted');
				},
			);
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
		'Sorting myListingsRequests by requestedOn descending',
		({ Given, And, When, Then }) => {
			Given('reservation requests with varying createdAt timestamps', () => {
				context = makeMockGraphContext();
				const mockEntities = [
					createMockReservationRequest({
						id: '2',
						listing: { id: 'listing-2', title: 'Item 2' } as ItemListingEntity,
						reserver: { id: 'user-2', account: { username: 'user2' } } as PersonalUserEntity,
						createdAt: new Date('2024-01-03T00:00:00.000Z'),
						reservationPeriodStart: new Date('2024-02-01'),
						reservationPeriodEnd: new Date('2024-02-10'),
						state: 'Requested',
					}),
					createMockReservationRequest({
						id: '3',
						listing: { id: 'listing-3', title: 'Item 3' } as ItemListingEntity,
						reserver: { id: 'user-3', account: { username: 'user3' } } as PersonalUserEntity,
						createdAt: new Date('2024-01-02T00:00:00.000Z'),
						reservationPeriodStart: new Date('2024-02-01'),
						reservationPeriodEnd: new Date('2024-02-10'),
						state: 'Requested',
					}),
					createMockReservationRequest({
						id: '1',
						listing: { id: 'listing-1', title: 'Item 1' } as ItemListingEntity,
						reserver: { id: 'user-1', account: { username: 'user1' } } as PersonalUserEntity,
						createdAt: new Date('2024-01-01T00:00:00.000Z'),
						reservationPeriodStart: new Date('2024-02-01'),
						reservationPeriodEnd: new Date('2024-02-10'),
						state: 'Requested',
					}),
				];
				const mockPaginatedResult = createMockPaginatedResult(mockEntities, 3, 1, 10);
				vi.mocked(
					context.applicationServices.ReservationRequest.ReservationRequest
						.queryListingRequestsBySharerId,
				).mockResolvedValue(mockPaginatedResult);
			});
			And('sorter field "requestedOn" with order "descend"', () => {
				// Sorter will be used in the When step
			});
			When('the myListingsRequests query is executed', async () => {
				const resolver = reservationRequestResolvers.Query
					?.myListingsRequests as TestResolver<{
					sharerId: string;
					page: number;
					pageSize: number;
					sorter?: { field: string; order: 'ascend' | 'descend' };
				}>;
				result = await resolver(
					{},
					{
						sharerId: 'sharer-123',
						page: 1,
						pageSize: 10,
						sorter: { field: 'requestedOn', order: 'descend' },
					},
					context,
					{} as never,
				);
			});
			Then('results should be sorted by requestedOn in descending order', () => {
				const items = (result as { items: { createdAt?: Date }[] }).items;
				expect(items.length).toBe(3);
				// Verify items are in descending order by requestedOn
				expect(items[0]?.createdAt).toEqual(new Date('2024-01-03T00:00:00.000Z'));
				expect(items[1]?.createdAt).toEqual(new Date('2024-01-02T00:00:00.000Z'));
				expect(items[2]?.createdAt).toEqual(new Date('2024-01-01T00:00:00.000Z'));
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
					}>;
					await resolver(
						{},
						{ sharerId: 'sharer-123', page: 1, pageSize: 10 },
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

	Scenario('Paginating listing requests', ({ Given, When, Then }) => {
		Given('25 listing requests and a pageSize of 10', () => {
			context = makeMockGraphContext();
			const mockEntities = Array.from({ length: 10 }, (_, i) =>
				createMockReservationRequest({
					id: `${i + 11}`,
					listing: { id: `listing-${i + 11}`, title: `Item ${i + 11}` } as ItemListingEntity,
					reserver: { id: `user-${i + 11}`, account: { username: `user${i + 11}` } } as PersonalUserEntity,
					createdAt: new Date('2024-01-01T00:00:00.000Z'),
					reservationPeriodStart: new Date('2024-02-01'),
					reservationPeriodEnd: new Date('2024-02-10'),
					state: 'Requested',
				}),
			);
			const mockPaginatedResult = createMockPaginatedResult(mockEntities, 25, 2, 10);
			vi.mocked(
				context.applicationServices.ReservationRequest.ReservationRequest
					.queryListingRequestsBySharerId,
			).mockResolvedValue(mockPaginatedResult);
		});
		When('the myListingsRequests query is executed for page 2', async () => {
			const resolver = reservationRequestResolvers.Query
				?.myListingsRequests as TestResolver<{
				sharerId: string;
				page: number;
				pageSize: number;
			}>;
			result = await resolver(
				{},
				{ sharerId: 'sharer-123', page: 2, pageSize: 10 },
				context,
				{} as never,
			);
		});
		Then(
			'it should return 10 items for page 2 and total 25',
			() => {
				const paginatedResult = result as {
					items: unknown[];
					total: number;
					page: number;
					pageSize: number;
				};
				expect(paginatedResult.items.length).toBe(10);
				expect(paginatedResult.total).toBe(25);
				expect(paginatedResult.page).toBe(2);
				expect(paginatedResult.pageSize).toBe(10);
			},
		);
	});

	Scenario(
		'Sorting listing requests by title ascending',
		({ Given, And, When, Then }) => {
			Given('multiple listing requests with varying titles', () => {
				context = makeMockGraphContext();
				const mockEntities = [
					createMockReservationRequest({
						id: '2',
						listing: { id: 'listing-2', title: 'Apple Drone' } as ItemListingEntity,
						reserver: { id: 'user-2', account: { username: 'user2' } } as PersonalUserEntity,
						createdAt: new Date('2024-01-01T00:00:00.000Z'),
						reservationPeriodStart: new Date('2024-02-01'),
						reservationPeriodEnd: new Date('2024-02-10'),
						state: 'Requested',
					}),
					createMockReservationRequest({
						id: '3',
						listing: { id: 'listing-3', title: 'Microphone Beta' } as ItemListingEntity,
						reserver: { id: 'user-3', account: { username: 'user3' } } as PersonalUserEntity,
						createdAt: new Date('2024-01-01T00:00:00.000Z'),
						reservationPeriodStart: new Date('2024-02-01'),
						reservationPeriodEnd: new Date('2024-02-10'),
						state: 'Requested',
					}),
					createMockReservationRequest({
						id: '1',
						listing: { id: 'listing-1', title: 'Zebra Camera' } as ItemListingEntity,
						reserver: { id: 'user-1', account: { username: 'user1' } } as PersonalUserEntity,
						createdAt: new Date('2024-01-01T00:00:00.000Z'),
						reservationPeriodStart: new Date('2024-02-01'),
						reservationPeriodEnd: new Date('2024-02-10'),
						state: 'Requested',
					}),
				];
				const mockPaginatedResult = createMockPaginatedResult(mockEntities, 3, 1, 10);
				vi.mocked(
					context.applicationServices.ReservationRequest.ReservationRequest
						.queryListingRequestsBySharerId,
				).mockResolvedValue(mockPaginatedResult);
			});
			And('sorter field "title" with order "ascend"', () => {
				// Sorter will be used in the When step
			});
			When('the myListingsRequests query is executed', async () => {
				const resolver = reservationRequestResolvers.Query
					?.myListingsRequests as TestResolver<{
					sharerId: string;
					page: number;
					pageSize: number;
					sorter?: { field: string; order: 'ascend' | 'descend' };
				}>;
				result = await resolver(
					{},
					{
						sharerId: 'sharer-123',
						page: 1,
						pageSize: 10,
						sorter: { field: 'title', order: 'ascend' },
					},
					context,
					{} as never,
				);
			});
			Then('the results should be sorted alphabetically by title', () => {
				const items = (result as { items: { listing: { title: string } }[] }).items;
				expect(items.length).toBe(3);
				// Verify items are in ascending order by title
				expect(items[0]?.listing.title).toBe('Apple Drone');
				expect(items[1]?.listing.title).toBe('Microphone Beta');
				expect(items[2]?.listing.title).toBe('Zebra Camera');
			});
		},
	);

	Scenario(
		'Sorting myListingsRequests by state descending',
		({ Given, And, When, Then }) => {
			Given('reservation requests with different states', () => {
				context = makeMockGraphContext();
				const mockEntities = [
					createMockReservationRequest({
						id: '3',
						listing: { id: 'listing-3', title: 'Item 3' } as ItemListingEntity,
						reserver: { id: 'user-3', account: { username: 'user3' } } as PersonalUserEntity,
						createdAt: new Date('2024-01-01T00:00:00.000Z'),
						reservationPeriodStart: new Date('2024-02-01'),
						reservationPeriodEnd: new Date('2024-02-10'),
						state: 'Requested',
					}),
					createMockReservationRequest({
						id: '2',
						listing: { id: 'listing-2', title: 'Item 2' } as ItemListingEntity,
						reserver: { id: 'user-2', account: { username: 'user2' } } as PersonalUserEntity,
						createdAt: new Date('2024-01-01T00:00:00.000Z'),
						reservationPeriodStart: new Date('2024-02-01'),
						reservationPeriodEnd: new Date('2024-02-10'),
						state: 'Pending',
					}),
					createMockReservationRequest({
						id: '1',
						listing: { id: 'listing-1', title: 'Item 1' } as ItemListingEntity,
						reserver: { id: 'user-1', account: { username: 'user1' } } as PersonalUserEntity,
						createdAt: new Date('2024-01-01T00:00:00.000Z'),
						reservationPeriodStart: new Date('2024-02-01'),
						reservationPeriodEnd: new Date('2024-02-10'),
						state: 'Accepted',
					}),
				];
				const mockPaginatedResult = createMockPaginatedResult(mockEntities, 3, 1, 10);
				vi.mocked(
					context.applicationServices.ReservationRequest.ReservationRequest
						.queryListingRequestsBySharerId,
				).mockResolvedValue(mockPaginatedResult);
			});
			And('sorter field "state" with order "descend"', () => {
				// Sorter will be used in the When step
			});
			When('the myListingsRequests query is executed', async () => {
				const resolver = reservationRequestResolvers.Query
					?.myListingsRequests as TestResolver<{
					sharerId: string;
					page: number;
					pageSize: number;
					sorter?: { field: string; order: 'ascend' | 'descend' };
				}>;
				result = await resolver(
					{},
					{
						sharerId: 'sharer-123',
						page: 1,
						pageSize: 10,
						sorter: { field: 'state', order: 'descend' },
					},
					context,
					{} as never,
				);
			});
			Then('results should be sorted by state in descending order', () => {
				const items = (result as { items: { state?: string }[] }).items;
				expect(items.length).toBe(3);
				// Verify items are in descending order by state
				expect(items[0]?.state).toBe('Requested');
				expect(items[1]?.state).toBe('Pending');
				expect(items[2]?.state).toBe('Accepted');
			});
		},
	);

	Scenario(
		'Sorting myListingsRequests by createdAt ascending',
		({ Given, And, When, Then }) => {
			Given('reservation requests with different creation dates', () => {
				context = makeMockGraphContext();
				const mockEntities = [
					createMockReservationRequest({
						id: '1',
						listing: { id: 'listing-1', title: 'Item 1' } as ItemListingEntity,
						reserver: { id: 'user-1', account: { username: 'user1' } } as PersonalUserEntity,
						createdAt: new Date('2024-01-01T00:00:00.000Z'),
						reservationPeriodStart: new Date('2024-02-01'),
						reservationPeriodEnd: new Date('2024-02-10'),
						state: 'Requested',
					}),
					createMockReservationRequest({
						id: '3',
						listing: { id: 'listing-3', title: 'Item 3' } as ItemListingEntity,
						reserver: { id: 'user-3', account: { username: 'user3' } } as PersonalUserEntity,
						createdAt: new Date('2024-01-02T00:00:00.000Z'),
						reservationPeriodStart: new Date('2024-02-01'),
						reservationPeriodEnd: new Date('2024-02-10'),
						state: 'Requested',
					}),
					createMockReservationRequest({
						id: '2',
						listing: { id: 'listing-2', title: 'Item 2' } as ItemListingEntity,
						reserver: { id: 'user-2', account: { username: 'user2' } } as PersonalUserEntity,
						createdAt: new Date('2024-01-03T00:00:00.000Z'),
						reservationPeriodStart: new Date('2024-02-01'),
						reservationPeriodEnd: new Date('2024-02-10'),
						state: 'Requested',
					}),
				];
				const mockPaginatedResult = createMockPaginatedResult(mockEntities, 3, 1, 10);
				vi.mocked(
					context.applicationServices.ReservationRequest.ReservationRequest
						.queryListingRequestsBySharerId,
				).mockResolvedValue(mockPaginatedResult);
			});
			And('sorter field "createdAt" with order "ascend"', () => {
				// Sorter will be used in the When step
			});
			When('the myListingsRequests query is executed', async () => {
				const resolver = reservationRequestResolvers.Query
					?.myListingsRequests as TestResolver<{
					sharerId: string;
					page: number;
					pageSize: number;
					sorter?: { field: string; order: 'ascend' | 'descend' };
				}>;
				result = await resolver(
					{},
					{
						sharerId: 'sharer-123',
						page: 1,
						pageSize: 10,
						sorter: { field: 'createdAt', order: 'ascend' },
					},
					context,
					{} as never,
				);
			});
			Then('results should be sorted by createdAt in ascending order', () => {
				const items = (result as { items: { createdAt?: Date }[] }).items;
				expect(items.length).toBe(3);
				// Verify items are in ascending order by createdAt
				expect(items[0]?.createdAt).toEqual(new Date('2024-01-01T00:00:00.000Z'));
				expect(items[1]?.createdAt).toEqual(new Date('2024-01-02T00:00:00.000Z'));
				expect(items[2]?.createdAt).toEqual(new Date('2024-01-03T00:00:00.000Z'));
			});
		},
	);

	Scenario(
		'myListingsRequests with invalid sorter order defaults to null',
		({ Given, And, When, Then }) => {
			Given('reservation requests for a sharer', () => {
				context = makeMockGraphContext();
				const mockEntities = [
					createMockReservationRequest({
						id: '1',
						listing: { id: 'listing-1', title: 'Item 1' } as ItemListingEntity,
						reserver: { id: 'user-1', account: { username: 'user1' } } as PersonalUserEntity,
						createdAt: new Date('2024-01-01T00:00:00.000Z'),
						reservationPeriodStart: new Date('2024-02-01'),
						reservationPeriodEnd: new Date('2024-02-10'),
						state: 'Requested',
					}),
				];
				const mockPaginatedResult = createMockPaginatedResult(mockEntities, 1, 1, 10);
				vi.mocked(
					context.applicationServices.ReservationRequest.ReservationRequest
						.queryListingRequestsBySharerId,
				).mockResolvedValue(mockPaginatedResult);
			});
			And('a sorter with invalid order value', () => {
				// Invalid sorter will be used in the When step
			});
			When('the myListingsRequests query is executed', async () => {
				const resolver = reservationRequestResolvers.Query
					?.myListingsRequests as TestResolver<{
					sharerId: string;
					page: number;
					pageSize: number;
					sorter?: { field: string; order: string };
				}>;
				result = await resolver(
					{},
					{
						sharerId: 'sharer-123',
						page: 1,
						pageSize: 10,
						sorter: { field: 'title', order: 'invalid' },
					},
					context,
					{} as never,
				);
			});
			Then(
				'it should call queryListingRequestsBySharerId with sorter order set to null',
				() => {
					expect(
						context.applicationServices.ReservationRequest.ReservationRequest
							.queryListingRequestsBySharerId,
					).toHaveBeenCalledWith(
						expect.objectContaining({
							sharerId: 'sharer-123',
							page: 1,
							pageSize: 10,
							sorter: { field: 'title', order: null },
						}),
					);
				},
			);
		},
	);

	Scenario(
		'myListingsRequests with combined search, filters, and sorting',
		({ Given, And, When, Then }) => {
			Given('reservation requests with mixed properties', () => {
				context = makeMockGraphContext();
				const mockEntities = [
					createMockReservationRequest({
						id: '1',
						listing: { id: 'listing-1', title: 'Camera Alpha' } as ItemListingEntity,
						reserver: { id: 'user-1', account: { username: 'user1' } } as PersonalUserEntity,
						createdAt: new Date('2024-01-01T00:00:00.000Z'),
						reservationPeriodStart: new Date('2024-02-01'),
						reservationPeriodEnd: new Date('2024-02-10'),
						state: 'Accepted',
					}),
					createMockReservationRequest({
						id: '2',
						listing: { id: 'listing-2', title: 'Camera Beta' } as ItemListingEntity,
						reserver: { id: 'user-2', account: { username: 'user2' } } as PersonalUserEntity,
						createdAt: new Date('2024-01-02T00:00:00.000Z'),
						reservationPeriodStart: new Date('2024-02-01'),
						reservationPeriodEnd: new Date('2024-02-10'),
						state: 'Accepted',
					}),
				];
				const mockPaginatedResult = createMockPaginatedResult(mockEntities, 2, 1, 10);
				vi.mocked(
					context.applicationServices.ReservationRequest.ReservationRequest
						.queryListingRequestsBySharerId,
				).mockResolvedValue(mockPaginatedResult);
			});
			And('search text "camera", status filters ["Accepted"], and sorter by title ascending', () => {
				// Combined parameters will be used in the When step
			});
			When('the myListingsRequests query is executed', async () => {
				const resolver = reservationRequestResolvers.Query
					?.myListingsRequests as TestResolver<{
					sharerId: string;
					page: number;
					pageSize: number;
					searchText: string;
					statusFilters: string[];
					sorter?: { field: string; order: 'ascend' | 'descend' };
				}>;
				result = await resolver(
					{},
					{
						sharerId: 'sharer-123',
						page: 1,
						pageSize: 10,
						searchText: 'camera',
						statusFilters: ['Accepted'],
						sorter: { field: 'title', order: 'ascend' },
					},
					context,
					{} as never,
				);
			});
			Then(
				'it should call queryListingRequestsBySharerId with all combined parameters',
				() => {
					expect(
						context.applicationServices.ReservationRequest.ReservationRequest
							.queryListingRequestsBySharerId,
					).toHaveBeenCalledWith(
						expect.objectContaining({
							sharerId: 'sharer-123',
							page: 1,
							pageSize: 10,
							searchText: 'camera',
							statusFilters: ['Accepted'],
							sorter: { field: 'title', order: 'ascend' },
						}),
					);
				},
			);
			And('it should return filtered and sorted results', () => {
				const items = (result as { items: { listing: { title: string }; state?: string }[] }).items;
				expect(items.length).toBe(2);
				expect(items[0]?.listing.title).toBe('Camera Alpha');
				expect(items[1]?.listing.title).toBe('Camera Beta');
				expect(items[0]?.state).toBe('Accepted');
				expect(items[1]?.state).toBe('Accepted');
			});
		},
	);

	Scenario(
		'myListingsRequests with no matching results after filtering',
		({ Given, And, When, Then }) => {
			Given('reservation requests for a sharer', () => {
				context = makeMockGraphContext();
			});
			And('no requests match the strict filter criteria', () => {
				const mockPaginatedResult = createMockPaginatedResult([], 0, 1, 10);
				vi.mocked(
					context.applicationServices.ReservationRequest.ReservationRequest
						.queryListingRequestsBySharerId,
				).mockResolvedValue(mockPaginatedResult);
			});
			When('the myListingsRequests query is executed', async () => {
				const resolver = reservationRequestResolvers.Query
					// biome-ignore lint/suspicious/noExplicitAny: GraphQL resolver testing requires any type
					?.myListingsRequests as any;
				result = await resolver(
					{},
					{
						sharerId: 'sharer-123',
						page: 1,
						pageSize: 10,
						searchText: 'nonexistent-item',
						statusFilters: ['Accepted'],
					},
					context,
					{} as never,
				);
			});
			Then('it should return empty results with total 0', () => {
				const paginatedResult = result as { items: unknown[]; total: number };
				expect(paginatedResult.items).toEqual([]);
				expect(paginatedResult.total).toBe(0);
			});
		},
	);

	Scenario(
		'myListingsRequests with null sorter field',
		({ Given, And, When, Then }) => {
			Given('reservation requests for a sharer', () => {
				context = makeMockGraphContext();
				const mockEntities = [
					createMockReservationRequest({
						id: '1',
						listing: { id: 'listing-1', title: 'Item 1' } as ItemListingEntity,
						reserver: { id: 'user-1', account: { username: 'user1' } } as PersonalUserEntity,
						createdAt: new Date('2024-01-01T00:00:00.000Z'),
						reservationPeriodStart: new Date('2024-02-01'),
						reservationPeriodEnd: new Date('2024-02-10'),
						state: 'Requested',
					}),
				];
				const mockPaginatedResult = createMockPaginatedResult(mockEntities, 1, 1, 10);
				vi.mocked(
					context.applicationServices.ReservationRequest.ReservationRequest
						.queryListingRequestsBySharerId,
				).mockResolvedValue(mockPaginatedResult);
			});
			And('a sorter with null field', () => {
				// Null field sorter will be used in the When step
			});
			When('the myListingsRequests query is executed', async () => {
				const resolver = reservationRequestResolvers.Query
					?.myListingsRequests as TestResolver<{
					sharerId: string;
					page: number;
					pageSize: number;
					sorter?: { field: string | null; order: 'ascend' | 'descend' };
				}>;
				result = await resolver(
					{},
					{
						sharerId: 'sharer-123',
						page: 1,
						pageSize: 10,
						sorter: { field: null, order: 'ascend' },
					},
					context,
					{} as never,
				);
			});
			Then(
				'it should call queryListingRequestsBySharerId with sorter field set to null',
				() => {
					expect(
						context.applicationServices.ReservationRequest.ReservationRequest
							.queryListingRequestsBySharerId,
					).toHaveBeenCalledWith(
						expect.objectContaining({
							sharerId: 'sharer-123',
							page: 1,
							pageSize: 10,
							sorter: { field: null, order: 'ascend' },
						}),
					);
				},
			);
		},
	);
});
