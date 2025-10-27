import type { DataSources } from '@sthrift/persistence';

export type ItemListingRemoveCommand = { id: string };

export const remove = (dataSources: DataSources) => async (
  command: ItemListingRemoveCommand,
): Promise<boolean> => {
  // Prefer a persistence helper; if it's not present at runtime, fail explicitly.
  const helper = dataSources.domainDataSource.Listing.ItemListing.remove;
  if (!helper) {
    throw new Error('persistence helper ItemListing.remove not implemented');
  }
  await helper(command.id);
  return true;
};

export default { remove };
