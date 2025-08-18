export * as Models from './models/conversations/index.ts';
export * as ItemListingModels from './models/listing/item/index.ts';

import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import * as ItemListingModels from './models/listing/item/index.ts';

export const mongooseContextBuilder = (
	mongooseFactory: MongooseSeedwork.MongooseContextFactory,
) => {
	return {
		ItemListingModel: ItemListingModels.ItemListingModelFactory(mongooseFactory),
	};
};

export type MongooseContext = ReturnType<typeof mongooseContextBuilder>;