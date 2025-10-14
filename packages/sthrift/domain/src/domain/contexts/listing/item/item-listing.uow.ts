import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.js';
import type { ItemListing } from './item-listing.js';
import type { ItemListingRepository } from './item-listing.repository.js';
import type { ItemListingProps } from './item-listing.entity.js';

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
