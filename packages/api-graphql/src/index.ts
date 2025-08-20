import { ApolloServer } from '@apollo/server';
import type { HttpHandler } from '@azure/functions-v4';
import type { ApiContextSpec } from '@sthrift/api-context-spec';
import {
	type AzureFunctionsMiddlewareOptions,
	startServerAndCreateHandler,
	type WithRequired,
} from './azure-functions.ts';
import { combineSchemas } from './schema/schema-loader.ts';
import { resolvers } from './schema/resolvers.ts';
import { buildGraphContext, type GraphContext } from './context.ts';

// Load and combine GraphQL schemas
const typeDefs = combineSchemas(
	'personal-user',
	'conversation'
);

export const graphHandlerCreator = (
	// biome-ignore lint/suspicious/noExplicitAny: Request typing is complex for Azure Functions
	apiContextFactory: (req: any) => Promise<ApiContextSpec>,
): HttpHandler => {
	// Set up Apollo Server
	const server = new ApolloServer<GraphContext>({
		typeDefs,
		resolvers,
	});
	
	const functionOptions: WithRequired<
		AzureFunctionsMiddlewareOptions<GraphContext>,
		'context'
	> = {
		context: async ({ req }) => {
			try {
				const apiContext = await apiContextFactory(req);
				return buildGraphContext({ ...req, apiContext });
			} catch (error) {
				console.error('Failed to build GraphQL context:', error);
				throw new Error('Failed to initialize API context');
			}
		},
	};
	
	return startServerAndCreateHandler<GraphContext>(server, functionOptions);
};
