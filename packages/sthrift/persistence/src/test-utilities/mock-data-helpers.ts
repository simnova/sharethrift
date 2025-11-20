import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';
import { vi } from 'vitest';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';

/**
 * Helper to create a valid 24-character hex string from a simple ID
 */
export function createValidObjectId(id: string): string {
	// Convert string to a hex representation and pad to 24 characters
	const hexChars = '0123456789abcdef';
	let hex = '';
	for (let i = 0; i < id.length && hex.length < 24; i++) {
		const charCode = id.charCodeAt(i);
		hex += hexChars[charCode % 16];
	}
	// Pad with zeros if needed
	return hex.padEnd(24, '0').substring(0, 24);
}

/**
 * Create a mock passport for testing
 */
export function makePassport(): Domain.Passport {
	return vi.mocked({
		conversation: {
			forConversation: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
		user: {
			forPersonalUser: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
		listing: {
			forItemListing: vi.fn(() => ({
				determineIf: () => true,
			})),
		},
	} as unknown as Domain.Passport);
}

/**
 * Create a mock user for testing
 */
export function makeMockUser(id: string): Models.User.PersonalUser {
	return {
		_id: new MongooseSeedwork.ObjectId(createValidObjectId(id)),
		id: id,
		userType: 'end-user',
		isBlocked: false,
		hasCompletedOnboarding: false,
		account: {
			accountType: 'standard',
			email: `${id}@example.com`,
			username: id,
			profile: {
				firstName: 'Test',
				lastName: 'User',
				aboutMe: 'Hello',
				location: {
					address1: '123 Main St',
					address2: null,
					city: 'Test City',
					state: 'TS',
					country: 'Testland',
					zipCode: '12345',
				},
				billing: {
					subscriptionId: null,
					cybersourceCustomerId: null,
					paymentState: '',
					lastTransactionId: null,
					lastPaymentAmount: null,
				},
			},
		},
		role: { id: 'role-1' },
		createdAt: new Date('2020-01-01'),
		updatedAt: new Date('2020-01-02'),
	} as unknown as Models.User.PersonalUser;
}

/**
 * Create a mock listing for testing
 */
export function makeMockListing(id: string): Models.Listing.ItemListing {
	return {
		_id: new MongooseSeedwork.ObjectId(createValidObjectId(id)),
		id: id,
		title: 'Test Listing',
		description: 'Test Description',
	} as unknown as Models.Listing.ItemListing;
}

/**
 * Create mock query that supports chaining and is thenable
 */
export const createMockQuery = (result: unknown) => {
	const mockQuery = {
		lean: vi.fn(),
		populate: vi.fn(),
		exec: vi.fn().mockResolvedValue(result),
		catch: vi.fn((onReject) => Promise.resolve(result).catch(onReject)),
	};
	// Configure methods to return the query object for chaining
	mockQuery.lean.mockReturnValue(mockQuery);
	mockQuery.populate.mockReturnValue(mockQuery);
	
	// Make the query thenable (like Mongoose queries are) by adding then as property
	Object.defineProperty(mockQuery, 'then', {
		value: vi.fn((onResolve) => Promise.resolve(result).then(onResolve)),
		enumerable: false,
	});
	return mockQuery;
};