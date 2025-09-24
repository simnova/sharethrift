import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../models-context.ts';
import * as ItemListing from './item/index.ts';

export const ListingContextPersistence = (
	models: ModelsContext,
	passport: Domain.Passport,
) => ({
	ItemListing: ItemListing.ItemListingPersistence(models, passport),
});
