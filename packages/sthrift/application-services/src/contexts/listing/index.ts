import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import type { ListingDeletionConfig } from '@sthrift/context-spec';
import {
	ItemListing as ItemListingApi,
	type ItemListingApplicationService,
	type ItemListingDependencies,
} from './item/index.ts';

export interface ListingContextApplicationService {
	ItemListing: ItemListingApplicationService;
}

interface ListingDependencies {
	dataSources: DataSources;
	blobStorage?: Domain.Services['BlobStorage'];
	listingDeletionConfig?: ListingDeletionConfig;
}

export const Listing = (
	deps: DataSources | ListingDependencies,
): ListingContextApplicationService => {
	const dataSources = 'dataSources' in deps ? deps.dataSources : deps;
	const blobStorage = 'blobStorage' in deps ? deps.blobStorage : undefined;
	const listingDeletionConfig = 'listingDeletionConfig' in deps ? deps.listingDeletionConfig : undefined;

	const itemListingDeps: ItemListingDependencies = { dataSources };
	if (blobStorage) {
		itemListingDeps.blobStorage = blobStorage;
	}
	if (listingDeletionConfig) {
		itemListingDeps.listingDeletionConfig = listingDeletionConfig;
	}

	return {
		ItemListing: ItemListingApi(itemListingDeps),
	};
};
