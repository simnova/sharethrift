/**
 * Data Seeding Service for Mock MongoDB Memory Server
 *
 * This module provides functionality to seed mock data into the MongoDB memory server
 * for development and testing purposes. It ensures all mock data is connected and
 * consistent across the application.
 */

import { MongoClient, ObjectId } from 'mongodb';

export interface MockUser {
	_id: ObjectId;
	userType: 'personal';
	isBlocked: boolean;
	schemaVersion: string;
	hasCompletedOnboarding: boolean;
	role: {
		id: string;
		permissions: {
			listingPermissions: {
				canCreateItemListing: boolean;
				canUpdateItemListing: boolean;
				canDeleteItemListing: boolean;
				canViewItemListing: boolean;
				canPublishItemListing: boolean;
				canUnpublishItemListing: boolean;
			};
			conversationPermissions: {
				canCreateConversation: boolean;
				canManageConversation: boolean;
				canViewConversation: boolean;
			};
			reservationRequestPermissions: {
				canCreateReservationRequest: boolean;
				canManageReservationRequest: boolean;
				canViewReservationRequest: boolean;
			};
		};
		createdAt: Date;
		updatedAt: Date;
		schemaVersion: string;
		roleName: string;
		roleType: string;
		isDefault: boolean;
	};
	account: {
		accountType: 'email';
		email: string;
		username: string;
		profile: {
			firstName: string;
			lastName: string;
			location: {
				address1: string;
				address2: string | null;
				city: string;
				state: string;
				country: string;
				zipCode: string;
			};
			billing: {
				subscriptionId: string;
				cybersourceCustomerId: string;
				paymentState: string;
				lastTransactionId: string;
				lastPaymentAmount: number;
			};
		};
	};
	createdAt: Date;
	updatedAt: Date;
}

export interface MockItemListing {
	_id: ObjectId;
	sharer: ObjectId; // Reference to user _id
	title: string;
	description: string;
	category: string;
	location: string;
	sharingPeriodStart: Date;
	sharingPeriodEnd: Date;
	state: string;
	images: string[];
	createdAt: Date;
	updatedAt: Date;
	schemaVersion: string;
	sharingHistory: unknown[];
	reports: number;
}

/**
 * Creates mock users with consistent data structure
 */
