import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.entity.ts';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.entity.ts';
import type { MessageEntityReference } from "./message.entity.ts";

export interface ConversationProps extends DomainSeedwork.DomainEntityProps {
	sharer: Readonly<PersonalUserEntityReference>;
	loadSharer: () => Promise<Readonly<PersonalUserEntityReference>>;
	reserver: Readonly<PersonalUserEntityReference>;
	loadReserver: () => Promise<Readonly<PersonalUserEntityReference>>;
	listing: Readonly<ItemListingEntityReference>;
	loadListing: () => Promise<Readonly<ItemListingEntityReference>>;
	messagingConversationId: string;
	messages: Readonly<MessageEntityReference[]>;
    loadMessages: () => Promise<Readonly<MessageEntityReference[]>>;

	get createdAt(): Date;
	get updatedAt(): Date;
	get schemaVersion(): string;
}

export interface ConversationEntityReference
	extends Readonly<ConversationProps> {}
