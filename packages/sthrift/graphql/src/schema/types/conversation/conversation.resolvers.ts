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
			try {
				const conversation = await context.applicationServices.Conversation.Conversation.create({
					sharerId: _args.input.sharerId,
					reserverId: _args.input.reserverId,
					listingId: _args.input.listingId,
				});
				return {
					status: { success: true },
					conversation,
				};
			} catch (error) {
				console.error('Conversation > Mutation  : ', error);
				const { message } = error as Error;
				return {
					status: { success: false, errorMessage: message },
				};
			}
		},
		sendMessage: async (
			_parent,
			_args: { input: SendMessageInput },
			context: GraphContext,
		) => {
			try {
				const verifiedJwt = context.applicationServices.verifiedUser?.verifiedJwt;
				if (!verifiedJwt) {
					throw new Error('User must be authenticated to send a message');
				}

				const currentUser = await getUserByEmail(verifiedJwt.email, context);
				if (!currentUser) {
					throw new Error('User not found');
				}

				const message = await context.applicationServices.Conversation.Conversation.sendMessage({
					conversationId: _args.input.conversationId,
					content: _args.input.content,
					authorId: currentUser.id,
				});
				return {
					status: { success: true },
					message,
				};
			} catch (error) {
				console.error('Conversation > SendMessage Mutation  : ', error);
				// Normalize error messages to avoid leaking internal implementation details
				const errorMessage = error instanceof Error ? error.message : 'Unknown error';
				const userSafeMessage = errorMessage.includes('not found')
					? 'Conversation not found'
					: errorMessage.includes('Not authorized') || errorMessage.includes('permission')
					? 'You do not have permission to send messages in this conversation'
					: errorMessage.includes('cannot be empty') || errorMessage.includes('exceeds')
					? errorMessage // Domain validation errors are safe to expose
					: 'Failed to send message. Please try again.'; // Generic fallback for unexpected errors
				
				return {
					status: { success: false, errorMessage: userSafeMessage },
				};
			}
		},
	},
};

export default conversation;
