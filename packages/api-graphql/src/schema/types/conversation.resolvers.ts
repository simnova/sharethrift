import type { GraphContext } from '../../init/context.ts';
import type { Domain } from '@sthrift/api-domain';
import type {
	ConversationCreateInput,
	Resolvers,
} from '../builder/generated.ts';

const ConversationMutationResolver = async (
	getConversation: Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference>,
) => {
	try {
		return {
			status: { success: true },
			conversation: await getConversation,
		};
	} catch (error) {
		console.error('Conversation > Mutation  : ', error);
		const { message } = error as Error;
		return {
			status: { success: false, errorMessage: message },
		};
	}
};

const conversation: Resolvers = {
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
			return await ConversationMutationResolver(
				context.applicationServices.Conversation.Conversation.create({
					sharerId: _args.input.sharerId,
					reserverId: _args.input.reserverId,
					listingId: _args.input.listingId,
				}),
			);
		},
	},
};

export default conversation;
