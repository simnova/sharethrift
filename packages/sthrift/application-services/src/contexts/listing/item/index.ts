import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { type ItemListingCreateCommand, create } from './create.ts';
import { type ItemListingQueryByIdCommand, queryById } from './query-by-id.ts';
import {
  type ItemListingQueryBySharerCommand,
  queryBySharer,
} from './query-by-sharer.ts';
import { type ItemListingQueryAllCommand, queryAll } from './query-all.ts';
import { queryPaged } from './query-paged.ts';
import { remove } from './remove.ts';
import { unblock } from './unblock.ts';

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
		command: ItemListingQueryAllCommand,
	) => Promise<
		Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]
	>;
	queryPaged: (command: {
		page: number;
		pageSize: number;
		searchText?: string;
		statusFilters?: string[];
		sharerId?: string;
		sorter?: { field: string; order: 'ascend' | 'descend' };
	}) => Promise<{
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
	}>;
	remove: (command: { id: string }) => Promise<boolean>;
	unblock: (command: { id: string }) => Promise<boolean>;
}

export const ItemListing = (
  dataSources: DataSources,
): ItemListingApplicationService => {
  return {
	create: create(dataSources),
	queryById: queryById(dataSources),
	queryBySharer: queryBySharer(dataSources),
	queryAll: queryAll(dataSources),
	queryPaged: queryPaged(dataSources),
	remove: remove(dataSources),
	unblock: unblock(dataSources),
  };
};
