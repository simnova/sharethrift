// Main GraphQL handler factory for CellixJS

import { ApolloServer } from '@apollo/server';
import { startServerAndCreateAzureFunctionHandler } from './azure-functions.js';
import { conversationResolvers } from './schema/resolvers/conversation.resolvers.ts';
import { buildGraphContext } from './context.js';

// Placeholder for GraphQL typeDefs
const conversationTypeDefs = `
  type Query {
    conversations: [String]
  }
`;

import type { GraphContext } from './context.js';

const server = new ApolloServer<GraphContext>({
  typeDefs: conversationTypeDefs,
  resolvers: conversationResolvers,
});

export const graphHandlerCreator = startServerAndCreateAzureFunctionHandler<GraphContext>(server, buildGraphContext);
