
import type { GraphContext } from "../../context.ts";
import { ItemListingModel } from "@sthrift/api-data-sources-mongoose-models/src/models/listing/item.model";

export const resolvers = {
  Query: {
    viewListing: async (_parent: unknown, { id }: { id: string }, context: GraphContext) => {
      // Fetch the listing by id using the ItemListingModel
      return await ItemListingModel.findById(id).lean();
    },
  },
};
