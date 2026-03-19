import type { Resolvers } from '../builder/generated.ts';

const listingSearch: Resolvers = {
	Query: {
		searchListings: async (_parent, { input }, context, _info) => {
			return await context.applicationServices.Listing.ListingSearch.searchListings(input);
		},
	},

	Mutation: {
		bulkIndexListings: async (_parent, _args, context, _info) => {
			return await context.applicationServices.Listing.ListingSearch.bulkIndexListings();
		},
	},
};

export default listingSearch;
