import { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import type { IMessagingService, MessageInstance } from '@cellix/messaging';
import { ObjectId } from 'bson';

export interface ConversationQueryByUserCommand {
	userId: string;
	fields?: string[];
}

/**
 * Query conversations by user with real-time Twilio message enrichment
 * 
 * Data Flow:
 * 1. Fetch conversation metadata from MongoDB (sharer, reserver, listing, twilioConversationId)
 * 2. For each conversation, fetch the latest messages from Twilio API (real-time)
 * 3. Convert Twilio messages to domain Message entities
 * 4. Enrich the conversation entity with fresh messages
 */
export const queryByUser = (dataSources: DataSources, messagingService: IMessagingService) => {
	return async (
		command: ConversationQueryByUserCommand,
	): Promise<
		Domain.Contexts.Conversation.Conversation.ConversationEntityReference[]
	> => {
		// Step 1: Get conversations from MongoDB (business metadata)
		const mongoConversations = await dataSources.readonlyDataSource.Conversation.Conversation.ConversationReadRepo.getByUser(
			command.userId,
			{ fields: command.fields },
		);
		
		// Step 2: Enrich each conversation with real-time Twilio messages
		return await Promise.all(
			mongoConversations.map(async (conversation) => {
				try {
					// Fetch fresh messages from Twilio
					const twilioMessages = await messagingService.getMessages(
						conversation.twilioConversationId
					);
					
					console.log(`[Conversation ${conversation.id}] Fetched ${twilioMessages.length} messages from Twilio`);
					
					// Convert Twilio messages to domain Message entities
					const domainMessages = twilioMessages.map((twilioMsg: MessageInstance) => {
						const twilioMessageSid = new Domain.Contexts.Conversation.Conversation.TwilioMessageSid(
							twilioMsg.sid,
						);
						const content = new Domain.Contexts.Conversation.Conversation.MessageContent(
							twilioMsg.body,
						);

						// Map Twilio author to user ObjectId
						// Twilio author can be user ID or email - try to match to sharer or reserver
						let authorId: ObjectId;
						if (twilioMsg.author) {
							// Try to match author to sharer
							if (twilioMsg.author === conversation.sharer.id || 
							    twilioMsg.author === conversation.sharer.account.email) {
								authorId = new ObjectId(conversation.sharer.id) as unknown as ObjectId;
							} 
							// Try to match author to reserver
							else if (twilioMsg.author === conversation.reserver.id || 
							         twilioMsg.author === conversation.reserver.account.email) {
								authorId = new ObjectId(conversation.reserver.id) as unknown as ObjectId;
							} 
							// Unknown author, default to sharer
							else {
								console.warn(`[Conversation ${conversation.id}] Unknown author "${twilioMsg.author}", defaulting to sharer`);
								authorId = new ObjectId(conversation.sharer.id) as unknown as ObjectId;
							}
						} else {
							// No author specified, default to sharer
							authorId = new ObjectId(conversation.sharer.id) as unknown as ObjectId;
						}

						return new Domain.Contexts.Conversation.Conversation.Message({
							id: twilioMsg.sid,
							twilioMessageSid,
							authorId,
							content,
							createdAt: twilioMsg.dateCreated ?? new Date(),
						});
					});
					
					// Note: We're creating a new object with updated messages
					// This is safe because we're returning a new enriched view of the data
					return {
						...conversation,
						messages: domainMessages,
						loadMessages: async () => domainMessages,
					};
				} catch (error) {
					console.warn(`[Conversation ${conversation.id}] Failed to fetch Twilio messages, using MongoDB fallback:`, error);
					return conversation;
				}
			})
		);
	};
};
