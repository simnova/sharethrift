import type { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { getConversationUnitOfWork } from './conversation.uow.ts';

export const ConversationPersistence = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	const { ConversationModel } = models.Conversation;
	return {
		ConversationUnitOfWork: getConversationUnitOfWork(
			ConversationModel,
			passport,
		),
	};
};
