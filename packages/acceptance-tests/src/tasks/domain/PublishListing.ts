import { CreateListing } from './CreateListing.js';

/**
 * PublishListing task at the DOMAIN level.
 *
 * Changes a draft listing to published status.
 */
export const PublishListing = {
	for: (listingTitle?: string) => {
		// Get the last created listing
		const listing = CreateListing.getLastListing();
		if (!listing) {
			throw new Error('No listing found to publish');
		}

		if (listingTitle && listing.details.title !== listingTitle) {
			throw new Error(`Listing with title "${listingTitle}" not found`);
		}

		// Update status to published
		listing.status = 'published';

		console.log(`[DOMAIN] Publishing listing: ${listing.details.title}`);
		return Promise.resolve();
	},
};