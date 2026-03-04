/**
 * Test application services factory for in-memory test data storage.
 *
 * Provides mock application services that implement the real ApplicationServices interface:
 * - In-memory data storage (no database required)
 * - Guest user passport (no authentication required)
 * - Minimal infrastructure dependencies
 *
 * Perfect for testing GraphQL resolvers without needing a full database setup.
 */

import type {
	ApplicationServices,
	ApplicationServicesFactory,
	VerifiedUser,
} from '@sthrift/application-services';

// In-memory test listing representation
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

export function createTestApplicationServicesFactory(): ApplicationServicesFactory {
	// In-memory storage for test data
	const listings = new Map<string, TestListing>();

	// Helper to generate valid MongoDB ObjectID-like strings
	function generateObjectId(): string {
		const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
		const random = Math.random().toString(16).substring(2, 18).padStart(16, '0');
		return (timestamp + random).substring(0, 24);
	}

	// Create test user (Alice)
	const aliceUser = {
		id: 'user-alice-123',
		email: 'alice@test.com',
		firstName: 'Alice',
		lastName: 'Test',
	};

	return {
		forRequest: (): Promise<ApplicationServices> => {
			// Create mock application services implementing ApplicationServices interface
			const services = {
				// User service with test user
				User: {
					PersonalUser: {
						createIfNotExists: async () => ({ id: aliceUser.id } as unknown),
						queryById: async () => ({ id: aliceUser.id } as unknown),
						update: async () => ({ id: aliceUser.id } as unknown),
						queryByEmail: async () => ({ id: aliceUser.id } as unknown),
						getAllUsers: async () => ({
							users: [{ id: aliceUser.id }],
							total: 1,
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
						queryById: async () => null,
					},
				},

				Conversation: {} as unknown,
				AccountPlan: {} as unknown,
				AppealRequest: {} as unknown,
				ReservationRequest: {} as unknown,

				// Listing service with in-memory storage
				Listing: {
					ItemListing: {
						create: (input: Record<string, unknown>) => {
							const id = generateObjectId();
							const state: 'draft' | 'published' = input['isDraft'] ? 'draft' : 'published';
							const listing: TestListing = {
								id,
								title: String(input['title']),
								description: String(input['description']),
								category: String(input['category']),
								location: String(input['location']),
								state,
								sharingPeriodStart: input['sharingPeriodStart'] as Date,
								sharingPeriodEnd: input['sharingPeriodEnd'] as Date,
								images: (input['images'] as unknown[]) || [],
							};

							// Validation (matches domain rules)
							if (!input['title']) {
								throw new Error('Field "title" is required');
							}
							const titleStr = String(input['title']);
							if (titleStr.length < 5) {
								throw new Error('Title must be at least 5 characters');
							}
							if (titleStr.length > 100) {
								throw new Error('Title must not exceed 100 characters');
							}

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
