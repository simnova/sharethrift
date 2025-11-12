import type { DataSources } from '@sthrift/persistence';

export interface ConversationDeleteByListingIdCommand {
	listingId: string;
}

export const deleteByListingId = (dataSources: DataSources) => {
	return async (
		command: ConversationDeleteByListingIdCommand,
	): Promise<number> => {
		// Get all conversations for this listing
		const conversations =
			await dataSources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getByListingId(
				command.listingId,
			);

		if (conversations.length === 0) {
			return 0;
		}

	// Delete from messaging service first (Twilio/Mock)
	if (dataSources.messagingDataSource) {
		for (const conversation of conversations) {
			try {
				await dataSources.messagingDataSource.Conversation.Conversation.MessagingConversationRepo.deleteConversation(
					conversation.messagingConversationId,
				);
			} catch (error) {
				console.error(
					`Failed to delete messaging conversation ${conversation.messagingConversationId}:`,
					error,
				);
				// Continue anyway - we want to clean up database even if messaging service fails
			}
		}
	}		// Delete from database
		let deletedCount = 0;
		for (const conversation of conversations) {
			await dataSources.domainDataSource.Conversation.Conversation.ConversationUnitOfWork.withScopedTransaction(
				async (repo) => {
					const conversationToDelete = await repo.get(conversation.id);
					if (conversationToDelete) {
						conversationToDelete.setDeleted(true);
						await repo.save(conversationToDelete);
						deletedCount++;
					}
				},
			);
		}

		return deletedCount;
	};
};
