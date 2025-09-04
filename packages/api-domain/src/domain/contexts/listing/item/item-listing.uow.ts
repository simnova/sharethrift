import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { ItemListing, ItemListingProps } from './item-listing.ts';
import type { ItemListingRepository } from './item-listing.repository.ts';

export interface ItemListingUnitOfWork
	extends DomainSeedwork.UnitOfWork<
			Passport,
			ItemListingProps,
			ItemListing<ItemListingProps>,
			ItemListingRepository<ItemListingProps>
		>,
		DomainSeedwork.InitializedUnitOfWork<
			Passport,
			ItemListingProps,
			ItemListing<ItemListingProps>,
			ItemListingRepository<ItemListingProps>
		> {}
