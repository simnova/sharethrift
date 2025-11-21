import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

export interface ConversationCreateCommand {
	reserverId: string;
	sharerId: string;
	listingId: string;
}

export const create = (dataSources: DataSources) => {
	return async (
		command: ConversationCreateCommand,
	): Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference> => {
		const existingConversation =
			await dataSources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getBySharerReserverListing(
				command.sharerId,
				command.reserverId,
				command.listingId,
			);
		if (existingConversation) {
			return existingConversation;
		}

		const sharer = await dataSources.readonlyDataSource.User.getUserById(
			command.sharerId,
		);
		const reserver = await dataSources.readonlyDataSource.User.getUserById(
			command.reserverId,
		);
		const listing =
			await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getById(
				command.listingId,
			);
		if (!sharer) {
			throw new Error(`Personal user (sharer) not found for id ${command.sharerId}`);
		}
		if (!reserver) {
			throw new Error(`Personal user (reserver) not found for id ${command.reserverId}`);
		}
		if (!listing) {
			throw new Error(`Listing not found for id ${command.listingId}`);
		}

		let messagingConversationId: string;
		try {
			if (!dataSources.messagingDataSource) {
				throw new Error('Messaging data source is not available');
			}

			const displayName = `${sharer.account.username} & ${reserver.account.username}`;
			const uniqueName = `conversation-${listing.id}-${sharer.id}-${reserver.id}`;

			const messagingConversation =
				await dataSources.messagingDataSource.Conversation.Conversation.MessagingConversationRepo.createConversation(
					displayName,
					uniqueName,
				);

			messagingConversationId = messagingConversation.id;
		} catch (error) {
			console.error(
				'Failed to create messaging conversation - Full error:',
				error,
			);
			throw new Error(
				`Failed to create messaging conversation: ${error instanceof Error ? error.message : String(error)}`,
			);
		}

		let conversationToReturn:
			| Domain.Contexts.Conversation.Conversation.ConversationEntityReference
			| undefined;
		await dataSources.domainDataSource.Conversation.Conversation.ConversationUnitOfWork.withScopedTransaction(
			async (repo) => {
				const newConversation = await repo.getNewInstance(
					sharer,
					reserver,
					listing,
					messagingConversationId,
				);
				conversationToReturn = await repo.save(newConversation);
			},
		);
		if (!conversationToReturn) {
			throw new Error('Conversation not found');
		}

		return conversationToReturn;
	};
};
