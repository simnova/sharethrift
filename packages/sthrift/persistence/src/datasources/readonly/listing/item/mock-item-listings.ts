import type { Domain } from '@sthrift/domain';

export const getMockItemListings =
	(): Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[] => {
		// Image URLs for UI assets (frontend will resolve these from public/assets/item-images/)
		const bikeImg = '/assets/item-images/bike.png';
		const projectorImg = '/assets/item-images/projector.png';
		const sewingMachineImg = '/assets/item-images/sewing-machine.png';

		// Create a simple mock user that satisfies the interface
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
				id: 'role-1',
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
					id: 'role-1',
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
                    aboutMe: 'Hello',
					location: {
						address1: '123 Main St',
						address2: null,
						city: 'Philadelphia',
						state: 'PA',
						country: 'US',
						zipCode: '19101',
					},
					billing: {
						// Minimal billing structure - just provide empty object for required properties
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

		const mockListings: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[] =
			[
				{
					id: '64f7a9c2d1e5b97f3c9d0a41',
					sharer: createMockUser(
						'507f1f77bcf86cd799439011',
						'patrick@example.com',
						'Patrick',
						'Garcia',
					),
					title: 'City Bike',
					description:
						'Perfect city bike for commuting and leisure rides around the neighborhood.',
					category: 'Vehicles',
					location: 'Philadelphia, PA',
					sharingPeriodStart: new Date('2024-08-11'),
					sharingPeriodEnd: new Date('2024-12-23'),
					state: 'Published',
					images: [bikeImg, bikeImg, bikeImg],
					createdAt: new Date('2024-08-01'),
					updatedAt: new Date('2024-08-01'),
					schemaVersion: '1',
					sharingHistory: [],
					reports: 0,
				},
				{
					id: '64f7a9c2d1e5b97f3c9d0a42',
					sharer: createMockUser(
						'507f1f77bcf86cd799439012',
						'samantha@example.com',
						'Samantha',
						'Rodriguez',
					),
					title: 'Cordless Drill',
					description:
						'Professional grade cordless drill with multiple attachments. Perfect for home improvement projects.',
					category: 'Tools & Equipment',
					location: 'Philadelphia, PA',
					sharingPeriodStart: new Date('2024-08-11'),
					sharingPeriodEnd: new Date('2024-12-23'),
					state: 'Published',
					images: [projectorImg, projectorImg, projectorImg],
					createdAt: new Date('2024-08-02'),
					updatedAt: new Date('2024-08-02'),
					schemaVersion: '1',
					sharingHistory: [],
					reports: 0,
				},
				{
					id: '64f7a9c2d1e5b97f3c9d0a43',
					sharer: createMockUser(
						'507f1f77bcf86cd799439013',
						'michael@example.com',
						'Michael',
						'Thompson',
					),
					title: 'Hand Mixer',
					description:
						'Electric hand mixer with multiple speed settings. Great for baking and cooking.',
					category: 'Home & Garden',
					location: 'Philadelphia, PA',
					sharingPeriodStart: new Date('2024-08-11'),
					sharingPeriodEnd: new Date('2024-12-23'),
					state: 'Published',
					images: [sewingMachineImg, sewingMachineImg, sewingMachineImg],
					createdAt: new Date('2024-08-03'),
					updatedAt: new Date('2024-08-03'),
					schemaVersion: '1',
					sharingHistory: [],
					reports: 0,
				},
			];

		return mockListings;
	};
