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
	// Create a promise-based mock that mimics Mongoose query behavior
	const promise = Promise.resolve(result);
	
	// Create chainable mock methods
	const lean = vi.fn();
	const populate = vi.fn();
	const exec = vi.fn().mockResolvedValue(result);
	const catchFn = vi.fn((onReject) => promise.catch(onReject));
	
	// Create thenable mock that implements the Promise interface
	const thenableMock = Object.assign(promise, {
		lean,
		populate,
		exec,
		catch: catchFn,
	});
	
	// Configure methods to return the mock object for chaining
	lean.mockReturnValue(thenableMock);
	populate.mockReturnValue(thenableMock);
	
	return thenableMock;
};