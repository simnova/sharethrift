import type { DataSources } from '@sthrift/persistence';

export type ItemListingUnblockCommand = { id: string };

export const unblock = (dataSources: DataSources) => async (
  command: ItemListingUnblockCommand,
): Promise<boolean> => {
  const uow = dataSources.domainDataSource.Listing.ItemListing.ItemListingUnitOfWork;
  if (!uow) throw new Error('ItemListingUnitOfWork not available on dataSources.domainDataSource.Listing.ItemListing');

  await uow.withScopedTransactionById(command.id, async (repo) => {
    const listing = await repo.get(command.id);
    listing.unblock?.();
  });
  return true;
};

