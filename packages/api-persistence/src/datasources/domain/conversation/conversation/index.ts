import type { Domain } from '@sthrift/api-domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { getConversationUnitOfWork } from './conversation.uow.ts';

export const ConversationPersistence = (
	models: ModelsContext,
	passport: Domain.Passport,
) => {
	const ConversationModel = models.Conversation.ConversationModel;
	return {
		ConversationUnitOfWork: getConversationUnitOfWork(
			ConversationModel,
			passport,
		),
	};
};
