import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { ConversationRepository } from './conversation.repository.ts';
import type { Conversation, ConversationProps } from './conversation.ts';

export interface ConversationUnitOfWork
	extends DomainSeedwork.UnitOfWork<
			Passport,
			ConversationProps,
			Conversation<ConversationProps>,
			ConversationRepository<ConversationProps>
		>,
		DomainSeedwork.InitializedUnitOfWork<
			Passport,
			ConversationProps,
			Conversation<ConversationProps>,
			ConversationRepository<ConversationProps>
		> {}
