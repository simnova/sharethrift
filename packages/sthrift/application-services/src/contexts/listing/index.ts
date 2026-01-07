import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import {
	ItemListing as ItemListingApi,
	type ItemListingApplicationService,
	type ItemListingDependencies,
} from './item/index.ts';

export interface ListingContextApplicationService {
	ItemListing: ItemListingApplicationService;
}

export interface ListingDependencies {
	dataSources: DataSources;
	blobStorage?: Domain.Services['BlobStorage'];
}

export const Listing = (
	deps: DataSources | ListingDependencies,
): ListingContextApplicationService => {
	const dataSources = 'dataSources' in deps ? deps.dataSources : deps;
	const blobStorage = 'blobStorage' in deps ? deps.blobStorage : undefined;

	const itemListingDeps: ItemListingDependencies = { dataSources };
	if (blobStorage) {
		itemListingDeps.blobStorage = blobStorage;
	}

	return {
		ItemListing: ItemListingApi(itemListingDeps),
	};
};
