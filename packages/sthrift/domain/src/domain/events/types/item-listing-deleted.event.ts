/**
 * Item Listing Deleted Event
 *
 * Domain event fired when an ItemListing entity is deleted.
 * This event is used to trigger search index cleanup and other
 * downstream processing.
 */

import { DomainSeedwork } from '@cellix/domain-seedwork';

export interface ItemListingDeletedProps {
	id: string;
	deletedAt: Date;
}

export class ItemListingDeletedEvent extends DomainSeedwork.CustomDomainEventImpl<ItemListingDeletedProps> {}
