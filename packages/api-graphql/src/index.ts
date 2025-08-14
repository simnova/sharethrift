import { ApolloServer, type BaseContext } from '@apollo/server';
import type { HttpHandler } from '@azure/functions-v4';
import type {
	ApplicationServices,
	ApplicationServicesFactory,
	PrincipalHints,
} from '@ocom/api-application-services';
import type { ApiContextSpec } from '@ocom/api-context-spec';
import {
	type AzureFunctionsMiddlewareOptions,
	startServerAndCreateHandler,
	type WithRequired,
} from './azure-functions.ts';
import { itemListingResolvers, itemListingTypeDefs } from './item-listing.resolvers.ts';

// The GraphQL schema
const typeDefs = `#graphql
  type Community {
    id: String
    name: String
    createdBy: EndUser
  } 

  type EndUser {
    id: String
    displayName: String
  }

  type Query {
    hello: String
  }

  input CommunityCreateInput {
    name: String!
    createdByEndUserId: String!
  }

  type Mutation {
    communityCreate(input: CommunityCreateInput!): Community
  }

  ${itemListingTypeDefs}
`;

interface GraphContext extends BaseContext {
	applicationServices: ApplicationServices;
	apiContext?: ApiContextSpec;
}
// A map of functions which return data for the schema.
const resolvers = {
	Query: {
		hello: (_parent: unknown, _args: unknown, context: GraphContext) => {
			return `world${JSON.stringify(context)}`;
		},
		...itemListingResolvers.Query,
	},
	Mutation: {},
	ItemListing: itemListingResolvers.ItemListing,
};

export const graphHandlerCreator = (
	applicationServicesFactory: ApplicationServicesFactory,
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
			const authHeader = req.headers.get('Authorization') ?? undefined;
			const hints: PrincipalHints = {
				memberId: req.headers.get('x-member-id') ?? undefined,
				communityId: req.headers.get('x-community-id') ?? undefined,
			};
			const applicationServices = await applicationServicesFactory.forRequest(
				authHeader,
				hints,
			);
			return Promise.resolve({
				applicationServices,
				apiContext: applicationServices.context, // Use the context from application services
			});
		},
	};
	return startServerAndCreateHandler<GraphContext>(server, functionOptions);
};
