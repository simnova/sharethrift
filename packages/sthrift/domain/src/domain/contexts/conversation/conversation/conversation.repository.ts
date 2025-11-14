import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Conversation } from './conversation.ts';
import type { ConversationProps } from './conversation.entity.ts';
import type { UserEntityReference } from '../../user/index.ts';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.entity.ts';

export interface ConversationRepository<props extends ConversationProps>
	extends DomainSeedwork.Repository<Conversation<props>> {
	getNewInstance(
		sharer: UserEntityReference,
		reserver: UserEntityReference,
		listing: ItemListingEntityReference,
	): Promise<Conversation<props>>;
	getByMessagingId(
		messagingConversationId: string,
	): Promise<Conversation<props> | null>;
	getByIdWithSharerReserver(
		sharer: string,
		reserver: string,
	): Promise<Conversation<props> | null>;
}
