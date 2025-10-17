import { ApolloServer } from '@apollo/server';
import type { HttpHandler } from '@azure/functions';
import type { ApplicationServicesFactory, PrincipalHints } from '@sthrift/application-services';
import {
	type AzureFunctionsMiddlewareOptions,
    startServerAndCreateHandler,
    type WithRequired
} from './azure-functions.ts';
import type { GraphContext } from './context.ts';
import { combinedSchema } from '../schema/builder/schema-builder.ts';
import { applyMiddleware } from 'graphql-middleware';
import type { GraphQLSchemaWithFragmentReplacements } from 'graphql-middleware/types';

const serverConfig = (securedSchema: GraphQLSchemaWithFragmentReplacements) => {
	return {
		schema: securedSchema,
        cors: {
            origin: true,
            credentials: true,
        },
        allowBatchedHttpRequests: true,
	};
};

// Accept the framework's AppHost type but cast to our extended ApplicationServicesFactory
export const graphHandlerCreator = (
	applicationServicesHost: { forRequest(rawAuthHeader?: string, hints?: unknown): Promise<unknown> },
): HttpHandler => {
	// Cast to our extended interface that includes forSystem()
	const applicationServicesFactory = applicationServicesHost as ApplicationServicesFactory;
	// Set up Apollo Server
    const securedSchema = applyMiddleware(combinedSchema);
	const server = new ApolloServer<GraphContext>({
        ...serverConfig(securedSchema)
	});
	const functionOptions: WithRequired<AzureFunctionsMiddlewareOptions<GraphContext>, 'context'> = {
		context: async ({ req }) => {
            const authHeader = req.headers.get('Authorization') ?? undefined;
            const hints: PrincipalHints = {
                memberId: req.headers.get('x-member-id') ?? undefined,
                communityId: req.headers.get('x-community-id') ?? undefined,
            };
            return Promise.resolve({
                applicationServices: await applicationServicesFactory.forRequest(authHeader, hints),
                systemApplicationServices: applicationServicesFactory.forSystem(),
            });
		},
	};
	return startServerAndCreateHandler<GraphContext>(server, functionOptions);
};