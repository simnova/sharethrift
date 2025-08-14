import { ApolloServer, type BaseContext } from '@apollo/server';
import type { HttpHandler } from '@azure/functions-v4';
import type {
	ApplicationServices,
	ApplicationServicesFactory,
	PrincipalHints,
} from '@ocom/api-application-services';
import {
	type AzureFunctionsMiddlewareOptions,
	startServerAndCreateHandler,
	type WithRequired,
} from './azure-functions.ts';

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

  type Location {
    address1: String!
    address2: String
    city: String!
    state: String!
    country: String!
    zipCode: String!
  }

  type Billing {
    subscriptionId: String
    cybersourceCustomerId: String
  }

  type Profile {
    firstName: String!
    lastName: String!
    location: Location!
    billing: Billing
  }

  type Account {
    accountType: String!
    email: String!
    username: String!
    profile: Profile!
  }

  type User {
    id: ID!
    userType: String!
    isBlocked: Boolean!
    account: Account!
    schemaVersion: String!
    createdAt: String!
    updatedAt: String!
  }

  input LocationInput {
    address1: String!
    address2: String
    city: String!
    state: String!
    country: String!
    zipCode: String!
  }

  input BillingInput {
    subscriptionId: String
    cybersourceCustomerId: String
  }

  input ProfileInput {
    firstName: String!
    lastName: String!
    location: LocationInput!
    billing: BillingInput
  }

  input AccountInput {
    accountType: String!
    email: String!
    username: String!
    profile: ProfileInput!
  }

  input UserCreateInput {
    userType: String!
    account: AccountInput!
  }

  input UserUpdateInput {
    firstName: String
    lastName: String
    location: LocationInput
    billing: BillingInput
  }

  type Query {
    hello: String
    user(id: ID!): User
    userByEmail(email: String!): User
    userByUsername(username: String!): User
    users(limit: Int, offset: Int): [User!]!
  }

  input CommunityCreateInput {
    name: String!
    createdByEndUserId: String!
  }

  type Mutation {
    communityCreate(input: CommunityCreateInput!): Community
    userCreate(input: UserCreateInput!): User
    userUpdate(id: ID!, input: UserUpdateInput!): User
    userBlock(id: ID!): User
    userUnblock(id: ID!): User
  }
`;

interface GraphContext extends BaseContext {
	applicationServices: ApplicationServices;
}
// A map of functions which return data for the schema.
const resolvers = {
	Query: {
		hello: (_parent: unknown, _args: unknown, context: GraphContext) => {
			return `world${JSON.stringify(context)}`;
		},
	},
	Mutation: {},
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
			return Promise.resolve({
				applicationServices: await applicationServicesFactory.forRequest(
					authHeader,
					hints,
				),
			});
		},
	};
	return startServerAndCreateHandler<GraphContext>(server, functionOptions);
};
