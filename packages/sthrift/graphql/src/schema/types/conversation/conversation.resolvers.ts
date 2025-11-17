import type { GraphContext } from '../../../init/context.ts';
import type {
	ConversationCreateInput,
	Resolvers,
} from '../../builder/generated.ts';

const conversation: Resolvers = {
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
	},
};

export default conversation;
