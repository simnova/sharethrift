import { trace } from '@opentelemetry/api';
import type { GraphContext } from '../../../init/context.ts';
import type {
	ConversationCreateInput,
	SendMessageInput,
	Resolvers,
} from '../../builder/generated.ts';
import {
	PopulateItemListingFromField,
	PopulateUserFromField,
	getUserByEmail,
} from '../../resolver-helper.ts';

const tracer = trace.getTracer('conversation-resolvers');

/**
 * Normalizes error messages to user-safe format.
 * Prevents leaking internal implementation details to clients.
 */
function normalizeErrorMessage(errorMessage: string): string {
	if (errorMessage.includes('not found')) {
		return 'Conversation not found';
	}
	if (errorMessage.includes('Not authorized') || errorMessage.includes('permission')) {
		return 'You do not have permission to send messages in this conversation';
	}
	if (errorMessage.includes('cannot be empty') || errorMessage.includes('exceeds')) {
		// Domain validation errors are safe to expose
		return errorMessage;
	}
	// Generic fallback for unexpected errors
	return 'Failed to send message. Please try again.';
}

const conversation: Resolvers = {
	Message: {
		id: (parent) => parent.id,
		authorId: (parent) => parent.authorId.valueOf(),
		content: (parent) => parent.content.valueOf(),
		messagingMessageId: (parent) => parent.messagingMessageId.valueOf(),
	},
	Conversation: {
		sharer: PopulateUserFromField('sharer'),
		reserver: PopulateUserFromField('reserver'),
		listing: PopulateItemListingFromField('listing'),
	},
	Query: {
		conversationsByUser: async (_parent, _args, context: GraphContext) => {
			return await context.applicationServices.Conversation.Conversation.queryByUser(
				{ userId: _args.userId },
			);
		},
		conversation: async (_parent, _args, context: GraphContext) => {
			// todo : message will come from twilio service
			return await context.applicationServices.Conversation.Conversation.queryById(
				{ conversationId: _args.conversationId },
			);
		},
	},
	Mutation: {
		createConversation: async (
			_parent,
			_args: { input: ConversationCreateInput },
			context: GraphContext,
		) => {
			return await tracer.startActiveSpan('createConversation', async (span) => {
				try {
					span.setAttribute('input.sharerId', _args.input.sharerId);
					span.setAttribute('input.reserverId', _args.input.reserverId);
					span.setAttribute('input.listingId', _args.input.listingId);
					
					const conversation = await context.applicationServices.Conversation.Conversation.create({
						sharerId: _args.input.sharerId,
						reserverId: _args.input.reserverId,
						listingId: _args.input.listingId,
					});
					
					span.setAttribute('result.success', true);
					span.setAttribute('result.conversationId', conversation.id);
					span.end();
					
					return {
						status: { success: true },
						conversation,
					};
				} catch (error) {
					const { message } = error as Error;
					span.setAttribute('result.success', false);
					span.setAttribute('error.message', message);
					span.recordException(error as Error);
					span.end();
					
					return {
						status: { success: false, errorMessage: message },
					};
				}
			});
		},
		sendMessage: async (
			_parent,
			_args: { input: SendMessageInput },
			context: GraphContext,
		) => {
			return await tracer.startActiveSpan('sendMessage', async (span) => {
				try {
					span.setAttribute('input.conversationId', _args.input.conversationId);
					
					const verifiedJwt = context.applicationServices.verifiedUser?.verifiedJwt;
					if (!verifiedJwt) {
						throw new Error('User must be authenticated to send a message');
					}

					const currentUser = await getUserByEmail(verifiedJwt.email, context);
					if (!currentUser) {
						throw new Error('User not found');
					}

					span.setAttribute('user.id', currentUser.id);

					const message = await context.applicationServices.Conversation.Conversation.sendMessage({
						conversationId: _args.input.conversationId,
						content: _args.input.content,
						authorId: currentUser.id,
					});
					
					span.setAttribute('result.success', true);
					span.setAttribute('result.messageId', message.id);
					span.end();
					
					return {
						status: { success: true },
						message,
					};
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					const userSafeMessage = normalizeErrorMessage(errorMessage);
					
					span.setAttribute('result.success', false);
					span.setAttribute('error.message', errorMessage);
					span.setAttribute('error.userMessage', userSafeMessage);
					span.recordException(error as Error);
					span.end();
					
					return {
						status: { success: false, errorMessage: userSafeMessage },
					};
				}
			});
		},
	},
};

export default conversation;
