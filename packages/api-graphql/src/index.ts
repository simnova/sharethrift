import { ApolloServer, type BaseContext } from '@apollo/server';
import {
	startServerAndCreateHandler,
	type AzureFunctionsMiddlewareOptions,
} from './azure-functions.ts';
import type { HttpHandler } from '@azure/functions-v4';
import type { ApiContextSpec } from '@ocom/api-context-spec';
import { reservationsResolvers } from './reservations.resolvers.ts';

// The GraphQL schema
const typeDefs = `#graphql
  type Query {
    hello: String
    myReservations(userId: ID!): [ReservationRequest!]!
  }

  type Mutation {
    cancelReservation(id: ID!): ReservationRequest
    closeReservation(id: ID!): ReservationRequest
  }

  type ReservationRequest {
    id: ID!
    state: ReservationRequestState!
    reservationPeriodStart: String!
    reservationPeriodEnd: String!
    createdAt: String!
    updatedAt: String!
    listingId: ID!
    reserverId: ID!
    closeRequested: Boolean!
    listing: Listing
    reserver: User
  }

  enum ReservationRequestState {
    REQUESTED
    ACCEPTED
    REJECTED
    RESERVATION_PERIOD
    CANCELLED
  }

  type Listing {
    id: ID!
    title: String
    imageUrl: String
  }

  type User {
    id: ID!
    name: String
  }
`;

interface GraphContext extends BaseContext {
	apiContext?: ApiContextSpec;
}

// A map of functions which return data for the schema.
const resolvers = {
	Query: {
		hello: (_parent: unknown, _args: unknown, context: GraphContext) =>
			`world${JSON.stringify(context.apiContext)}`,
		...reservationsResolvers.Query,
	},
	Mutation: {
		...reservationsResolvers.Mutation,
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
	const functionOptions: AzureFunctionsMiddlewareOptions<GraphContext> = {
		context: () => {
			return Promise.resolve({
				apiContext: apiContext,
			});
		},
	};
	return startServerAndCreateHandler(server, functionOptions);
};
