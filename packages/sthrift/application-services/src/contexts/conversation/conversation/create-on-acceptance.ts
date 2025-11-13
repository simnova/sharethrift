import { trace } from '@opentelemetry/api';
import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

const tracer = trace.getTracer('sthrift-application-services');

export interface ConversationCreateOnAcceptanceCommand {
	reservationRequestId: string;
	listingId: string;
	sharerId: string;
	reserverId: string;
}

export const createOnAcceptance = (dataSources: DataSources) => {
	return async (
		command: ConversationCreateOnAcceptanceCommand,
	): Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null> => {
		return await tracer.startActiveSpan(
			'conversation.createOnAcceptance',
			async (span) => {
				try {
					span.setAttributes({
						'reservation.request.id': command.reservationRequestId,
						'listing.id': command.listingId,
						'sharer.id': command.sharerId,
						'reserver.id': command.reserverId,
					});

					// Check if conversation already exists
					let existingConversation: Domain.Contexts.Conversation.Conversation.ConversationEntityReference | null =
						null;

					await dataSources.domainDataSource.Conversation.Conversation.ConversationUnitOfWork.withScopedTransaction(
						async (repo) => {
							existingConversation = await repo.getByIdWithSharerReserver(
								command.sharerId,
								command.reserverId,
							);
						},
					);

					if (existingConversation) {
						const conversationId = (
							existingConversation as Domain.Contexts.Conversation.Conversation.ConversationEntityReference
						).id;
						console.log(
							`Conversation already exists: ${conversationId} for sharer ${command.sharerId} and reserver ${command.reserverId}`,
						);
						span.setAttribute('conversation.exists', true);
						span.setAttribute('conversation.id', conversationId);
						return existingConversation;
					}

					// Load required entities
					const [sharerOrNull, reserverOrNull, listingOrNull] =
						await Promise.all([
							dataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getById(
								command.sharerId,
							),
							dataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getById(
								command.reserverId,
							),
							dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getById(
								command.listingId,
							),
						]);

					if (!sharerOrNull || !reserverOrNull || !listingOrNull) {
						const error = new Error(
							'Failed to create conversation: missing entities',
						);
						span.recordException(error);
						console.error(error.message, {
							hasSharer: !!sharerOrNull,
							hasReserver: !!reserverOrNull,
							hasListing: !!listingOrNull,
						});
						return null;
					}

					// Type narrowing after null check
					const sharer = sharerOrNull;
					const reserver = reserverOrNull;
					const listing = listingOrNull;

					// Create conversation
					let conversation:
						| Domain.Contexts.Conversation.Conversation.ConversationEntityReference
						| undefined;

					await dataSources.domainDataSource.Conversation.Conversation.ConversationUnitOfWork.withScopedTransaction(
						async (repo) => {
							const newConversation = await repo.getNewInstance(
								sharer,
								reserver,
								listing,
							);

							// Create in messaging service if available
							if (dataSources.messagingDataSource) {
								try {
									const displayName = `${listing.title} - ${sharer.account.profile.firstName} & ${reserver.account.profile.firstName}`;
									const uniqueId = `${listing.id}-${sharer.id}-${reserver.id}`;

									const messagingConversation =
										await dataSources.messagingDataSource.Conversation.Conversation.MessagingConversationRepo.createConversation(
											displayName,
											uniqueId,
										);

									newConversation.messagingConversationId =
										messagingConversation.id;

									span.setAttribute(
										'messaging.conversation.id',
										messagingConversation.id,
									);
								} catch (error) {
									span.recordException(error as Error);
									console.error(
										'Failed to create messaging conversation:',
										error,
									);
									// Continue without messaging service integration
								}
							}

							conversation = await repo.save(newConversation);
							span.setAttribute('conversation.created', true);
							span.setAttribute('conversation.id', conversation.id);
						},
					);

					if (!conversation) {
						throw new Error('Failed to persist conversation');
					}

					console.log(
						`Created conversation ${conversation.id} for reservation request ${command.reservationRequestId}`,
					);

					return conversation;
				} catch (error) {
					span.recordException(error as Error);
					console.error('Error creating conversation on acceptance:', error);
					// Don't throw - conversation creation failure shouldn't block acceptance
					return null;
				} finally {
					span.end();
				}
			},
		);
	};
};
