import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import {
	InProcEventBusInstance,
	NodeEventBusInstance,
} from '@cellix/event-bus-seedwork-node';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';
import { ConversationConverter } from './conversation.domain-adapter.ts';
import { ConversationRepository } from './conversation.repository.ts';

export const getConversationUnitOfWork = (
	conversationModel: Models.Conversation.ConversationModelType,
	passport: Domain.Passport,
): Domain.Contexts.Conversation.Conversation.ConversationUnitOfWork => {
	const unitOfWork = new MongooseSeedwork.MongoUnitOfWork(
		InProcEventBusInstance,
		NodeEventBusInstance,
		conversationModel,
		new ConversationConverter(),
		ConversationRepository,
	);
	return MongooseSeedwork.getInitializedUnitOfWork(unitOfWork, passport);
};
