import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../passport.ts';
import type { ItemListing, ItemListingProps } from './item.aggregate.ts';
import type { ItemListingRepository } from './item.repository.ts';

export interface ItemListingUnitOfWork
	extends DomainSeedwork.UnitOfWork<
		Passport,
		ItemListingProps,
		ItemListing<ItemListingProps>,
		ItemListingRepository<ItemListingProps>
	> {
	readonly itemListingRepository: ItemListingRepository<ItemListingProps>;
}
