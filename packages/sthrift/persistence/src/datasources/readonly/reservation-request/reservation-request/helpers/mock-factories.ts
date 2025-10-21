import type { Domain } from '@sthrift/domain';

const defaultPermissions = {
	listingPermissions: {
		canCreateItemListing: true,
		canUpdateItemListing: true,
		canDeleteItemListing: true,
		canViewItemListing: true,
		canPublishItemListing: true,
		canUnpublishItemListing: true,
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

const defaultRole: Domain.Contexts.PersonalUser.Role.RoleEntityReference = {
	id: 'role-id',
	roleName: 'user',
	isDefault: true,
	roleType: 'personal',
	createdAt: new Date('2024-01-01T09:00:00Z'),
	updatedAt: new Date('2024-01-13T09:00:00Z'),
	schemaVersion: '1',
	permissions: defaultPermissions,
};

export function createRole(
	overrides: Partial<Domain.Contexts.PersonalUser.Role.RoleEntityReference> = {},
) {
	return { ...defaultRole, ...overrides };
}

export function createUser({
	id,
	email,
	username,
	firstName = 'Jane',
	lastName = 'User',
}: {
	id: string;
	email: string;
	username: string;
	firstName?: string;
	lastName?: string;
}): Domain.Contexts.PersonalUser.PersonalUser.PersonalUserEntityReference {
	const role = createRole();
	return {
		id,
		userType: 'personal',
		isBlocked: false,
		account: {
			accountType: 'personal',
			email,
			username,
			profile: {
				firstName,
				lastName,
				location: {
					address1: '123 Main St',
					address2: null,
					city: 'Boston',
					state: 'MA',
					country: 'USA',
					zipCode: '02101',
				},
				billing: {
					subscriptionId: '98765789',
					cybersourceCustomerId: '87654345678',
					paymentState: 'active',
					lastTransactionId: 'txn-123456',
					lastPaymentAmount: 100.0,
				},
			},
		},
		schemaVersion: '1',
		createdAt: new Date('2024-01-01T09:00:00Z'),
		updatedAt: new Date('2024-01-13T09:00:00Z'),
		hasCompletedOnboarding: true,
		role,
		loadRole: () => Promise.resolve(role),
	};
}

export function createListing(
	overrides: Partial<Domain.Contexts.ItemListing.ItemListing.ItemListingEntityReference> = {},
) {
	return {
		id: '60ddc9732f8fb814c89b6789',
		title: 'Professional Microphone',
		description: 'A high-quality microphone for professional use.',
		category: 'Electronics',
		location: 'New York, NY',
		sharingPeriodStart: new Date('2024-09-05T10:00:00Z'),
		sharingPeriodEnd: new Date('2024-09-15T10:00:00Z'),
		state: 'Published',
		schemaVersion: '1',
		createdAt: new Date('2024-01-05T09:00:00Z'),
		updatedAt: new Date('2024-01-13T09:00:00Z'),
		sharer: createUser({
			id: '5f8d0d55b54764421b7156c5',
			email: 'sharer2@example.com',
			username: 'shareruser2',
			firstName: 'Jane',
			lastName: 'Sharer',
		}),
		loadRole: () => Promise.resolve(createRole()),
		...overrides,
	};
}
