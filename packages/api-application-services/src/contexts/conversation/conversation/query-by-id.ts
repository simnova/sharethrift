import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

export interface ConversationQueryByIdCommand {
	id: string;
	fields?: string[];
}

export const queryById = (dataSources: DataSources) => {
	return async (
		command: ConversationQueryByIdCommand,
	): Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null> => {
		return await dataSources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getById(
			command.id,
			{ fields: command.fields },
		);
	};
};
