import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { type ConversationCreateCommand, create } from './create.ts';
import { type ConversationQueryByIdCommand, queryById } from './query-by-id.ts';
import {
	type ConversationQueryByUserCommand,
	queryByUser,
} from './query-by-user.ts';
import {
	type ConversationSendMessageCommand,
	sendMessage,
} from './send-message.ts';

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
	sendMessage: (
		command: ConversationSendMessageCommand,
	) => Promise<Domain.Contexts.Conversation.Conversation.MessageEntityReference>;
}

export const Conversation = (
	dataSources: DataSources,
): ConversationApplicationService => {
	return {
		create: create(dataSources),
		queryById: queryById(dataSources),
		queryByUser: queryByUser(dataSources),
		sendMessage: sendMessage(dataSources),
	};
};
