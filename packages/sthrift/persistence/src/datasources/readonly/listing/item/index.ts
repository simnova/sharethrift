import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { getItemListingReadRepository } from './item-listing.read-repository.ts';

export type { ItemListingReadRepository } from './item-listing.read-repository.ts';

export const ItemListingReadRepositoryImpl = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return {
		ItemListingReadRepo: getItemListingReadRepository(models, passport),
	};
};
