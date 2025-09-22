import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

export interface ConversationQueryByUserCommand {
	userId: string;
	fields?: string[];
}

export const queryByUser = (dataSources: DataSources) => {
	return async (
		command: ConversationQueryByUserCommand,
	): Promise<
		Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]
	> => {
		return await dataSources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getByUser(
			command.userId,
			{ fields: command.fields },
		);
	};
};
