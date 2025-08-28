import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type {
	Conversation,
	ConversationProps,
} from './conversation.aggregate.ts';
import type { ConversationPassport } from './conversation.passport.ts';
import type { ConversationRepository } from './conversation.repository.ts';

export interface ConversationUnitOfWork
	extends DomainSeedwork.UnitOfWork<
		ConversationPassport,
		ConversationProps,
		Conversation<ConversationProps>,
		ConversationRepository<ConversationProps>
	> {
	conversationRepository: ConversationRepository<ConversationProps>;
}

export interface ConversationDomainAdapter {
	conversationUnitOfWork: ConversationUnitOfWork;
}
