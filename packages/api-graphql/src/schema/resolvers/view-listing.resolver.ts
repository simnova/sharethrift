import type { GraphContext } from "../../context.ts";

export const resolvers = {
  Query: {
  viewListing: (_parent: unknown, { id }: { id: string }, context: GraphContext) => {
      console.log('viewListing resolver called with context:', context);
  // TODO: implement actual logic to fetch a listing by id using context
  return { id };
    },
  },
};
