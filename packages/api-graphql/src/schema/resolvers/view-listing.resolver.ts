import { ViewListingRepository } from '@sthrift/api-domain/src/domain/contexts/listing/view-listing.repository';

export const resolvers = {
  Query: {
    viewListing: async (_: unknown, { id }: { id: string }) => {
      const repo = new ViewListingRepository();
      return await repo.findById(id);
    },
  },
};
