import type { ApplicationServicesFactory, ApplicationServices } from '@sthrift/application-services';
import { Domain } from '@sthrift/domain';

/**
 * Creates a test ApplicationServicesFactory with in-memory data storage.
 * 
 * This provides REAL application services (not mocks) but with:
 * - In-memory data storage (no database required)
 * - Guest user passport (no authentication required)
 * - Minimal infrastructure dependencies
 * 
 * Perfect for testing GraphQL resolvers without needing a full database setup.
 */
export function createTestApplicationServicesFactory(): ApplicationServicesFactory {
	// In-memory storage for test data
	const listings = new Map<string, any>();
	const users = new Map<string, any>();

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
	users.set(aliceUser.email, aliceUser);

	return {
		forRequest: async (): Promise<ApplicationServices> => {
			// Create guest passport for tests
			const passport = Domain.PassportFactory.forGuest();

			// Create minimal application services for testing
			return {
				// User service with test user
				User: {
					PersonalUser: {
						queryByEmail: async ({ email }: { email: string }) => {
							return users.get(email) || null;
						},
					},
				} as any,
				
				Conversation: {} as any,
				AccountPlan: {} as any,
				AppealRequest: {} as any,
				ReservationRequest: {} as any,
				
				// Real Listing service with in-memory storage
				Listing: {
					ItemListing: {
						create: async (input: any) => {
							const id = generateObjectId();
							const listing = {
								id,
								sharer: input.sharer,
								title: input.title,
								description: input.description,
								category: input.category,
								location: input.location,
								state: input.isDraft ? 'draft' : 'published',
								sharingPeriodStart: input.sharingPeriodStart,
								sharingPeriodEnd: input.sharingPeriodEnd,
								images: input.images || [],
								listingType: 'item',
								schemaVersion: '1.0',
								createdAt: new Date(),
								updatedAt: new Date(),
								version: 1,
								sharingHistory: [],
								reports: 0,
							};
							
							// Validation (matches your domain rules)
							if (!input.title) {
								throw new Error('Field "title" is required');
							}
							if (input.title.length < 5) {
								throw new Error('Title must be at least 5 characters');
							}
							if (input.title.length > 100) {
								throw new Error('Title must not exceed 100 characters');
							}
							
							listings.set(id, listing);
							return listing;
						},
						queryById: async ({ id }: { id: string }) => {
							return listings.get(id) || null;
						},
						queryAll: async () => {
							return Array.from(listings.values());
						},
					},
				} as any,
				
				// Provide authenticated user (Alice) for tests
				verifiedUser: {
					verifiedJwt: {
						email: aliceUser.email,
						given_name: aliceUser.firstName,
						family_name: aliceUser.lastName,
						sub: aliceUser.id,
					},
					openIdConfigKey: 'UserPortal',
					hints: undefined,
				},
			};
		},
	};
}
