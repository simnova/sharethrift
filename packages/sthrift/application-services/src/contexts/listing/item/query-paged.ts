import type { DataSources } from '@sthrift/persistence';
// Domain types intentionally not required here; we return admin DTOs from persistence

export type ItemListingQueryPagedCommand = {
  page: number;
  pageSize: number;
  searchText?: string;
  statusFilters?: string[];
  sharerId?: string;
  sorter?: { field: string; order: 'ascend' | 'descend' };
};

export const queryPaged = (dataSources: DataSources) => async (
  command: ItemListingQueryPagedCommand,
): Promise<{
  items: Array<{
    id: string;
    title: string;
    image: string | null;
    publishedAt: string | null;
    reservationPeriod: string;
    status: string;
    pendingRequestsCount: number;
  }>;
  total: number;
  page: number;
  pageSize: number;
}> => {
  // Build args object without including undefined optional properties (exactOptionalPropertyTypes)
  const { page, pageSize, searchText, statusFilters, sharerId, sorter } = command;
  const args: {
    page: number;
    pageSize: number;
    searchText?: string;
    statusFilters?: string[];
    sharerId?: string;
    sorter?: { field: string; order: 'ascend' | 'descend' };
  } = { page, pageSize };
  if (searchText !== undefined) {
    args.searchText = searchText;
  }
  if (statusFilters !== undefined) {
    args.statusFilters = statusFilters;
  }
  if (sharerId !== undefined) {
    args.sharerId = sharerId;
  }
  if (sorter !== undefined) {
    args.sorter = sorter;
  }

  const res = await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getPagedAdmin(args);
  return res;
};

export default { queryPaged };
