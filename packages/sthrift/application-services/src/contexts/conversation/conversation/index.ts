import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import type { IMessagingService } from '@cellix/messaging';
import { type ConversationCreateCommand, create } from './create.ts';
import { type ConversationQueryByIdCommand, queryById } from './query-by-id.ts';
import {
	type ConversationQueryByUserCommand,
	queryByUser,
} from './query-by-user.ts';

export interface ConversationApplicationService {
	create: (
		command: ConversationCreateCommand,
	) => Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference>;
	queryById: (
		command: ConversationQueryByIdCommand,
	) => Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null>;
	queryByUser: (
		command: ConversationQueryByUserCommand,
	) => Promise<
		Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]
	>;
}

export const Conversation = (
	dataSources: DataSources,
	messagingService: IMessagingService,
): ConversationApplicationService => {
	return {
		create: create(dataSources),
		queryById: queryById(dataSources),
		queryByUser: queryByUser(dataSources, messagingService),
	};
};
