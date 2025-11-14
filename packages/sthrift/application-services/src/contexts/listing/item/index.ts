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
import { type ItemListingPauseCommand, pause } from './pause.ts';
import { queryPaged } from './query-paged.ts';
import { type ItemListingUpdateCommand, update } from './update.ts';

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
	pause: (
		command: ItemListingPauseCommand,
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
	update: (
		command: ItemListingUpdateCommand,
	) => Promise<Domain.Contexts.Listing.ItemListing.ItemListingEntityReference>;
}

export const ItemListing = (
	dataSources: DataSources,
): ItemListingApplicationService => {
	return {
		create: create(dataSources),
		queryById: queryById(dataSources),
		queryBySharer: queryBySharer(dataSources),
		queryAll: queryAll(dataSources),
		cancel: cancel(dataSources),
		pause: pause(dataSources),
		queryPaged: queryPaged(dataSources),
		update: update(dataSources),
	};
};
