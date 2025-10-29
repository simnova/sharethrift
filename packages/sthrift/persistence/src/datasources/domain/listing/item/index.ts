import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { getItemListingUnitOfWork } from './item-listing.uow.ts';

export const ItemListingPersistence = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return {
		ItemListingUnitOfWork: getItemListingUnitOfWork(
			models.Listing.ItemListingModel,
			passport,
		),
	};
};
