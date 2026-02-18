export interface ListingDetails {
	title: string;
	description: string;
	category: string;
	location: string;
	dailyRate?: string;
	weeklyRate?: string;
	deposit?: string;
	tags?: string;
}

// In-memory storage for created listings (for testing)
const listings = new Map<string, { details: ListingDetails; status: 'draft' | 'published' }>();
let listingCounter = 0;

/**
 * CreateListing task at the DOMAIN level.
 *
 * Directly invokes domain methods.
 * Fast execution, no I/O, perfect for TDD.
 */
export const CreateListing = {
	with: (details: ListingDetails) => {
		// Validate required fields
		if (!details.title) {
			throw new Error('Validation error: title is required');
		}
		if (details.title.length < 5) {
			throw new Error('Validation error: Title must be at least 5 characters');
		}
		if (details.title.length > 100) {
			throw new Error('Validation error: Title must be at most 100 characters');
		}
		if (!details.description) {
			throw new Error('Validation error: description is required');
		}
		if (!details.category) {
			throw new Error('Validation error: category is required');
		}
		if (!details.location) {
			throw new Error('Validation error: location is required');
		}

		// Create listing with draft status
		const listingId = `listing-${++listingCounter}`;
		listings.set(listingId, {
			details,
			status: 'draft',
		});

		console.log(`[DOMAIN] Creating listing: ${details.title}`);
		return Promise.resolve(listingId);
	},
	getLastListing: () => {
		const lastId = `listing-${listingCounter}`;
		return listings.get(lastId);
	},
	clearAll: () => {
		listings.clear();
		listingCounter = 0;
	},
};
