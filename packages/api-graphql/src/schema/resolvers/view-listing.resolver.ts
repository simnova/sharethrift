import type { GraphContext } from "../../context.ts";
// Use DDD/persistence unit of work pattern instead of direct model access

export const resolvers = {
  Query: {
    viewListing: async (_parent: unknown, { id }: { id: string }, context: GraphContext) => {
      // Use the unit of work pattern from the domain data source
      const uow = context.apiContext.dataSources.domainDataSource.domainContexts.listing?.item?.getItemListingUnitOfWork();
      if (!uow) throw new Error('ItemListingUnitOfWork not available');
      // Use the repository to fetch the listing by id
  return await uow.itemListingRepository.getById(id);
    },
  },
};
