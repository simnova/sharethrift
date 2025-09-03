import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../index.ts';
import * as ItemListing from './item/index.ts';

export const ListingContextPersistence = (
	models: ModelsContext,
	passport: Domain.Passport,
) => ({
	ItemListing: ItemListing.ItemListingPersistence(models, passport),
});
