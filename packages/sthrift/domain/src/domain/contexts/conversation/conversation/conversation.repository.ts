import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.entity.ts';
import type { UserEntityReference } from '../../user/index.ts';
import type { ConversationProps } from './conversation.entity.ts';
import type { Conversation } from './conversation.ts';

export interface ConversationRepository<props extends ConversationProps>
	extends DomainSeedwork.Repository<Conversation<props>> {
	getNewInstance(
		sharer: UserEntityReference,
		reserver: UserEntityReference,
		listing: ItemListingEntityReference,
		messagingConversationId?: string,
	): Promise<Conversation<props>>;
	getByMessagingId(
		messagingConversationId: string,
	): Promise<Conversation<props> | null>;
	getByIdWithSharerReserver(
		sharer: string,
		reserver: string,
	): Promise<Conversation<props> | null>;
	getByListingId(listingId: string): Promise<Conversation<props>[]>;
	getExpired(limit?: number): Promise<Conversation<props>[]>;
}
