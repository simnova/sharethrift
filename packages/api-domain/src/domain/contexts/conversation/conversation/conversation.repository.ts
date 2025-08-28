import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { ConversationPassport } from './conversation.passport.ts';
import type {
	Conversation,
	ConversationProps,
} from './conversation.aggregate.ts';

export interface ConversationRepository<props extends ConversationProps>
	extends DomainSeedwork.Repository<Conversation<props>> {
	getNewId(): Promise<string>;
	getNewInstance(
		sharer: string,
		reserver: string,
		listing: string,
		twilioConversationId: string,
		schemaversion: number,
		passport: ConversationPassport,
	): Promise<Conversation<props>>;

	getByTwilioSid(
		twilioConversationId: string,
	): Promise<Conversation<props> | null>;
	getByIdWithSharerReserver(
		listing: string,
		sharer: string,
		reserver: string,
	): Promise<Conversation<props> | null>;
	getUserConversations(userId: string): Promise<Conversation<props>[]>;
}
