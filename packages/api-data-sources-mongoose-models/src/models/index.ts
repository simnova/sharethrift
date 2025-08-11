import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { ItemListingModelFactory } from './item-listing.ts';

export const mongooseContextBuilder = (
	mongoose: MongooseSeedwork.MongooseContextFactory,
) => {
	return {
		ItemListing: ItemListingModelFactory(mongoose),
	};
};

export type MongooseContext = ReturnType<typeof mongooseContextBuilder>;
