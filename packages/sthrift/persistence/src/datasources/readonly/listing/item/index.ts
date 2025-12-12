import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import {
	getItemListingReadRepository,
	type ItemListingReadRepository,
} from './item-listing.read-repository.ts';

export type { ItemListingReadRepository } from './item-listing.read-repository.ts';

export const ItemListingReadRepositoryImpl = (
	models: ModelsContext,
	passport: Domain.Passport,
): { ItemListingReadRepo: ItemListingReadRepository } => {
	return {
		ItemListingReadRepo: getItemListingReadRepository(models, passport),
	};
};
