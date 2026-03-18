// @ts-nocheck
/**
 * This file intentionally violates persistence repository conventions.
 */

// VIOLATION: Not extending MongoRepositoryBase
export class UserRepository {
	// biome-ignore lint/suspicious/useAwait: intentional violation for testing
	async findById(id: string) {
		return { id, name: 'User' };
	}
}

// VIOLATION: Missing domain repository interface implementation
export class ListingRepository {
	// biome-ignore lint/suspicious/noExplicitAny: intentional violation for testing
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: intentional violation for testing
	constructor(private collection: any) {}

	// biome-ignore lint/suspicious/useAwait: intentional violation for testing
	// biome-ignore lint/correctness/noUnusedFunctionParameters: intentional violation for testing
	async create(listing: unknown) {
		return { id: '123' };
	}
}
