import type { DataSources } from '@sthrift/persistence';

export interface DeleteByListingResult {
	deletedCount: number;
	deletedConversationIds: string[];
	errors: Array<{ conversationId: string; error: string }>;
}

export const deleteByListing = (dataSources: DataSources) => {
	return async (listingId: string): Promise<DeleteByListingResult> => {
		const result: DeleteByListingResult = {
			deletedCount: 0,
			deletedConversationIds: [],
			errors: [],
		};

		const conversations =
			await dataSources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getByListingId(
				listingId,
			);

		if (conversations.length === 0) {
			return result;
		}

		const uow =
			dataSources.domainDataSource.Conversation.Conversation
				.ConversationUnitOfWork;

		for (const conversation of conversations) {
			const conversationId = conversation.id;

			try {
				await uow.withScopedTransaction(async (repo) => {
					const domainConversation = await repo.get(conversationId);
					domainConversation.requestDelete();
					await repo.save(domainConversation);
				});
				result.deletedCount++;
				result.deletedConversationIds.push(conversationId);
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : String(error);
				result.errors.push({ conversationId, error: errorMessage });
			}
		}

		return result;
	};
};
