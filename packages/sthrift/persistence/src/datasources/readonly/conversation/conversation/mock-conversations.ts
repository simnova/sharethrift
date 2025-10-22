import type { Domain } from '@sthrift/domain';
import { ObjectId } from 'bson';

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
					messages: [
                        {
                            id: '64f7a9c2d1e5b97f3c9d0c09',
                            twilioMessageSid: '64f7a9c2d1e5b97f3c9d0c02',
                            authorId: new ObjectId(alice.id),
                            content: 'Hello, is the bike still available?',
                            createdAt: new Date('2025-08-08T10:05:00Z'),
                        },
                        {
                            id: '64f7a9c2d1e5b97f3c9d0c10',
                            twilioMessageSid: '64f7a9c2d1e5b97f3c9d0c03',
                            authorId: new ObjectId(currentUser.id),
                            content: 'Yes, it is! When would you like to pick it up?',
                            createdAt: new Date('2025-08-08T11:00:00Z'),
                        },
                        {
                            id: '64f7a9c2d1e5b97f3c9d0c11',
                            twilioMessageSid: '64f7a9c2d1e5b97f3c9d0c04',
                            authorId: new ObjectId(alice.id),
                            content: 'I can come by this Saturday morning.',
                            createdAt: new Date('2025-08-08T11:30:00Z'),
                        }
                    ],
					createdAt: new Date('2025-08-08T10:00:00Z'),
					updatedAt: new Date('2025-08-08T12:00:00Z'),
					schemaVersion: '1',
					loadSharer: () => Promise.resolve(alice),
					loadReserver: () => Promise.resolve(currentUser),
					loadListing: () => Promise.resolve(bikeListing),
					loadMessages: () => Promise.resolve([
                        {
                            id: '64f7a9c2d1e5b97f3c9d0c09',
                            twilioMessageSid: '64f7a9c2d1e5b97f3c9d0c02',
                            authorId: new ObjectId(alice.id),
                            content: 'Hello, is the bike still available?',
                            createdAt: new Date('2025-08-08T10:05:00Z'),
                        },
                        {
                            id: '64f7a9c2d1e5b97f3c9d0c10',
                            twilioMessageSid: '64f7a9c2d1e5b97f3c9d0c03',
                            authorId: new ObjectId(currentUser.id),
                            content: 'Yes, it is! When would you like to pick it up?',
                            createdAt: new Date('2025-08-08T11:00:00Z'),
                        },
                        {
                            id: '64f7a9c2d1e5b97f3c9d0c11',
                            twilioMessageSid: '64f7a9c2d1e5b97f3c9d0c04',
                            authorId: new ObjectId(alice.id),
                            content: 'I can come by this Saturday morning.',
                            createdAt: new Date('2025-08-08T11:30:00Z'),
                        }
                    ]),
				},
				{
					id: '64f7a9c2d1e5b97f3c9d0c02',
					sharer: bob,
					reserver: currentUser,
					listing: cameraListing,
					twilioConversationId: 'CH124',
					messages: [
						{ id: '64f7a9c2d1e5b97f3c9d0c00',
							twilioMessageSid: '64f7a9c2d1e5b97f3c9d0c00',
							authorId: new ObjectId(currentUser.id),
							content: 'Hi! I\'m interested in borrowing your camera. When is it available?',
							createdAt: new Date('2025-08-07T09:15:00Z'),
						},
						{
							id: '64f7a9c2d1e5b97f3c9d0c01',
							twilioMessageSid: '64f7a9c2d1e5b97f3c9d0c01',
							authorId: new ObjectId(bob.id),
							content: 'Hi! Yes, it\'s available from tomorrow onwards. What do you plan to use it for?',
							createdAt: new Date('2025-08-07T10:00:00Z'),
						},
					],
					createdAt: new Date('2025-08-07T09:00:00Z'),
					updatedAt: new Date('2025-08-08T11:30:00Z'),
					schemaVersion: '1',
					loadSharer: () => Promise.resolve(bob),
					loadReserver: () => Promise.resolve(currentUser),
					loadListing: () => Promise.resolve(cameraListing),
					loadMessages: () => Promise.resolve([
						{
							id: '64f7a9c2d1e5b97f3c9d0c00',
							twilioMessageSid: 'SM124',
							authorId: new ObjectId(currentUser.id),
							content: 'Hi! I\'m interested in borrowing your camera. When is it available?',
							createdAt: new Date('2025-08-07T09:15:00Z'),
						},
						{
							id: '64f7a9c2d1e5b97f3c9d0c00',
							twilioMessageSid: 'SM125',
							authorId: new ObjectId(bob.id),
							content: 'Hi! Yes, it\'s available from tomorrow onwards. What do you plan to use it for?',
							createdAt: new Date('2025-08-07T10:00:00Z'),
						},
					]),
				},
				{
					id: '64f7a9c2d1e5b97f3c9d0c03',
					sharer: carol,
					reserver: currentUser,
					listing: tentListing,
					twilioConversationId: 'CH125',
					messages: [
						{
							id: '64f7a9c2d1e5b97f3c9d0c03',
							twilioMessageSid: '64f7a9c2d1e5b97f3c9d0c03',
							authorId: new ObjectId(currentUser.id),
							content: 'Hello! I need a tent for a weekend camping trip. Is yours still available?',
							createdAt: new Date('2025-08-06T08:30:00Z'),
						},
						{
							id: '64f7a9c2d1e5b97f3c9d0c04',
							twilioMessageSid: '64f7a9c2d1e5b97f3c9d0c04',
							authorId: new ObjectId(carol.id),
							content: 'Hi! Yes, it\'s available. It\'s a 4-person tent, perfect for camping!',
							createdAt: new Date('2025-08-06T09:15:00Z'),
						},
						{
							id: '64f7a9c2d1e5b97f3c9d0c05',
							twilioMessageSid: '64f7a9c2d1e5b97f3c9d0c05',
							authorId: new ObjectId(currentUser.id),
							content: 'Perfect! When can I pick it up?',
							createdAt: new Date('2025-08-06T09:45:00Z'),
						},
					],
					createdAt: new Date('2025-08-06T08:00:00Z'),
					updatedAt: new Date('2025-08-08T10:45:00Z'),
					schemaVersion: '1',
					loadSharer: () => Promise.resolve(carol),
					loadReserver: () => Promise.resolve(currentUser),
					loadListing: () => Promise.resolve(tentListing),
					loadMessages: () => Promise.resolve([
						{
							id: '64f7a9c2d1e5b97f3c9d0c00',
							twilioMessageSid: 'SM126',
							authorId: new ObjectId(currentUser.id),
							content: 'Hello! I need a tent for a weekend camping trip. Is yours still available?',
							createdAt: new Date('2025-08-06T08:30:00Z'),
						},
						{
							id: '64f7a9c2d1e5b97f3c9d0c00',
							twilioMessageSid: 'SM127',
							authorId: new ObjectId(carol.id),
							content: 'Hi! Yes, it\'s available. It\'s a 4-person tent, perfect for camping!',
							createdAt: new Date('2025-08-06T09:15:00Z'),
						},
						{
							id: '64f7a9c2d1e5b97f3c9d0c00',
							twilioMessageSid: 'SM128',
							authorId: new ObjectId(currentUser.id),
							content: 'Perfect! When can I pick it up?',
							createdAt: new Date('2025-08-06T09:45:00Z'),
						},
					]),
				},
			];

		return mockConversations;
	};