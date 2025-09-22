import type { DataSources } from '@sthrift/persistence';
import {
	ItemListing as ItemListingApi,
	type ItemListingApplicationService,
} from './item/index.ts';

export interface ListingContextApplicationService {
	ItemListing: ItemListingApplicationService;
}

export const Listing = (
	dataSources: DataSources,
): ListingContextApplicationService => {
	return {
		ItemListing: ItemListingApi(dataSources),
	};
};
