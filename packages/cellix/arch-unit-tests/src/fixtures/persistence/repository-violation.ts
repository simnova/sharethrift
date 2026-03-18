/**
 * This file intentionally violates persistence repository conventions.
 */

// VIOLATION: Not extending MongoRepositoryBase
export class UserRepository {
	async findById(id: string) {
		return { id, name: 'User' };
	}
}

// VIOLATION: Missing domain repository interface implementation
export class ListingRepository {
	constructor(private collection: any) {}

	async create(listing: unknown) {
		return { id: '123' };
	}
}
