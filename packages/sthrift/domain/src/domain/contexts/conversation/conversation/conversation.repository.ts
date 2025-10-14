import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Conversation } from './conversation.js';
import type { ConversationProps } from './conversation.entity.js';
import type { PersonalUserEntityReference } from '../../user/personal-user/index.js';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.entity.js';

export interface ConversationRepository<props extends ConversationProps>
	extends DomainSeedwork.Repository<Conversation<props>> {
	getNewInstance(
		sharer: PersonalUserEntityReference,
		reserver: PersonalUserEntityReference,
		listing: ItemListingEntityReference,
	): Promise<Conversation<props>>;
	getByTwilioSid(
		twilioConversationId: string,
	): Promise<Conversation<props> | null>;
	getByIdWithSharerReserver(
		sharer: string,
		reserver: string,
	): Promise<Conversation<props> | null>;
}
