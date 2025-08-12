import { ApolloServer, type BaseContext } from '@apollo/server';
import {
	startServerAndCreateHandler,
	type AzureFunctionsMiddlewareOptions,
} from './azure-functions.ts';
import type { HttpHandler } from '@azure/functions-v4';
import type { ApiContextSpec } from '@ocom/api-context-spec';

// The GraphQL schema
const typeDefs = `#graphql
  type Query {
    hello: String
    activeListings(
      filter: ActiveListingsFilter
      first: Int
      after: String
    ): ActiveListingsConnection!
  }

  input ActiveListingsFilter {
    category: String
    searchQuery: String
    state: String
  }

  type ActiveListingsConnection {
    edges: [ActiveListingsEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type ActiveListingsEdge {
    node: ItemListing!
    cursor: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type ItemListing {
    _id: ID!
    title: String!
    description: String!
    category: String!
    location: String!
    sharingPeriodStart: String!
    sharingPeriodEnd: String!
    state: String!
    images: [String!]!
    sharer: User!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    _id: ID!
    name: String!
  }
`;

interface GraphContext extends BaseContext {
	apiContext?: ApiContextSpec;
}

// Mock data for listings
const mockListings = [
  {
    _id: '1',
    title: 'City Bike',
    description: 'A comfortable city bike perfect for urban commuting',
    category: 'Vehicles & Transportation',
    location: 'Philadelphia, PA',
    sharingPeriodStart: '2024-01-11',
    sharingPeriodEnd: '2024-12-23',
    state: 'Published',
    images: ['/assets/item-images/city-bike.jpg'],
    sharer: { _id: 'user1', name: 'John Doe' },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    _id: '2',
    title: 'Cordless Drill',
    description: 'Professional cordless drill with multiple bits included',
    category: 'Tools & Equipment',
    location: 'Philadelphia, PA',
    sharingPeriodStart: '2024-01-11',
    sharingPeriodEnd: '2024-12-23',
    state: 'Published',
    images: ['/assets/item-images/cordless-drill.jpg'],
    sharer: { _id: 'user2', name: 'Jane Smith' },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    _id: '3',
    title: 'Hand Mixer',
    description: 'Electric hand mixer for baking and cooking',
    category: 'Home & Garden',
    location: 'Philadelphia, PA',
    sharingPeriodStart: '2024-01-11',
    sharingPeriodEnd: '2024-12-23',
    state: 'Published',
    images: ['/assets/item-images/hand-mixer.jpg'],
    sharer: { _id: 'user1', name: 'John Doe' },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    _id: '4',
    title: 'Golf Clubs',
    description: 'Complete set of golf clubs for beginners',
    category: 'Sports & Outdoors',
    location: 'Philadelphia, PA',
    sharingPeriodStart: '2024-01-11',
    sharingPeriodEnd: '2024-12-23',
    state: 'Published',
    images: ['/assets/item-images/golf-clubs.jpg'],
    sharer: { _id: 'user3', name: 'Bob Wilson' },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    _id: '5',
    title: 'Beach Gear',
    description: 'Beach umbrella and chair set',
    category: 'Sports & Outdoors',
    location: 'Philadelphia, PA',
    sharingPeriodStart: '2024-01-11',
    sharingPeriodEnd: '2024-12-23',
    state: 'Published',
    images: ['/assets/item-images/beach-gear.jpg'],
    sharer: { _id: 'user2', name: 'Jane Smith' },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    _id: '6',
    title: 'Professional Camera',
    description: 'High-end DSLR camera with multiple lenses',
    category: 'Electronics',
    location: 'Philadelphia, PA',
    sharingPeriodStart: '2024-01-11',
    sharingPeriodEnd: '2024-12-23',
    state: 'Published',
    images: ['/assets/item-images/camera.jpg'],
    sharer: { _id: 'user1', name: 'John Doe' },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    _id: '7',
    title: 'Camping Tent',
    description: '4-person camping tent, waterproof and easy setup',
    category: 'Sports & Outdoors',
    location: 'Philadelphia, PA',
    sharingPeriodStart: '2024-01-11',
    sharingPeriodEnd: '2024-12-23',
    state: 'Published',
    images: ['/assets/item-images/tent.jpg'],
    sharer: { _id: 'user3', name: 'Bob Wilson' },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    _id: '8',
    title: 'Kitchen Appliances',
    description: 'Set of small kitchen appliances including blender and toaster',
    category: 'Home & Garden',
    location: 'Philadelphia, PA',
    sharingPeriodStart: '2024-01-11',
    sharingPeriodEnd: '2024-12-23',
    state: 'Published',
    images: ['/assets/item-images/kitchen-appliances.jpg'],
    sharer: { _id: 'user2', name: 'Jane Smith' },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    _id: '9',
    title: 'Party Supplies',
    description: 'Complete party decoration and tableware set',
    category: 'Party & Events',
    location: 'Philadelphia, PA',
    sharingPeriodStart: '2024-01-11',
    sharingPeriodEnd: '2024-12-23',
    state: 'Published',
    images: ['/assets/item-images/party-supplies.jpg'],
    sharer: { _id: 'user1', name: 'John Doe' },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    _id: '10',
    title: 'Books Collection',
    description: 'Collection of programming and technology books',
    category: 'Books & Media',
    location: 'Philadelphia, PA',
    sharingPeriodStart: '2024-01-11',
    sharingPeriodEnd: '2024-12-23',
    state: 'Published',
    images: ['/assets/item-images/books.jpg'],
    sharer: { _id: 'user3', name: 'Bob Wilson' },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    _id: '11',
    title: 'Winter Clothing',
    description: 'Winter jackets and accessories in various sizes',
    category: 'Clothing & Accessories',
    location: 'Philadelphia, PA',
    sharingPeriodStart: '2024-01-11',
    sharingPeriodEnd: '2024-12-23',
    state: 'Published',
    images: ['/assets/item-images/winter-clothing.jpg'],
    sharer: { _id: 'user2', name: 'Jane Smith' },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    _id: '12',
    title: 'Miscellaneous Tools',
    description: 'Various household tools and hardware',
    category: 'Miscellaneous',
    location: 'Philadelphia, PA',
    sharingPeriodStart: '2024-01-11',
    sharingPeriodEnd: '2024-12-23',
    state: 'Published',
    images: ['/assets/item-images/misc-tools.jpg'],
    sharer: { _id: 'user1', name: 'John Doe' },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
];

// A map of functions which return data for the schema.
const resolvers = {
	Query: {
		hello: (_parent: unknown, _args: unknown, context: GraphContext) =>
			`world${JSON.stringify(context.apiContext)}`,
		activeListings: (
      _parent: unknown,
      args: {
        filter?: {
          category?: string;
          searchQuery?: string;
          state?: string;
        };
        first?: number;
        after?: string;
      }
    ) => {
      let filtered = mockListings.filter(listing => listing.state === 'Published');

      // Apply search filter
      if (args.filter?.searchQuery) {
        const query = args.filter.searchQuery.toLowerCase();
        filtered = filtered.filter(listing =>
          listing.title.toLowerCase().includes(query) ||
          listing.description.toLowerCase().includes(query)
        );
      }

      // Apply category filter
      if (args.filter?.category && args.filter.category !== 'All') {
        filtered = filtered.filter(listing => listing.category === args.filter?.category);
      }

      // Handle pagination
      const first = args.first || 20;
      let startIndex = 0;
      
      if (args.after) {
        const afterIndex = filtered.findIndex(listing => listing._id === args.after);
        startIndex = afterIndex >= 0 ? afterIndex + 1 : 0;
      }

      const endIndex = Math.min(startIndex + first, filtered.length);
      const paginatedListings = filtered.slice(startIndex, endIndex);
      
      const hasNextPage = endIndex < filtered.length;
      const hasPreviousPage = startIndex > 0;

      return {
        edges: paginatedListings.map(listing => ({
          node: listing,
          cursor: listing._id,
        })),
        pageInfo: {
          hasNextPage,
          hasPreviousPage,
          startCursor: paginatedListings.length > 0 ? paginatedListings[0]?._id || null : null,
          endCursor: paginatedListings.length > 0 ? paginatedListings[paginatedListings.length - 1]?._id || null : null,
        },
        totalCount: filtered.length,
      };
    },
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
