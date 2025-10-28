import type { DataSources } from '@sthrift/persistence';

export type ItemListingRemoveCommand = { id: string };

export const remove = (dataSources: DataSources) => async (
  command: ItemListingRemoveCommand,
): Promise<boolean> => {
  const uow = dataSources.domainDataSource.Listing.ItemListing.ItemListingUnitOfWork;
  if (!uow) throw new Error('ItemListingUnitOfWork not available on dataSources.domainDataSource.Listing.ItemListing');

  await uow.withScopedTransactionById(command.id, async (repo) => {
    const listing = await repo.get(command.id);
    listing.requestDelete?.();
  });

  return true;
};

