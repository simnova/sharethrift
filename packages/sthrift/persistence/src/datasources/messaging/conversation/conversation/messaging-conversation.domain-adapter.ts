import type { MessageInstance } from '@cellix/messaging-service';
import { Domain } from '@sthrift/domain';

export function toDomainMessage(
	messagingMessage: MessageInstance,
	authorId: Domain.Contexts.Conversation.Conversation.AuthorId,
): Domain.Contexts.Conversation.Conversation.MessageEntityReference {
	// biome-ignore lint/complexity/useLiteralKeys: metadata is an index signature requiring bracket notation
	const messagingId =
		(messagingMessage.metadata?.['originalSid'] as string) ||
		messagingMessage.id;

	const messagingMessageId =
		new Domain.Contexts.Conversation.Conversation.MessagingMessageId(
			messagingId,
		);
	const contents =
		new Domain.Contexts.Conversation.Conversation.MessageContents([
			messagingMessage.body,
		]);

	return new Domain.Contexts.Conversation.Conversation.Message({
		id: messagingMessage.id,
		messagingMessageId,
		authorId,
		contents,
		createdAt: messagingMessage.createdAt ?? new Date(),
	});
}
