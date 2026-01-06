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
		messagingConversationId?: string,
	): Promise<Conversation<props>>;
	getByMessagingId(
		messagingConversationId: string,
	): Promise<Conversation<props> | null>;
	getByIdWithSharerReserver(
		sharer: string,
		reserver: string,
	): Promise<Conversation<props> | null>;
	/**
	 * Finds all conversations associated with a specific listing.
	 * Used for scheduling conversation deletion when a listing expires or is archived.
	 * @param listingId - The ID of the listing to find conversations for
	 * @returns Array of conversations associated with the listing
	 */
	getByListingId(listingId: string): Promise<Conversation<props>[]>;
	/**
	 * Finds all conversations that have expired (expiresAt is in the past).
	 * Used by cleanup processes to identify conversations ready for deletion.
	 * @param limit - Maximum number of conversations to return (default: 100)
	 * @returns Array of expired conversations
	 */
	getExpired(limit?: number): Promise<Conversation<props>[]>;
}
