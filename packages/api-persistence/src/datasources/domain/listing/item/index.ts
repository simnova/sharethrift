import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../../index.ts';
import { getItemListingUnitOfWork } from './item-listing.uow.ts';

export const ItemListingPersistence = (models: ModelsContext, passport: Domain.Passport) => {
	const itemListingModel = models.Listing?.ItemListingModel;
	return {
		ItemListingUnitOfWork: getItemListingUnitOfWork(itemListingModel, passport),
	};
};
