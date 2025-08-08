import { ApolloServer } from '@apollo/server';
import {
	startServerAndCreateHandler,
	type AzureFunctionsMiddlewareOptions,
} from './azure-functions.ts';
import type { HttpHandler } from '@azure/functions-v4';
import type { ApiContextSpec } from '@ocom/api-context-spec';
import { reservationTypeDefs, reservationResolvers, type GraphContext } from './resolvers/reservation.resolvers.ts';

// The base GraphQL schema
const baseTypeDefs = `#graphql
  type Query {
    hello: String
  }

  type Mutation {
    _empty: String
  }
`;

// Combine all type definitions
const typeDefs = [baseTypeDefs, reservationTypeDefs];

// Base resolvers
const baseResolvers = {
	Query: {
		hello: (_parent: unknown, _args: unknown, context: GraphContext) =>
			`world${JSON.stringify(context.apiContext)}`,
	},
	Mutation: {
		_empty: () => null,
	},
};

// Combine all resolvers
const resolvers = [baseResolvers, reservationResolvers];

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
			return Promise.resolve({
				apiContext: apiContext,
			});
		},
	};
	return startServerAndCreateHandler(server, functionOptions);
};
