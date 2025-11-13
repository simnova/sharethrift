import { Domain } from '@sthrift/domain';
import type {
	ConversationInstance,
	MessageInstance,
} from '@cellix/messaging-service';

export function toDomainConversationProps(
		messagingConversation: ConversationInstance,
		sharer: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
		reserver: Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
		listing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
		messages: Domain.Contexts.Conversation.Conversation.MessageEntityReference[],
	): Domain.Contexts.Conversation.Conversation.ConversationProps {
		// biome-ignore lint/complexity/useLiteralKeys: TypeScript requires bracket notation for index signature
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
		authorId: Domain.Contexts.Conversation.Conversation.AuthorId,
	): Domain.Contexts.Conversation.Conversation.MessageEntityReference {
		// biome-ignore lint/complexity/useLiteralKeys: TypeScript requires bracket notation for index signature
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
	authorIdMap: Map<string, Domain.Contexts.Conversation.Conversation.AuthorId>,
): Domain.Contexts.Conversation.Conversation.MessageEntityReference[] {
	return messagingMessages.map((msg) => {
		const authorId = msg.author
			? (authorIdMap.get(msg.author) ?? new Domain.Contexts.Conversation.Conversation.AuthorId(Domain.Contexts.Conversation.Conversation.ANONYMOUS_AUTHOR_ID))
			: new Domain.Contexts.Conversation.Conversation.AuthorId(Domain.Contexts.Conversation.Conversation.ANONYMOUS_AUTHOR_ID);
		return toDomainMessage(msg, authorId);
	});
}
