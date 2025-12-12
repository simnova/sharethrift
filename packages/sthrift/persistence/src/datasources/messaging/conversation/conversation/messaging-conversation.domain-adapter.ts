import { Domain } from '@sthrift/domain';
import type {
	MessageInstance,
} from '@cellix/messaging-service';

export function toDomainMessage(
		messagingMessage: MessageInstance,
		authorId: Domain.Contexts.Conversation.Conversation.AuthorId,
	): Domain.Contexts.Conversation.Conversation.MessageEntityReference {
		// biome-ignore lint/complexity/useLiteralKeys: metadata is an index signature requiring bracket notation
		const messagingId = (messagingMessage.metadata?.["originalSid"] as string) || messagingMessage.id;
		
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
