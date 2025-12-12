import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../models-context.ts';
import {
	ItemListingReadRepositoryImpl,
	type ItemListingReadRepository,
} from './item/index.ts';

export const ListingContext = (
	models: ModelsContext,
	passport: Domain.Passport,
): { ItemListing: { ItemListingReadRepo: ItemListingReadRepository } } => ({
	ItemListing: ItemListingReadRepositoryImpl(models, passport),
});
