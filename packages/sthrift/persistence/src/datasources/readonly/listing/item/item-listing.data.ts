import type { Models } from '@sthrift/data-sources-mongoose-models';
import {
	type MongoDataSource,
	MongoDataSourceImpl,
} from '../../mongo-data-source.ts';

export interface ItemListingDataSource
	extends MongoDataSource<Models.Listing.ItemListing> {}
export class ItemListingDataSourceImpl
	extends MongoDataSourceImpl<Models.Listing.ItemListing>
	implements ItemListingDataSource {}
