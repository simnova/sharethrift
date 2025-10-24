/**
 * Item Listing Updated Event
 *
 * Domain event fired when an ItemListing entity is updated.
 * This event is used to trigger search index updates and other
 * downstream processing.
 */

import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface ItemListingUpdatedProps {
	id: string;
	updatedAt: Date;
}

export class ItemListingUpdatedEvent extends DomainSeedwork.CustomDomainEventImpl<ItemListingUpdatedProps> {}
