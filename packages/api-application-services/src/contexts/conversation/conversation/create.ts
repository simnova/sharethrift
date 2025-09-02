import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

export interface ConversationCreateCommand {
	topic: string;
	PersonalUserExternalId: string;
}

export const create = (dataSources: DataSources) => {
	return async (
		command: ConversationCreateCommand,
	): Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference> => {
		const sharer =
			await dataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getById(
				command.PersonalUserExternalId,
			);
		if (!sharer) {
			throw new Error(
				`End user not found for external id ${command.PersonalUserExternalId}`,
			);
		}
		let conversationToReturn:
			| Domain.Contexts.Conversation.Conversation.ConversationEntityReference
			| undefined;
		await dataSources.domainDataSource.Conversation.Conversation.ConversationUnitOfWork.withScopedTransaction(
			async (repo) => {
				const newConversation = await repo.getNewInstance(
					command.topic,
					sharer,
				);
				conversationToReturn = await repo.save(newConversation);
			},
		);
		if (!conversationToReturn) {
			throw new Error('conversation not found');
		}
		return conversationToReturn;
	};
};
