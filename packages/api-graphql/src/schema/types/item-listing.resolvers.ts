// biome-ignore assist/source/organizeImports: <explanation>
import { DUMMY_LISTINGS } from './mock-listings.js';
import type { ItemListing } from './mock-listings.js';
import type { Resolvers, ItemListingState } from '../builder/generated.ts';

function mapState(state?: string): ItemListingState {
	return state === 'Appeal Requested'
		? 'Appeal_Requested'
		: (state as ItemListingState);
}

const itemListingResolvers: Resolvers = {
	Query: {
		itemListings: (_parent, _args, _context, _info) => {
			console.log(_info);
			return DUMMY_LISTINGS.map((listing: ItemListing) => ({
				sharer: listing.sharer,
				title: listing.title,
				description: listing.description,
				category: listing.category,
				location: listing.location,
				sharingPeriodStart: listing.sharingPeriodStart.toISOString(),
				sharingPeriodEnd: listing.sharingPeriodEnd.toISOString(),
				state: mapState(listing.state),
				sharingHistory: listing.sharingHistory || [],
				reports: listing.reports || 0,
				images: listing.images || [],
				id: listing._id,
				schemaVersion: '1',
				createdAt: listing.createdAt?.toISOString(),
				updatedAt: listing.updatedAt?.toISOString(),
				version: 1,
			}));
		},
		itemListing: (_parent: unknown, args: { id: string }) => {
			const listing = DUMMY_LISTINGS.find(
				(l: ItemListing) => l._id === args.id,
			);
			if (!listing) {
				return null;
			}
			return {
				sharer: listing.sharer,
				title: listing.title,
				description: listing.description,
				category: listing.category,
				location: listing.location,
				sharingPeriodStart: listing.sharingPeriodStart.toISOString(),
				sharingPeriodEnd: listing.sharingPeriodEnd.toISOString(),
				state: mapState(listing.state),
				sharingHistory: listing.sharingHistory || [],
				reports: listing.reports || 0,
				images: listing.images || [],
				id: listing._id,
				schemaVersion: '1',
				createdAt: listing.createdAt?.toISOString(),
				updatedAt: listing.updatedAt?.toISOString(),
				version: 1,
			};
		},
	},
};

export default itemListingResolvers;
