import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../../index.ts';
// TODO: Implement getItemListingReadRepository

export type { ItemListingReadRepository } from './item-listing.read-repository.ts';

export const ItemListingReadRepositoryImpl = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return {
		ItemListingReadRepo: undefined, // Replace with actual implementation
	};
};
