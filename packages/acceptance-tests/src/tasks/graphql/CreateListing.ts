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

/**
 * CreateListing task at the GRAPHQL level.
 *
 * Invokes the GraphQL API to create a listing.
 * Medium speed, tests API contracts.
 */
export const CreateListing = {
	with: (details: ListingDetails) => {
		// Validate required fields (same as domain)
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

		// TODO: Implement actual GraphQL mutation
		console.log(`[GRAPHQL] Creating listing: ${details.title}`);
		return Promise.resolve();
	},
};
