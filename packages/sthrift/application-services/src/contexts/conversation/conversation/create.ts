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
		// Check if conversation already exists between these users for this listing
		const existingConversation =
			await dataSources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getBySharerReserverListing(
				command.sharerId,
				command.reserverId,
				command.listingId,
			);
		if (existingConversation) {
			return existingConversation;
		}

		// Fetch the users and listing - FIXED: Use correct IDs
		const sharer =
			await dataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getById(
				command.sharerId,
			);
		const reserver =
			await dataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getById(
				command.reserverId,
			);
		const listing =
			await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getById(
				command.listingId,
			);
		if (!sharer) {
			throw new Error(
				`Personal user (sharer) not found for id ${command.sharerId}`,
			);
		}
		if (!reserver) {
			throw new Error(
				`Personal user (reserver) not found for id ${command.reserverId}`,
			);
		}
	if (!listing) {
		throw new Error(`Listing not found for id ${command.listingId}`);
	}
	// Create messaging conversation first (Twilio/Mock)
	let messagingConversationId: string;
	try {
		if (!dataSources.messagingDataSource) {
			console.error('Messaging data source is undefined');
			throw new Error('Messaging data source is not available');
		}
		
		const displayName = `${sharer.account.username} & ${reserver.account.username}`;
		const uniqueName = `conversation-${listing.id}`;
		
		console.log('Creating messaging conversation with:', { displayName, uniqueName });
		
		const messagingConversation =
			await dataSources.messagingDataSource.Conversation.Conversation.MessagingConversationRepo.createConversation(
				displayName,
				uniqueName,
			);
		
		console.log('Messaging conversation created:', messagingConversation);
		messagingConversationId = messagingConversation.id;
	} catch (error) {
		console.error('Failed to create messaging conversation - Full error:', error);
		if (error instanceof Error) {
			console.error('Error message:', error.message);
			console.error('Error stack:', error.stack);
		}
		throw new Error(`Failed to create messaging conversation: ${error instanceof Error ? error.message : String(error)}`);
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
	// Return conversationToReturn directly - GraphQL resolvers will handle population
	return conversationToReturn;
	};
};
