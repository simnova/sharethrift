import { ApolloServer, type BaseContext } from '@apollo/server';
import type { HttpHandler } from '@azure/functions-v4';
import type { ApiContextSpec } from '@ocom/api-context-spec';
import type { Domain } from '@ocom/api-domain';
import {
  startServerAndCreateHandler,
  type AzureFunctionsMiddlewareOptions,
} from './azure-functions.ts';
import type { WithRequired } from '@apollo/utils.withrequired';

// The GraphQL schema
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

interface GraphContext extends BaseContext {
	domainDataSourceFromJwt: ReturnType<ApiContextSpec['domainDataSourceFromJwt']>;
}

// A map of functions which return data for the schema.
const resolvers = {
	Query: {
		hello: (_parent: unknown, _args: unknown, context: GraphContext) => {
			return `world${JSON.stringify(context)}`;
        }
	},
};

export const graphHandlerCreator = (
	apiContext: ApiContextSpec,
): HttpHandler => {
	// Set up Apollo Server
	const server = new ApolloServer<GraphContext>({
		typeDefs,
		resolvers,
	});
  
const functionOptions: WithRequired<AzureFunctionsMiddlewareOptions<GraphContext>, "context"> = {
		context: async ({ req }) => {
            const result = await apiContext.tokenValidationService.verifyJwt<Domain.Types.VerifiedJwt>(req.headers.get('Authorization') as string);
            return Promise.resolve({
                domainDataSourceFromJwt: apiContext.domainDataSourceFromJwt(result?.verifiedJwt ?? null),
            });
		},
	};
	return startServerAndCreateHandler(server, functionOptions);
};
