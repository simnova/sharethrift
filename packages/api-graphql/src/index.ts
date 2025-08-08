import { ApolloServer, type BaseContext } from '@apollo/server';
import {
	startServerAndCreateHandler,
	type AzureFunctionsMiddlewareOptions,
} from './azure-functions.ts';
import type { HttpHandler } from '@azure/functions-v4';
import type { ApiContextSpec } from '@ocom/api-context-spec';
import type { Domain } from '@ocom/api-domain';
import { ConversationsService } from './conversations/conversations.service.js';
import { 
  conversationResolvers, 
  messageResolvers, 
  queryResolvers, 
  mutationResolvers 
} from './conversations/conversations.resolvers.js';

// The GraphQL schema
const typeDefs = `#graphql
  type Query {
    hello: String
    getUserConversations(userId: ID!): [Conversation!]!
    getConversationMessages(conversationId: ID!, limit: Int, offset: Int): [Message!]!
  }

  type Mutation {
    createConversation(input: CreateConversationInput!): Conversation!
    sendMessage(input: SendMessageInput!): Message!
  }

  type Conversation {
    id: ID!
    twilioConversationSid: String!
    listingId: ID!
    participants: [ID!]!
    createdAt: String!
    updatedAt: String!
  }

  type Message {
    id: ID!
    twilioMessageSid: String!
    conversationId: ID!
    authorId: ID!
    content: String!
    createdAt: String!
  }

  input CreateConversationInput {
    listingId: ID!
    participantIds: [ID!]!
  }

  input SendMessageInput {
    conversationId: ID!
    content: String!
    authorId: ID!
  }
`;

interface GraphContext extends BaseContext {
	apiContext?: ApiContextSpec;
	conversationsService?: ConversationsService;
}

// A map of functions which return data for the schema.
const resolvers = {
	Query: {
		hello: (_parent: unknown, _args: unknown, context: GraphContext) =>
			`world${JSON.stringify(context.apiContext)}`,
		...queryResolvers,
	},
	Mutation: {
		...mutationResolvers,
	},
	Conversation: conversationResolvers,
	Message: messageResolvers,
};

export const graphHandlerCreator = (
	apiContext: ApiContextSpec,
): HttpHandler => {
	// Set up Apollo Server
	const server = new ApolloServer<GraphContext>({
		typeDefs,
		resolvers,
	});
	const functionOptions: AzureFunctionsMiddlewareOptions<GraphContext> = {
		context: () => {
			// TODO: Get conversationUnitOfWork from apiContext.domainDataSource
			// For now, we'll need to implement the actual data source integration
			const conversationsService = new ConversationsService(
				// This needs to be connected to the actual UOW implementation
				null as unknown as Domain.Contexts.ConversationUnitOfWork // Placeholder - will be implemented when we add the data layer
			);
			
			return Promise.resolve({
				apiContext: apiContext,
				conversationsService,
			});
		},
	};
	return startServerAndCreateHandler(server, functionOptions);
};
