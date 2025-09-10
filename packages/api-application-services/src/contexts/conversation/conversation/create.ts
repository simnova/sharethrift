import type { Domain } from '@sthrift/api-domain';
import type { DataSources } from '@sthrift/api-persistence';

export interface ConversationCreateCommand {
	reserverId: string;
	sharerId: string;
	listingId: string;
}

export const create = (dataSources: DataSources) => {
	return async (
		command: ConversationCreateCommand,
	): Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference> => {
		const sharer =
			await dataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getById(
				command.reserverId,
			);
		const reserver =
			await dataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getById(
				command.sharerId,
			);
		const listing =
			await dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getById(
				command.listingId,
			);
		if (!sharer) {
			throw new Error(
				`Personal user (sharer) not found for external id ${command.reserverId}`,
			);
		}
		if (!reserver) {
			throw new Error(
				`Personal user (reserver) not found for external id ${command.sharerId}`,
			);
		}
		if (!listing) {
			throw new Error(`Listing not found for id ${command.listingId}`);
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
