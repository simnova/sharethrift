import { ViewListingRepository } from '@sthrift/api-domain/src/domain/contexts/listing/view-listing.repository';

export const resolvers = {
  Query: {
    viewListing: async (_: any, { id }: { id: string }) => {
      const repo = new ViewListingRepository();
      return repo.findById(id);
    },
  },
};
