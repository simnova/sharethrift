import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { ItemListingPersistence } from './item/index.ts';

export const ListingPersistence = (
    initializedService: MongooseSeedwork.MongooseContextFactory,
) => {
    return {
        ...ItemListingPersistence(initializedService),
    };
};