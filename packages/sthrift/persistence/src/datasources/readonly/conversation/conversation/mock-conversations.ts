import type { Domain } from '@sthrift/domain';

export const getMockConversations =
	(): Domain.Contexts.Conversation.Conversation.ConversationEntityReference[] => {
		// Create mock users that satisfy the interface
		const createMockUser = (
			id: string,
			email: string,
			firstName: string,
			lastName: string,
		): Domain.Contexts.User.PersonalUser.PersonalUserEntityReference => ({
			id,
			userType: 'personal',
			isBlocked: false,
			schemaVersion: '1',
			hasCompletedOnboarding: true,

			role: {
				id: '68d54f9814ce3fa5e1c5b283',
				permissions: {
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
				},
				createdAt: new Date('2024-01-01'),
				updatedAt: new Date('2024-01-01'),
				schemaVersion: '1',
				roleName: 'User',
				roleType: 'user',
				isDefault: true,
			},
			loadRole: () =>
				Promise.resolve({
					id: '68d54fafd74f56963e5991f2',
					permissions: {
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
					},
					createdAt: new Date('2024-01-01'),
					updatedAt: new Date('2024-01-01'),
					schemaVersion: '1',
					roleName: 'User',
					roleType: 'user',
					isDefault: true,
				}),
			account: {
				accountType: 'email',
				email,
				username: `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
				profile: {
					firstName,
					lastName,
					location: {
						address1: '123 Main St',
						address2: null,
						city: 'Philadelphia',
						state: 'PA',
						country: 'US',
						zipCode: '19101',
					},
					billing: {
						subscriptionId: '',
						cybersourceCustomerId: '',
						paymentState: '',
						lastTransactionId: '',
						lastPaymentAmount: 0,
					},
				},
			},
			createdAt: new Date('2024-08-01'),
			updatedAt: new Date('2024-08-01'),
		});

		// Create mock listing
		const createMockListing = (
			id: string,
			title: string,
			sharer: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
		): Domain.Contexts.Listing.ItemListing.ItemListingEntityReference => ({
			id,
			sharer,
			title,
			description: `Mock description for ${title}`,
			category: 'Electronics',
			location: 'Philadelphia, PA',
			sharingPeriodStart: new Date('2024-08-11'),
			sharingPeriodEnd: new Date('2024-12-23'),
			state: 'Published',
			images: ['/assets/item-images/bike.png'],
			createdAt: new Date('2024-08-01'),
			updatedAt: new Date('2024-08-01'),
			schemaVersion: '1',
			sharingHistory: [],
			reports: 0,
		});

		// Create mock users
		const alice = createMockUser(
			'507f1f77bcf86cd799439011',
			'alice@example.com',
			'Alice',
			'Johnson',
		);
		const bob = createMockUser(
			'507f1f77bcf86cd799439012',
			'bob@example.com',
			'Bob',
			'Smith',
		);
		const carol = createMockUser(
			'507f1f77bcf86cd799439013',
			'carol@example.com',
			'Carol',
			'Davis',
		);
		const currentUser = createMockUser(
			'507f1f77bcf86cd799439099',
			'user123@example.com',
			'Current',
			'User',
		);

		// Create mock listings
		const bikeListing = createMockListing('64f7a9c2d1e5b97f3c9d0a41', 'City Bike', alice);
		const cameraListing = createMockListing('64f7a9c2d1e5b97f3c9d0a42', 'Camera', bob);
		const tentListing = createMockListing('64f7a9c2d1e5b97f3c9d0a43', 'Camping Tent', carol);

		const mockConversations: Domain.Contexts.Conversation.Conversation.ConversationEntityReference[] =
			[
				{
					id: '64f7a9c2d1e5b97f3c9d0c01',
					sharer: alice,
					reserver: currentUser,
					listing: bikeListing,
					twilioConversationId: 'CH123',
					createdAt: new Date('2025-08-08T10:00:00Z'),
					updatedAt: new Date('2025-08-08T12:00:00Z'),
					schemaVersion: '1',
					loadSharer: () => Promise.resolve(alice),
					loadReserver: () => Promise.resolve(currentUser),
					loadListing: () => Promise.resolve(bikeListing),
				},
				{
					id: '64f7a9c2d1e5b97f3c9d0c02',
					sharer: bob,
					reserver: currentUser,
					listing: cameraListing,
					twilioConversationId: 'CH124',
					createdAt: new Date('2025-08-07T09:00:00Z'),
					updatedAt: new Date('2025-08-08T11:30:00Z'),
					schemaVersion: '1',
					loadSharer: () => Promise.resolve(bob),
					loadReserver: () => Promise.resolve(currentUser),
					loadListing: () => Promise.resolve(cameraListing),
				},
				{
					id: '64f7a9c2d1e5b97f3c9d0c03',
					sharer: carol,
					reserver: currentUser,
					listing: tentListing,
					twilioConversationId: 'CH125',
					createdAt: new Date('2025-08-06T08:00:00Z'),
					updatedAt: new Date('2025-08-08T10:45:00Z'),
					schemaVersion: '1',
					loadSharer: () => Promise.resolve(carol),
					loadReserver: () => Promise.resolve(currentUser),
					loadListing: () => Promise.resolve(tentListing),
				},
			];

		return mockConversations;
	};