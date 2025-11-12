import type { DataSources } from '@sthrift/persistence';

export interface ItemListingUpdateCommand {
	id: string;
	isBlocked?: boolean;
	isDeleted?: boolean;
}

export const update = (datasources: DataSources) => {
	return async (command: ItemListingUpdateCommand): Promise<void> => {
		// If deleting the listing, cascade delete conversations first
		if (command.isDeleted === true) {
			try {
				// Get all conversations for this listing
				const conversations =
					await datasources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getByListingId(
						command.id,
					);

			if (conversations.length > 0) {
				// Delete from messaging service first (Twilio/Mock)
				if (datasources.messagingDataSource) {
					for (const conversation of conversations) {
						try {
							await datasources.messagingDataSource.Conversation.Conversation.MessagingConversationRepo.deleteConversation(
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
				}

			// Delete from database
			for (const conversation of conversations) {
				await datasources.domainDataSource.Conversation.Conversation.ConversationUnitOfWork.withScopedTransaction(
					async (repo) => {
						const conversationToDelete = await repo.get(conversation.id);
						if (conversationToDelete) {
							conversationToDelete.setDeleted(true);
							await repo.save(conversationToDelete);
						}
					},
				);
			}					console.log(
						`Cascade deleted ${conversations.length} conversations for listing ${command.id}`,
					);
				}
			} catch (error) {
				console.error(
					'Error cascade deleting conversations for listing:',
					error,
				);
				// Continue with listing deletion even if conversation cleanup fails
			}
		}

		const uow =
			datasources.domainDataSource.Listing.ItemListing.ItemListingUnitOfWork;
		if (!uow)
			throw new Error(
				'ItemListingUnitOfWork not available on dataSources.domainDataSource.Listing.ItemListing',
			);

		await uow.withScopedTransactionById(command.id, async (repo) => {
			const listing = await repo.get(command.id);

			if (command.isBlocked !== undefined) {
				listing.setBlocked(command.isBlocked);
			}

			if (command.isDeleted !== undefined) {
				listing.setDeleted(command.isDeleted);
			}

			await repo.save(listing);
		});
	};
};
