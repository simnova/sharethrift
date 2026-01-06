import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { UserEntityReference } from '../../user/index.ts';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.entity.ts';
import type { MessageEntityReference } from './message.entity.ts';

export interface ConversationProps extends DomainSeedwork.DomainEntityProps {
	sharer: Readonly<UserEntityReference>;
	loadSharer: () => Promise<Readonly<UserEntityReference>>;
	reserver: Readonly<UserEntityReference>;
	loadReserver: () => Promise<Readonly<UserEntityReference>>;
	listing: Readonly<ItemListingEntityReference>;
	loadListing: () => Promise<Readonly<ItemListingEntityReference>>;
	messagingConversationId: string;
	messages: Readonly<MessageEntityReference[]>;
	loadMessages: () => Promise<Readonly<MessageEntityReference[]>>;
	/**
	 * TTL field for automatic expiration.
	 * Set to 6 months after the associated listing expires, is cancelled,
	 * or the related reservation request is completed/closed.
	 */
	expiresAt?: Date | undefined;

	get createdAt(): Date;
	get updatedAt(): Date;
	get schemaVersion(): string;
}

export interface ConversationEntityReference
	extends Readonly<Omit<ConversationProps, 'sharer' | 'reserver' | 'listing'>> {
	readonly sharer: UserEntityReference;
	readonly reserver: UserEntityReference;
	readonly listing: ItemListingEntityReference;
	readonly expiresAt?: Date | undefined;
}
