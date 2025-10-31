import type { GraphContext } from '../../../init/context.ts';
import type { ItemListingSearchInput } from '@sthrift/domain';

const itemListingSearchResolvers = {
	Query: {
		searchItemListings: async (
			_parent: unknown,
			args: { input: ItemListingSearchInput },
			context: GraphContext,
		) => {
			try {
				const result =
					await context.applicationServices.Listing.ItemListingSearch.searchItemListings(
						args.input,
					);

				return {
					items: result.items,
					count: result.count,
					facets: result.facets,
				};
			} catch (error) {
				console.error('Error in searchItemListings resolver:', error);
				throw new Error('Failed to search item listings');
			}
		},
	},
};

export default itemListingSearchResolvers;
