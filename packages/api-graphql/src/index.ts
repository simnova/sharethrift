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
