import type { DataSources } from '@sthrift/persistence';

export type ItemListingUnblockCommand = { id: string };

export const unblock = (dataSources: DataSources) => async (
  command: ItemListingUnblockCommand,
): Promise<boolean> => {
  const helper = dataSources.domainDataSource.Listing.ItemListing.unblock;
  if (!helper) {
    throw new Error('persistence helper ItemListing.unblock not implemented');
  }
  await helper(command.id);
  return true;
};

export default { unblock };
