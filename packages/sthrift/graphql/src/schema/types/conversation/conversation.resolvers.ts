import type { GraphContext } from '../../../init/context.ts';
import type {
	ConversationCreateInput,
	Resolvers,
	SendMessageInput,
} from '../../builder/generated.ts';
import {
	getUserByEmail,
	PopulateItemListingFromField,
	PopulateUserFromField,
} from '../../resolver-helper.ts';

const conversation: Resolvers = {
	Message: {
		id: (parent) => parent.id,
		authorId: (parent) => parent.authorId.valueOf(),
		content: (parent) => parent.contents.valueOf().join('\n\n'),
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
				const conversation =
					await context.applicationServices.Conversation.Conversation.create({
						sharerId: _args.input.sharerId,
						reserverId: _args.input.reserverId,
						listingId: _args.input.listingId,
					});

				return {
					status: { success: true },
					conversation,
				};
			} catch (error) {
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
				const verifiedJwt =
					context.applicationServices.verifiedUser?.verifiedJwt;
				if (!verifiedJwt) {
					throw new Error('User must be authenticated to send a message');
				}

				const currentUser = await getUserByEmail(verifiedJwt.email, context);
				if (!currentUser) {
					throw new Error('User not found');
				}

				const message =
					await context.applicationServices.Conversation.Conversation.sendMessage(
						{
							conversationId: _args.input.conversationId,
							messageContents: [_args.input.content],
							authorId: currentUser.id,
						},
					);

				return {
					status: { success: true },
					message,
				};
			} catch (error) {
				const { message } = error as Error;
				return {
					status: { success: false, errorMessage: message },
				};
			}
		},
	},
};

export default conversation;
