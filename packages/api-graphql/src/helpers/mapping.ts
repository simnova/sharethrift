import type { Domain } from '@sthrift/api-domain';

function mapState(state?: string) {
	return state === 'Appeal Requested' ? 'Appeal_Requested' : state;
}

export function toGraphItem(
	listing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
) {
	return {
		sharer: listing.sharer.id,
		title: listing.title,
		description: listing.description,
		category: listing.category,
		location: listing.location,
		sharingPeriodStart: listing.sharingPeriodStart.toISOString(),
		sharingPeriodEnd: listing.sharingPeriodEnd.toISOString(),
		state: mapState(listing.state),
		sharingHistory: listing.sharingHistory ?? [],
		reports: listing.reports ?? 0,
		images: listing.images ?? [],
		id: listing.id,
		schemaVersion: listing.schemaVersion,
		createdAt: listing.createdAt.toISOString(),
		updatedAt: listing.updatedAt.toISOString(),
		version: 1,
	};
}
