import type { GraphContext } from "../../init/context.ts";

export const itemListingResolvers = {
  Query: {
    itemListings: (_parent: unknown, _args: unknown, context: GraphContext) => {
      console.log('item listing resolver called with context:', context);
      // TODO: implement actual logic to fetch listings
      return [];
    },
    itemListing: () => {
      console.log('item listing resolver called');
      // TODO: implement actual logic to fetch listings
      return {};
    },
    // activeListings: (_parent: unknown, _args: unknown, context: GraphContext) => {
    //   console.log('active listings resolver called with context:', context);
    //   // TODO: implement actual logic to fetch active listings
    //   return [];
    // },
  },
};