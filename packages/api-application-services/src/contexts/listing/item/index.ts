import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';
import { type ItemListingCreateCommand, create } from './create.ts';
import { type ItemListingQueryByIdCommand, queryById } from './query-by-id.ts';
import {
	type ItemListingQueryBySharerCommand,
	queryBySharer,
} from './query-by-sharer.ts';
import { type ItemListingQueryAllCommand, queryAll } from './query-all.ts';

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
		items: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[];
		total: number;
		page: number;
		pageSize: number;
	}>;
}

export const ItemListing = (
	dataSources: DataSources,
): ItemListingApplicationService => {
	return {
		create: create(dataSources),
		queryById: queryById(dataSources),
		queryBySharer: queryBySharer(dataSources),
		queryAll: queryAll(dataSources),
		queryPaged: async (command) => {
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
			return await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getPaged(args);
		},
	};
};
