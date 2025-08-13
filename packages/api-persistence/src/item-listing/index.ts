import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { getItemListingUnitOfWork } from './item-listing.uow.ts';

export const ItemListingPersistence = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
) => {
	return {
		getItemListingUnitOfWork: () => {
			return getItemListingUnitOfWork(initializedService);
		},
	};
};