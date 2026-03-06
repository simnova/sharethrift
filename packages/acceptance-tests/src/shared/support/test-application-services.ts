import { Domain } from '@sthrift/domain';
import type {
	ApplicationServices,
	ApplicationServicesFactory,
	VerifiedUser,
} from '@sthrift/application-services';

interface TestListing {
	id: string;
	title: string;
	description: string;
	category: string;
	location: string;
	state: 'draft' | 'published';
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	images: unknown[];
}

interface TestReservationRequest {
	id: string;
	listingId: string;
	reserverId: string;
	reservationPeriodStart: Date;
	reservationPeriodEnd: Date;
	state: string;
	createdAt: Date;
	updatedAt: Date;
}

function generateObjectId(): string {
		const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
		const random = Math.random().toString(16).substring(2, 18).padStart(16, '0');
		return (timestamp + random).substring(0, 24);
}

export function createTestApplicationServicesFactory(): ApplicationServicesFactory {
	// In-memory storage for test data
	const listings = new Map<string, TestListing>();
	const reservationRequests = new Map<string, TestReservationRequest>();

	// Helper to generate valid MongoDB ObjectID-like strings
	

	// Create test users with valid ObjectId-like IDs
	const users = new Map<string, Record<string, unknown>>();

	function getOrCreateUser(email: string, firstName?: string, lastName?: string): Record<string, unknown> {
		let user = users.get(email);
		if (!user) {
			user = {
				id: generateObjectId(),
				email,
				firstName: firstName ?? email.split('@')[0],
				lastName: lastName ?? 'Test',
				userType: 'personal-user',
			};
			users.set(email, user);
		}
		return user;
	}

	// Pre-create Alice
	const aliceUser = getOrCreateUser('alice@test.com', 'Alice', 'Test');

	return {
		forRequest: (): Promise<ApplicationServices> => {
			// Create mock application services implementing ApplicationServices interface
			const services = {
				// User service with test users
				User: {
					PersonalUser: {
						createIfNotExists: async () => aliceUser as unknown,
						queryById: async ({ id }: Record<string, unknown>) => {
							const user = Array.from(users.values()).find(u => u['id'] === String(id));
							return (user ?? aliceUser) as unknown;
						},
						update: async () => aliceUser as unknown,
						queryByEmail: async ({ email }: Record<string, unknown>) => {
							return (getOrCreateUser(String(email)) ?? null) as unknown;
						},
						getAllUsers: async () => ({
							users: Array.from(users.values()).map(u => ({ id: u['id'] })),
							total: users.size,
							page: 1,
							pageSize: 10,
						}),
						processPayment: async () => ({} as unknown),
						generatePublicKey: async () => 'mock-public-key',
						refundPayment: async () => ({} as unknown),
					},
					AdminUser: {
						create: async () => ({ id: '' } as unknown),
						queryById: async () => null,
						update: async () => ({ id: '' } as unknown),
						queryByEmail: async () => null,
						queryByUsername: async () => null,
						getAllUsers: async () => ({ users: [], total: 0, page: 1, pageSize: 10 }),
						blockUser: async () => ({ id: '' } as unknown),
						unblockUser: async () => ({ id: '' } as unknown),
					},
					User: {
						queryById: async ({ id }: Record<string, unknown>) => {
							const user = Array.from(users.values()).find(u => u['id'] === String(id));
							return (user ?? null) as unknown;
						},
					},
				},

				Conversation: {} as unknown,
				AccountPlan: {} as unknown,
				AppealRequest: {} as unknown,

				// Reservation Request service with in-memory storage
				ReservationRequest: {
					ReservationRequest: {
						create: (input: Record<string, unknown>) => {
							const id = generateObjectId();
							const reserverEmail = String(input['reserverEmail'] ?? '');
							const reserverUser = getOrCreateUser(reserverEmail);
							const listingId = String(input['listingId']);
							const reservationPeriodStart = input['reservationPeriodStart'] as Date;
							const reservationPeriodEnd = input['reservationPeriodEnd'] as Date;

							// Check for overlapping active reservations (matches real app service behavior)
							const overlapping = Array.from(reservationRequests.values()).filter(
								(r) =>
									r.listingId === listingId &&
									['Requested', 'Accepted'].includes(r.state) &&
									reservationPeriodStart < r.reservationPeriodEnd &&
									reservationPeriodEnd > r.reservationPeriodStart,
							);
							if (overlapping.length > 0) {
								throw new Error(
									'Reservation period overlaps with existing active reservation requests',
								);
							}

							const reservation: TestReservationRequest = {
								id,
								listingId,
								reserverId: String(reserverUser['id']),
								reservationPeriodStart,
								reservationPeriodEnd,
								state: 'Requested',
								createdAt: new Date(),
								updatedAt: new Date(),
							};
							reservationRequests.set(id, reservation);
							return Promise.resolve({
								id: reservation.id,
								state: reservation.state,
								reservationPeriodStart: reservation.reservationPeriodStart,
								reservationPeriodEnd: reservation.reservationPeriodEnd,
								listing: { id: reservation.listingId },
								reserver: { id: reservation.reserverId },
								createdAt: reservation.createdAt,
								updatedAt: reservation.updatedAt,
							} as unknown);
						},
						queryById: ({ id }: Record<string, unknown>) => {
							return Promise.resolve((reservationRequests.get(String(id)) || null) as unknown);
						},
						queryActiveByListingId: ({ listingId }: Record<string, unknown>) => {
							const results = Array.from(reservationRequests.values())
								.filter(r => r.listingId === String(listingId));
							return Promise.resolve(results as unknown[]);
						},
						queryActiveByReserverId: async () => [] as unknown[],
						queryPastByReserverId: async () => [] as unknown[],
						queryActiveByReserverIdAndListingId: async () => null as unknown,
						queryOverlapByListingIdAndReservationPeriod: async () => [] as unknown[],
						queryListingRequestsBySharerId: async () => ({
							items: [],
							total: 0,
							page: 1,
							pageSize: 10,
						}),
					},
				},

				// Listing service with in-memory storage
				Listing: {
					ItemListing: {
						create: (input: Record<string, unknown>) => {
						const { Title, Description, Category, Location } =
							Domain.Contexts.Listing.ItemListing.ItemListingValueObjects;

						// Validate using real domain value objects (throws on invalid input)
						const title = new Title(input['title'] as string).valueOf();
						const description = new Description(input['description'] as string).valueOf();
						const category = new Category(input['category'] as string).valueOf();
						const location = new Location(input['location'] as string).valueOf();

						const id = generateObjectId();
						const state: 'draft' | 'published' = input['isDraft'] ? 'draft' : 'published';
						const listing: TestListing = {
							id,
							title,
							description,
							category,
							location,
								state,
								sharingPeriodStart: input['sharingPeriodStart'] as Date,
								sharingPeriodEnd: input['sharingPeriodEnd'] as Date,
								images: (input['images'] as unknown[]) || [],
							};

							listings.set(id, listing);
							return Promise.resolve(listing as unknown);
						},
						queryById: ({ id }: Record<string, unknown>) => {
							return (listings.get(String(id)) || null) as unknown;
						},
						queryAll: () => {
							return Array.from(listings.values()) as unknown[];
						},
						queryBySharer: async () => [] as unknown[],
						cancel: async () => ({} as unknown),
						update: async () => ({} as unknown),
						deleteListings: async () => true,
						unblock: async () => ({} as unknown),
						queryPaged: async () => ({
							items: Array.from(listings.values()),
							total: listings.size,
							page: 1,
							pageSize: 10,
						}),
					},
				},

				// Provide authenticated user (Alice) for tests
				get verifiedUser(): VerifiedUser | null {
					return {
						verifiedJwt: {
							email: aliceUser.email,
							given_name: aliceUser.firstName,
							family_name: aliceUser.lastName,
							sub: aliceUser.id,
						},
						openIdConfigKey: 'UserPortal',
						hints: undefined,
					};
				},
			};

			return Promise.resolve(services as unknown as ApplicationServices);
		},
	};
}
