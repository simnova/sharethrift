import type { GraphContext } from '../../../init/context.ts';
import type { Domain } from '@sthrift/domain';
import type {
	ConversationCreateInput,
	Resolvers,
} from '../../builder/generated.ts';
import {
	PopulateItemListingFromField,
	PopulatePersonalUserFromField,
} from '../../resolver-helper.ts';

const ConversationMutationResolver = async (
	getConversation: Promise<Domain.Contexts.Conversation.Conversation.ConversationEntityReference>,
) => {
	try {
		const conversation = await getConversation;
		// Return just the IDs for relational fields - GraphQL field resolvers will populate them
		const cleanConversation = {
			id: conversation.id,
			// biome-ignore lint/suspicious/noExplicitAny: Accessing internal props structure to get ObjectIds
			sharer: (conversation as any).props.doc.sharer,
			// biome-ignore lint/suspicious/noExplicitAny: Accessing internal props structure to get ObjectIds
			reserver: (conversation as any).props.doc.reserver,
			// biome-ignore lint/suspicious/noExplicitAny: Accessing internal props structure to get ObjectIds
			listing: (conversation as any).props.doc.listing,
			messagingConversationId: conversation.messagingConversationId,
			messages: conversation.messages || [],
			createdAt: conversation.createdAt,
			updatedAt: conversation.updatedAt,
			schemaVersion: conversation.schemaVersion,
		};
		return {
			status: { success: true },
			// biome-ignore lint/suspicious/noExplicitAny: GraphQL resolvers will properly populate this
			conversation: cleanConversation as any,
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
	Message: {
		authorId: (parent) => parent.authorId.valueOf(),
	},
	Conversation: {
		sharer: PopulatePersonalUserFromField('sharer'),
		reserver: PopulatePersonalUserFromField('reserver'),
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
