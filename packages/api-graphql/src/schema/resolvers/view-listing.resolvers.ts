import type { GraphContext } from "../../init/context.ts";

export const resolvers = {
  Query: {
    viewListing: (_parent: unknown, { id }: { id: string }, context: GraphContext) => {
      console.log('viewListing resolver called with context:', context, 'and id:', id);
      // TODO: implement actual logic to fetch listing by id
      return {};
    },
  },
};
