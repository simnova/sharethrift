import { Domain } from '@sthrift/domain';
import type {
	ConversationInstance,
	MessageInstance,
} from '@cellix/messaging';
import { ObjectId } from 'bson';

/**
 * Adapter to convert messaging API responses to Domain entities
 * This bridges the gap between external messaging service data structure and internal domain models
 */

/**
 * Convert messaging conversation response to domain Conversation props
 * Note: This creates a simplified adapter that can be used to construct domain entities
 */
export function toDomainConversationProps(
		messagingConversation: ConversationInstance,
		sharer: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
		reserver: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
		listing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
		messages: Domain.Contexts.Conversation.Conversation.MessageEntityReference[],
	): Domain.Contexts.Conversation.Conversation.ConversationProps {

		const messagingId = (messagingConversation.metadata?.['originalSid'] as string) || messagingConversation.id;
		
		return {
			id: messagingConversation.id,
			sharer,
			loadSharer: async () => sharer,
			reserver,
			loadReserver: async () => reserver,
			listing,
			loadListing: async () => listing,
			messagingConversationId: messagingId,
			messages,
			loadMessages: async () => messages,
			createdAt: messagingConversation.createdAt ?? new Date(),
			updatedAt: messagingConversation.updatedAt ?? new Date(),
			schemaVersion: '1.0.0',
		};
	}

export function toDomainMessage(
		messagingMessage: MessageInstance,
		authorId: ObjectId,
	): Domain.Contexts.Conversation.Conversation.MessageEntityReference {
		const messagingId = (messagingMessage.metadata?.['originalSid'] as string) || messagingMessage.id;
		
		const messagingMessageId = new Domain.Contexts.Conversation.Conversation.MessagingMessageId(
			messagingId,
		);
		const content = new Domain.Contexts.Conversation.Conversation.MessageContent(
			messagingMessage.body,
		);

		return new Domain.Contexts.Conversation.Conversation.Message({
			id: messagingMessage.id,
			messagingMessageId,
			authorId,
			content,
			createdAt: messagingMessage.createdAt ?? new Date(),
		});
	}

export function toDomainMessages(
	messagingMessages: MessageInstance[],
	authorIdMap: Map<string, ObjectId>,
): Domain.Contexts.Conversation.Conversation.MessageEntityReference[] {
	return messagingMessages.map((msg) => {
		const authorId = msg.author
			? (authorIdMap.get(msg.author) ?? new ObjectId())
			: new ObjectId();
		return toDomainMessage(msg, authorId);
	});
}
