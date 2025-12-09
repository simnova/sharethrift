/**
 * Item Listing Search GraphQL Resolvers
 *
 * Provides GraphQL resolvers for item listing search functionality.
 */

import type { GraphContext } from '../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
import type {
	Resolvers,
	QuerySearchItemListingsArgs,
} from '../builder/generated.ts';

const itemListingSearchResolvers: Resolvers = {
	Query: {
		searchItemListings: async (
			_parent: unknown,
			args: QuerySearchItemListingsArgs,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			console.log('searchItemListings resolver called with input:', args.input);

			try {
				// Call domain service directly - types already match
				return await context.applicationServices.Listing.ItemListingSearch.searchItemListings(
					args.input,
				);
			} catch (error) {
				console.error('Error in searchItemListings resolver:', error);
				throw new Error('Failed to search item listings');
			}
		},
	},

	Mutation: {
		bulkIndexItemListings: async (
			_parent: unknown,
			_args: unknown,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			console.log('bulkIndexItemListings mutation called');

			try {
				return await context.applicationServices.Listing.ItemListingSearch.bulkIndexItemListings();
			} catch (error) {
				console.error('Error in bulkIndexItemListings mutation:', error);
				throw new Error('Failed to bulk index item listings');
			}
		},
	},
};

export default itemListingSearchResolvers;
