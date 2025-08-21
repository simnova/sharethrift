import { ApolloServer, type BaseContext } from '@apollo/server';
import type { HttpHandler } from '@azure/functions-v4';
import type {
	ApplicationServices,
	ApplicationServicesFactory,
	PrincipalHints,
} from '@sthrift/api-application-services';
import {
	type AzureFunctionsMiddlewareOptions,
	startServerAndCreateHandler,
	type WithRequired,
} from './azure-functions.ts';
import { itemListingResolvers } from './schema/resolvers/item-listing.resolvers.ts';

// Load GraphQL schema - inline for now to avoid file path issues
const itemListingTypeDefs = `
type ItemListing {
  id: ObjectId!
  sharer: ObjectId!
  title: String!
  description: String!
  category: String!
  location: String!
  sharingPeriodStart: DateTime!
  sharingPeriodEnd: DateTime!
  state: ItemListingState
  createdAt: DateTime
  updatedAt: DateTime
  sharingHistory: [ObjectId!]
  reports: Int
}

enum ItemListingState {
  Published
  Paused
  Cancelled
  Drafted
  Expired
  Blocked
  AppealRequested
}

# My Listings Dashboard Types
enum ListingStatus {
  Active
  Paused
  Reserved
  Expired
  Draft
  Blocked
}

enum RequestStatus {
  Accepted
  Rejected
  Closed
  Pending
  Closing
}

type DateRange {
  start: DateTime!
  end: DateTime!
}

type ListingAllDTO {
  id: String!
  title: String!
  image: String
  publishedAt: DateTime!
  reservationPeriod: DateRange!
  status: ListingStatus!
  pendingRequestsCount: Int!
}

type ListingRequestDTO {
  id: String!
  title: String!
  image: String
  requestedBy: String!
  requestedOn: DateTime!
  reservationPeriod: DateRange!
  status: RequestStatus!
}

type ListingAllPage {
  items: [ListingAllDTO!]!
  total: Int!
  page: Int!
  pageSize: Int!
}

type ListingRequestPage {
  items: [ListingRequestDTO!]!
  total: Int!
  page: Int!
  pageSize: Int!
}

extend type Query {
  itemListings: [ItemListing!]!
  itemListing(id: ObjectId!): ItemListing
  myListingsAll(page: Int!, pageSize: Int!): ListingAllPage!
  myListingsRequests(page: Int!, pageSize: Int!): ListingRequestPage!
}
`;

const conversationTypeDefs = `
# Conversation types would go here
`;

// Common scalars and base types
const baseTypeDefs = `#graphql
  scalar DateTime
  scalar ObjectId
  
  type Query {
    hello: String
  }
`;

// The GraphQL schema
const typeDefs = [baseTypeDefs, itemListingTypeDefs, conversationTypeDefs];

interface GraphContext extends BaseContext {
	applicationServices: ApplicationServices;
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
				// memberId: req.headers.get('x-member-id') ?? undefined,
				// communityId: req.headers.get('x-community-id') ?? undefined,
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