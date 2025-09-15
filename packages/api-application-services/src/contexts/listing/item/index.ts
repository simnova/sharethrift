import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';
import { type ItemListingCreateCommand, create } from './create.ts';
import { type ItemListingQueryByIdCommand, queryById } from './query-by-id.ts';
import {
  type ItemListingQueryBySharerCommand,
  queryBySharer,
} from './query-by-sharer.ts';

export interface ItemListingApplicationService {
  create: (
  command: ItemListingCreateCommand,
  ) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference>;
  queryById: (
  command: ItemListingQueryByIdCommand,
  ) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference | null>;
  queryBySharer: (
  command: ItemListingQueryBySharerCommand,
  ) => Promise<
  Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]
  >;
  queryAll: (
  command?: ItemListingQueryAllCommand
  ) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]>;
}

export const ItemListing = (
  dataSources: DataSources,
): ItemListingApplicationService => {
  return {
  create: create(dataSources),
  queryById: queryById(dataSources),
  queryBySharer: queryBySharer(dataSources),
  queryAll: queryAll(dataSources),
  };
};

// Query all listings (for admin/global use, with optional filtering)
export interface ItemListingQueryAllCommand {
  page?: number;
  pageSize?: number;
  searchText?: string;
  statusFilters?: string[];
  sorter?: { field: string; order: 'ascend' | 'descend' };
}

export const queryAll = (dataSources: DataSources) => {
  return async (
    command: ItemListingQueryAllCommand = {}
  ): Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]> => {
    // Call the real backend repository for all listings with filtering/pagination
    // This assumes a method like getAllWithPagination exists in the repository
    // If not, you should implement it in the persistence layer
    return await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getAllWithPagination({
      page: command.page,
      pageSize: command.pageSize,
      searchText: command.searchText,
      statusFilters: command.statusFilters,
      sorter: command.sorter,
    });
  };
};
