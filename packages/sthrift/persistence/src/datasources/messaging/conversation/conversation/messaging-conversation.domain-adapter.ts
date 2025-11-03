import { Domain } from '@sthrift/domain';
import type {
	MessagingConversationResponse,
	MessagingMessageResponse,
} from './messaging-conversation.types.ts';
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
		messagingConversation: MessagingConversationResponse,
		sharer: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
		reserver: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
		listing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
		messages: Domain.Contexts.Conversation.Conversation.MessageEntityReference[],
	): Domain.Contexts.Conversation.Conversation.ConversationProps {

		const messagingId = messagingConversation.metadata?.originalSid || messagingConversation.id;
		
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
			createdAt: new Date(messagingConversation.createdAt),
			updatedAt: new Date(messagingConversation.updatedAt),
			schemaVersion: '1.0.0',
		};
	}

export function toDomainMessage(
		messagingMessage: MessagingMessageResponse,
		authorId: ObjectId,
	): Domain.Contexts.Conversation.Conversation.MessageEntityReference {
		const messagingId = messagingMessage.metadata?.originalSid || messagingMessage.id;
		
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
			createdAt: new Date(messagingMessage.createdAt),
		});
	}

export function toDomainMessages(
	messagingMessages: MessagingMessageResponse[],
	authorIdMap: Map<string, ObjectId>,
): Domain.Contexts.Conversation.Conversation.MessageEntityReference[] {
	return messagingMessages.map((msg) => {
		const authorId = msg.author
			? (authorIdMap.get(msg.author) ?? new ObjectId())
			: new ObjectId();
		return toDomainMessage(msg, authorId);
	});
}
