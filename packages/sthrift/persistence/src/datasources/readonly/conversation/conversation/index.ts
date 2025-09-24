import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { getConversationReadRepository } from './conversation.read-repository.ts';
export type { ConversationReadRepository } from './conversation.read-repository.ts';

export const ConversationReadRepositoryImpl = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	return {
		ConversationReadRepo: getConversationReadRepository(models, passport),
	};
};
