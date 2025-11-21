import type { PersonalUserEntityReference } from '../../../src/domain/contexts/user/personal-user/personal-user.entity';

/**
 * Standard test role permissions with all permissions enabled.
 * Used across acceptance tests to create consistent test fixtures.
 */
export const testUserRolePermissions = {
	listingPermissions: {
		canCreateItemListing: true,
		canUpdateItemListing: true,
		canDeleteItemListing: true,
		canViewItemListing: true,
		canPublishItemListing: true,
		canUnpublishItemListing: true,
		canReserveItemListing: true,
	},
	conversationPermissions: {
		canCreateConversation: true,
		canManageConversation: true,
		canViewConversation: true,
	},
	reservationRequestPermissions: {
		canCreateReservationRequest: true,
		canManageReservationRequest: true,
		canViewReservationRequest: true,
	},
};

/**
 * Standard test user role with all permissions enabled.
 * Used across acceptance tests to create consistent test fixtures.
 */
export const testUserRole = {
	id: 'test-role',
	roleName: 'standard',
	isDefault: true,
	roleType: 'personal-user-role',
	createdAt: new Date(),
	updatedAt: new Date(),
	schemaVersion: '1.0.0',
	permissions: testUserRolePermissions,
};

/**
 * Base PersonalUserEntityReference template with all standard fields.
 * Use `createTestUserRef(userId)` to create instances with specific IDs.
 */
export const baseUserRef = {
	userType: 'personal-user',
	isBlocked: false,
	schemaVersion: '1.0.0',
	hasCompletedOnboarding: true,
	role: testUserRole,
	loadRole: async () => testUserRole,
	account: {
		accountType: 'personal',
		email: 'test@example.com',
		username: 'testuser',
		profile: {
			firstName: 'Test',
			lastName: 'User',
			location: {
				address1: '123 Test St',
				address2: null,
				city: 'Test City',
				state: 'Test State',
				country: 'Test Country',
				zipCode: '12345',
			},
			billing: {
				subscriptionId: null,
				cybersourceCustomerId: null,
				paymentState: 'none',
				lastTransactionId: null,
				lastPaymentAmount: null,
			},
		},
	},
	createdAt: new Date(),
	updatedAt: new Date(),
};

/**
 * Creates a PersonalUserEntityReference with a specific user ID.
 * @param userId - The ID to assign to the user reference
 * @returns A complete PersonalUserEntityReference for testing
 */
export function createTestUserRef(userId: string): PersonalUserEntityReference {
	return { ...baseUserRef, id: userId } as PersonalUserEntityReference;
}