export function createMockUsers(): MockUser[] {
	return [
		{
			_id: new ObjectId('507f1f77bcf86cd799439011'),
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
			account: {
				accountType: 'email',
				email: 'patrick@example.com',
				username: 'patrick_garcia',
				profile: {
					firstName: 'Patrick',
					lastName: 'Garcia',
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
		},
		{
			_id: new ObjectId('507f1f77bcf86cd799439012'),
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
			account: {
				accountType: 'email',
				email: 'samantha@example.com',
				username: 'samantha_rodriguez',
				profile: {
					firstName: 'Samantha',
					lastName: 'Rodriguez',
					location: {
						address1: '456 Oak Ave',
						address2: null,
						city: 'Seattle',
						state: 'WA',
						country: 'US',
						zipCode: '98101',
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
		},
		{
			_id: new ObjectId('507f1f77bcf86cd799439013'),
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
			account: {
				accountType: 'email',
				email: 'michael@example.com',
				username: 'michael_thompson',
				profile: {
					firstName: 'Michael',
					lastName: 'Thompson',
					location: {
						address1: '789 Pine St',
						address2: null,
						city: 'Portland',
						state: 'OR',
						country: 'US',
						zipCode: '97201',
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
		},
		{
			_id: new ObjectId('507f1f77bcf86cd799439014'),
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
			account: {
				accountType: 'email',
				email: 'jane@example.com',
				username: 'jane_smith',
				profile: {
					firstName: 'Jane',
					lastName: 'Smith',
					location: {
						address1: '321 Elm St',
						address2: null,
						city: 'Vancouver',
						state: 'BC',
						country: 'CA',
						zipCode: 'V6B 1A1',
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
		},
		{
			_id: new ObjectId('507f1f77bcf86cd799439015'),
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
			account: {
				accountType: 'email',
				email: 'bob@example.com',
				username: 'bob_johnson',
				profile: {
					firstName: 'Bob',
					lastName: 'Johnson',
					location: {
						address1: '654 Maple Dr',
						address2: null,
						city: 'Vancouver',
						state: 'BC',
						country: 'CA',
						zipCode: 'V6B 1A1',
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
		},
	];
}

/**
 * Creates mock item listings with connected user references
 */
export function createMockItemListings(): MockItemListing[] {
	const bikeImg = '/assets/item-images/bike.png';
	const projectorImg = '/assets/item-images/projector.png';
	const sewingMachineImg = '/assets/item-images/sewing-machine.png';
	const macbookImg = '/assets/item-images/macbook.png';
	const toolsImg = '/assets/item-images/tools.png';

	return [
		{
			_id: new ObjectId('64f7a9c2d1e5b97f3c9d0a41'),
			sharer: new ObjectId('507f1f77bcf86cd799439011'), // Patrick Garcia
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
			_id: new ObjectId('64f7a9c2d1e5b97f3c9d0a42'),
			sharer: new ObjectId('507f1f77bcf86cd799439012'), // Samantha Rodriguez
			title: 'Cordless Drill',
			description:
				'Professional grade cordless drill with multiple attachments. Perfect for home improvement projects.',
			category: 'Tools & Equipment',
			location: 'Seattle, WA',
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
			_id: new ObjectId('64f7a9c2d1e5b97f3c9d0a43'),
			sharer: new ObjectId('507f1f77bcf86cd799439013'), // Michael Thompson
			title: 'Hand Mixer',
			description:
				'Electric hand mixer with multiple speed settings. Great for baking and cooking.',
			category: 'Home & Garden',
			location: 'Portland, OR',
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
		{
			_id: new ObjectId('64f7a9c2d1e5b97f3c9d0a44'),
			sharer: new ObjectId('507f1f77bcf86cd799439014'), // Jane Smith
			title: 'MacBook Pro 13-inch',
			description:
				'MacBook Pro with M1 chip, 16GB RAM, 512GB SSD. Perfect for professional work.',
			category: 'Electronics',
			location: 'Vancouver, BC',
			sharingPeriodStart: new Date('2024-01-15'),
			sharingPeriodEnd: new Date('2024-06-15'),
			state: 'Published',
			images: [macbookImg],
			createdAt: new Date('2024-01-15'),
			updatedAt: new Date('2024-01-15'),
			schemaVersion: '1',
			sharingHistory: [],
			reports: 0,
		},
		{
			_id: new ObjectId('64f7a9c2d1e5b97f3c9d0a45'),
			sharer: new ObjectId('507f1f77bcf86cd799439015'), // Bob Johnson
			title: 'Garden Tools Set',
			description:
				'Complete set of garden tools including shovel, rake, and pruning shears. Great for gardening projects.',
			category: 'Tools & Equipment',
			location: 'Vancouver, BC',
			sharingPeriodStart: new Date('2024-02-01'),
			sharingPeriodEnd: new Date('2024-10-31'),
			state: 'Published',
			images: [toolsImg, toolsImg],
			createdAt: new Date('2024-02-01'),
			updatedAt: new Date('2024-02-01'),
			schemaVersion: '1',
			sharingHistory: [],
			reports: 0,
		},
		{
			_id: new ObjectId('64f7a9c2d1e5b97f3c9d0a46'),
			sharer: new ObjectId('507f1f77bcf86cd799439011'), // Patrick Garcia (additional item)
			title: 'Vintage Leather Jacket',
			description:
				'Beautiful brown leather jacket from the 1980s, excellent condition. Perfect for vintage fashion lovers.',
			category: 'Clothing',
			location: 'Philadelphia, PA',
			sharingPeriodStart: new Date('2024-01-01'),
			sharingPeriodEnd: new Date('2024-12-31'),
			state: 'Published',
			images: [bikeImg], // Using bike img as placeholder
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01'),
			schemaVersion: '1',
			sharingHistory: [],
			reports: 0,
		},
	];
}

/**
 * Seeds the database with mock data
 */
export async function seedMockData(
	connectionUri: string,
	dbName: string,
): Promise<void> {
	console.log('Starting mock data seeding...');

	const client = new MongoClient(connectionUri);

	try {
		await client.connect();
		console.log('Connected to MongoDB');

		const db = client.db(dbName);

		// Clear existing collections
		console.log('Clearing existing collections...');
		await db.collection('users').deleteMany({});
		await db.collection('itemlistings').deleteMany({});

		// Seed users
		console.log('Seeding users...');
		const users = createMockUsers();
		if (users.length > 0) {
			await db.collection('users').insertMany(users);
			console.log(`✓ Seeded ${users.length} users`);
		}

		// Seed item listings
		console.log('Seeding item listings...');
		const itemListings = createMockItemListings();
		if (itemListings.length > 0) {
			await db.collection('itemlistings').insertMany(itemListings);
			console.log(`✓ Seeded ${itemListings.length} item listings`);
		}

		// Create indexes for better performance
		console.log('Creating indexes...');
		await db
			.collection('itemlistings')
			.createIndex({ title: 'text', description: 'text', location: 'text' });
		await db.collection('itemlistings').createIndex({ category: 1 });
		await db.collection('itemlistings').createIndex({ location: 1 });
		await db.collection('itemlistings').createIndex({ state: 1 });
		await db.collection('itemlistings').createIndex({ sharer: 1 });
		await db
			.collection('users')
			.createIndex({ 'account.email': 1 }, { unique: true });
		await db
			.collection('users')
			.createIndex({ 'account.username': 1 }, { unique: true });

		console.log('✓ Mock data seeding completed successfully!');
		console.log(`Database: ${dbName}`);
		console.log(
			`Collections: users (${users.length}), itemlistings (${itemListings.length})`,
		);
	} catch (error) {
		console.error('Error seeding mock data:', error);
		throw error;
	} finally {
		await client.close();
	}
}
