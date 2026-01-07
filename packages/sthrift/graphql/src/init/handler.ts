import { ApolloServer } from '@apollo/server';
import type { HttpHandler } from '@azure/functions';
import type { AppServicesHost, ApplicationServices, PrincipalHints } from '@sthrift/application-services';
import {
	type AzureFunctionsMiddlewareOptions,
    startServerAndCreateHandler,
    type WithRequired
} from './azure-functions.ts';
import type { GraphContext } from './context.ts';
import { combinedSchema } from '../schema/builder/schema-builder.ts';
import { applyMiddleware } from 'graphql-middleware';
import depthLimit from 'graphql-depth-limit';

// biome-ignore lint/complexity/useLiteralKeys: NODE_ENV is a standard environment variable
const isProduction = process.env['NODE_ENV'] === 'production';
const MAX_QUERY_DEPTH = 10;

export const graphHandlerCreator = (
	applicationServicesHost: AppServicesHost<ApplicationServices>,
): HttpHandler => {
	// Set up Apollo Server with security configurations
	// Note: Apollo Server v4 removed direct CORS support - CORS must be handled at the web framework level
	// https://www.apollographql.com/docs/apollo-server/migration/#cors-and-helmet
	// Azure Functions handles CORS through local.settings.json ("CORS": "*") for local dev
	// and through Azure Portal configuration for production deployments
	const securedSchema = applyMiddleware(combinedSchema);
	const server = new ApolloServer<GraphContext>({
		schema: securedSchema,
        allowBatchedHttpRequests: true,
		// Protection against nested query DoS attacks
		validationRules: [depthLimit(MAX_QUERY_DEPTH)],
		introspection: !isProduction,
	});
	const functionOptions: WithRequired<AzureFunctionsMiddlewareOptions<GraphContext>, 'context'> = {
		context: async ({ req }) => {
            const authHeader = req.headers.get('Authorization') ?? undefined;
            const hints: PrincipalHints = {
                memberId: req.headers.get('x-member-id') ?? undefined,
                communityId: req.headers.get('x-community-id') ?? undefined,
            };
            return {
                applicationServices: await applicationServicesHost.forRequest(authHeader, hints),
            };
		},
	};
	return startServerAndCreateHandler<GraphContext>(server, functionOptions);
};