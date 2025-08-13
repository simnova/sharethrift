import { ApolloServer, type BaseContext } from '@apollo/server';
import {
	startServerAndCreateHandler,
	type AzureFunctionsMiddlewareOptions,
} from './azure-functions.ts';
import type { HttpHandler } from '@azure/functions-v4';
import type { ApiContextSpec } from '@ocom/api-context-spec';
import { itemListingResolvers, itemListingTypeDefs } from './item-listing.resolvers.ts';

// The GraphQL schema
const typeDefs = `#graphql
  type Query {
    hello: String
  }
  
  ${itemListingTypeDefs}
`;

interface GraphContext extends BaseContext {
	apiContext?: ApiContextSpec;
}

// A map of functions which return data for the schema.
const resolvers = {
	Query: {
		hello: (_parent: unknown, _args: unknown, context: GraphContext) =>
			`world${JSON.stringify(context.apiContext)}`,
		...itemListingResolvers.Query,
	},
	ItemListing: itemListingResolvers.ItemListing,
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
			return Promise.resolve({
				apiContext: apiContext,
			});
		},
	};
	return startServerAndCreateHandler(server, functionOptions);
};
