import type { GraphContext } from '../../init/context.ts';
import type { Resolvers, Conversation } from '../builder/generated.ts';

const conversationResolvers: Resolvers = {
	Query: {
		conversations: (_parent, _args, context: GraphContext) => {
			console.log('conversations resolver called with context:', context);
			return [];
		},
		conversation: () => {
			console.log('conversation resolver called');
			return {} as Conversation;
		},
	},
	// Mutation: {
	// createConversation: (_: unknown, { sharerId, reserverId, listingId }: { sharerId: string, reserverId: string, listingId: string }) => {
	//   // Example usage to avoid unused parameter errors
	//   console.log('Creating conversation with:', { sharerId, reserverId, listingId });
	//   // TODO: Implement actual creation logic here
	// },
	// },
};

export default conversationResolvers;
