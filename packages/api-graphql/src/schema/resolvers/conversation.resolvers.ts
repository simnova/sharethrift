import type { GraphContext } from "../../context.ts";

export const conversationResolvers = {
  Query: {
    conversations: (_parent: unknown, _args: unknown, context: GraphContext) => {
        console.log('conversations resolver called with context:', context);
      return [];
    },
    conversation: () => {
      console.log('conversations resolver called');
      return [];
    }
  },
  Mutation: {
    createConversation: (_: unknown, { sharerId, reserverId, listingId }: { sharerId: string, reserverId: string, listingId: string }) => {
      // Example usage to avoid unused parameter errors
      console.log('Creating conversation with:', { sharerId, reserverId, listingId });
      // TODO: Implement actual creation logic here
    },
  },
};
