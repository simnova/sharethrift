import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../index.ts';
import { ItemListingReadRepositoryImpl } from './item/index.ts';

export const ListingContext = (
	models: ModelsContext,
	passport: Domain.Passport,
) => ({
	ItemListing: ItemListingReadRepositoryImpl(models, passport),
});
