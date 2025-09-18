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
