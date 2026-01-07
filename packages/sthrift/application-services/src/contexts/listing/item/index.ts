import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { type ItemListingCreateCommand, create } from './create.ts';
import { type ItemListingQueryByIdCommand, queryById } from './query-by-id.ts';
import {
	type ItemListingQueryBySharerCommand,
	queryBySharer,
} from './query-by-sharer.ts';
import { type ItemListingQueryAllCommand, queryAll } from './query-all.ts';
import { type ItemListingCancelCommand, cancel } from './cancel.ts';
import { type ItemListingDeleteCommand, deleteListings } from './delete.ts';
import { type ItemListingUpdateCommand, update } from './update.ts';
import { type ItemListingUnblockCommand, unblock } from './unblock.ts';
import { queryPaged } from './query-paged.ts';
import {
	type ProcessExpiredDeletionsResult,
	processExpiredDeletions,
} from './process-expired-deletions.ts';

export interface ItemListingApplicationService {
	create: (
		command: ItemListingCreateCommand,
	) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference>;
	queryById: (
		command: ItemListingQueryByIdCommand,
	) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference | null>;
	queryBySharer: (
		command: ItemListingQueryBySharerCommand,
	) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]>;
	queryAll: (
		command: ItemListingQueryAllCommand,
	) => Promise<
		Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[]
	>;
	cancel: (
		command: ItemListingCancelCommand,
	) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference>;
	update: (
		command: ItemListingUpdateCommand,
	) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference>;
	deleteListings: (command: ItemListingDeleteCommand) => Promise<boolean>;
	unblock: (
		command: ItemListingUnblockCommand,
	) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference>;
	queryPaged: (command: {
		page: number;
		pageSize: number;
		searchText?: string;
		statusFilters?: string[];
		sharerId?: string;
		sorter?: { field: string; order: 'ascend' | 'descend' };
	}) => Promise<{
		items: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[];
		total: number;
		page: number;
		pageSize: number;
	}>;
	processExpiredDeletions: () => Promise<ProcessExpiredDeletionsResult>;
}

export interface ItemListingDependencies {
	dataSources: DataSources;
	blobStorage?: Domain.Services['BlobStorage'];
}

export const ItemListing = (
	deps: DataSources | ItemListingDependencies,
): ItemListingApplicationService => {
	const dataSources = 'dataSources' in deps ? deps.dataSources : deps;
	const blobStorage = 'blobStorage' in deps ? deps.blobStorage : undefined;

	return {
		create: create(dataSources),
		queryById: queryById(dataSources),
		queryBySharer: queryBySharer(dataSources),
		queryAll: queryAll(dataSources),
		cancel: cancel(dataSources),
		update: update(dataSources),
		deleteListings: deleteListings(dataSources),
		unblock: unblock(dataSources),
		queryPaged: queryPaged(dataSources),
		processExpiredDeletions: processExpiredDeletions(dataSources, blobStorage),
	};
};
