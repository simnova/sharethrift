import { personalUserResolvers } from './resolvers/personal-user.resolvers.ts';
import { conversationResolvers } from './resolvers/conversation.resolvers.ts';

/**
 * Combine multiple resolver objects into one
 */
// biome-ignore lint/suspicious/noExplicitAny: Apollo Server resolver types are complex
export function combineResolvers(...resolverObjects: any[]): any {
  // biome-ignore lint/suspicious/noExplicitAny: Apollo Server resolver types are complex
  const combined: any = {
    Query: {},
    Mutation: {}
  };

  for (const resolvers of resolverObjects) {
    if (resolvers.Query) {
      Object.assign(combined.Query, resolvers.Query);
    }
    if (resolvers.Mutation) {
      Object.assign(combined.Mutation, resolvers.Mutation);
    }
    // Handle other types (like custom scalar resolvers, etc.)
    for (const [key, value] of Object.entries(resolvers)) {
      if (key !== 'Query' && key !== 'Mutation') {
        combined[key] = value;
      }
    }
  }

  return combined;
}

// Export the combined resolvers
export const resolvers = combineResolvers(
  personalUserResolvers,
  conversationResolvers
);