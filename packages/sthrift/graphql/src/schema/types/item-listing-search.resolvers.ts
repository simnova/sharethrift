import type { Resolvers } from '../builder/generated.ts';

const listingSearch: Resolvers = {
	Query: {
		searchItemListings: async (_parent, { input }, context, _info) => {
			return await context.applicationServices.Listing.ItemListingSearch.searchItemListings(input);
		},
	},

	Mutation: {
		bulkIndexItemListings: async (_parent, _args, context, _info) => {
			return await context.applicationServices.Listing.ItemListingSearch.bulkIndexItemListings();
		},
	},
};

export default listingSearch;
