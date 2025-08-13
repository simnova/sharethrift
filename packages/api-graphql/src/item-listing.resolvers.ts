import type { BaseContext } from '@apollo/server';
import type { ApiContextSpec } from '@ocom/api-context-spec';
import {
	getActiveMockListings,
	getMockListingById,
	getAllCategories,
	type MockItemListingData,
} from '@ocom/api-domain/src/domain/contexts/item-listing/item-listing.mock-data.ts';

interface GraphContext extends BaseContext {
	apiContext?: ApiContextSpec;
}

interface ActiveListingsArgs {
	filter?: {
		category?: string;
		searchQuery?: string;
		state?: string;
	};
	first?: number;
	after?: string;
}

interface ItemListingByIdArgs {
	id: string;
}

interface Connection<T> {
	edges: Array<{
		node: T;
		cursor: string;
	}>;
	pageInfo: {
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		startCursor: string | null;
		endCursor: string | null;
	};
	totalCount: number;
}

/**
 * GraphQL resolvers for Item Listing queries
 */
export const itemListingResolvers = {
	Query: {
		/**
		 * Get active listings with filtering and pagination
		 */
		activeListings: async (
			_parent: unknown,
			args: ActiveListingsArgs,
			context: GraphContext,
		): Promise<Connection<MockItemListingData>> => {
			const { filter, first = 20, after } = args;
			
			// Check if we have access to real backend data
			if (context.apiContext?.domainDataSource?.domainContexts?.itemListing) {
				try {
					// Get the UoW from the domain data source
					const getUoW = context.apiContext.domainDataSource.domainContexts.itemListing.getItemListingUnitOfWork;
					// biome-ignore lint/suspicious/noExplicitAny: Domain data source returns unknown type
					const uow = getUoW(null, null) as any; // Type as any for now since it's unknown from interface
					
					// Use the repository to find active listings
					const repositoryResult = await uow.itemListingRepository.findActiveListings({
						search: filter?.searchQuery,
						category: filter?.category,
						first,
						after,
					});

					// Convert domain entities to GraphQL format
					// biome-ignore lint/suspicious/noExplicitAny: Repository result has dynamic edge types
					const edges = repositoryResult.edges.map((edge: any) => ({
						node: {
							id: edge.node.id,
							title: edge.node.title.valueOf(),
							description: edge.node.description.valueOf(), 
							category: edge.node.category.valueOf(),
							location: edge.node.location.valueOf(),
							sharingPeriodStart: edge.node.sharingPeriodStart,
							sharingPeriodEnd: edge.node.sharingPeriodEnd,
							state: edge.node.state.valueOf(),
							images: edge.node.images,
							sharer: edge.node.sharer,
							thumbnailImage: edge.node.images[0] || '/src/assets/item-images/default.jpg',
						} as MockItemListingData,
						cursor: edge.cursor,
					}));

					return {
						edges,
						pageInfo: repositoryResult.pageInfo,
						totalCount: repositoryResult.totalCount,
					};
				} catch (error) {
					console.warn('Failed to fetch from backend, falling back to mock data:', error);
					// Fall back to mock data if backend fails
				}
			}
			
			// Fallback to mock data (existing implementation)
			// Calculate skip based on cursor
			let skip = 0;
			if (after) {
				try {
					skip = Number.parseInt(Buffer.from(after, 'base64').toString('ascii'), 10) + 1;
				} catch {
					skip = 0;
				}
			}

			// Get filtered listings
			const searchOptions = {
				...(filter?.searchQuery && { search: filter.searchQuery }),
				...(filter?.category && { category: filter.category }),
				skip,
				limit: first,
			};
			const listings = getActiveMockListings(searchOptions);

			// Get total count for pagination info
			const totalOptions = {
				...(filter?.searchQuery && { search: filter.searchQuery }),
				...(filter?.category && { category: filter.category }),
			};
			const totalListings = getActiveMockListings(totalOptions);
			const totalCount = totalListings.length;

			// Create edges with cursors
			const edges = listings.map((listing, index) => ({
				node: listing,
				cursor: Buffer.from((skip + index).toString()).toString('base64'),
			}));

			// Calculate pagination info
			const hasNextPage = skip + listings.length < totalCount;
			const hasPreviousPage = skip > 0;
			const startCursor = edges.length > 0 ? edges[0]?.cursor ?? null : null;
			const endCursor = edges.length > 0 ? edges[edges.length - 1]?.cursor ?? null : null;

			return {
				edges,
				pageInfo: {
					hasNextPage,
					hasPreviousPage,
					startCursor,
					endCursor,
				},
				totalCount,
			};
		},

		/**
		 * Get a specific listing by ID
		 */
		itemListing: (
			_parent: unknown,
			args: ItemListingByIdArgs,
			_context: GraphContext,
		): MockItemListingData | null => {
			return getMockListingById(args.id) || null;
		},

		/**
		 * Get all available categories
		 */
		categories: (
			_parent: unknown,
			_args: unknown,
			_context: GraphContext,
		): string[] => {
			return getAllCategories();
		},
	},

	/**
	 * ItemListing type resolvers for computed fields
	 */
	ItemListing: {
		/**
		 * Map mock data ID to GraphQL _id field
		 */
		_id: (parent: MockItemListingData): string => parent.id,

		/**
		 * Map images field from thumbnailImage
		 */
		images: (parent: MockItemListingData): string[] => {
			return parent.thumbnailImage ? [parent.thumbnailImage] : [];
		},

		/**
		 * Mock sharer object for consistency with GraphQL schema
		 */
		sharer: (parent: MockItemListingData) => ({
			_id: parent.sharer,
			name: `User ${parent.sharer}`, // Mock name generation
		}),

		/**
		 * Add created and updated timestamps (mock data doesn't have these)
		 */
		createdAt: (parent: MockItemListingData): string => {
			// Use sharing period start as mock creation date
			return parent.sharingPeriodStart.toISOString();
		},

		updatedAt: (parent: MockItemListingData): string => {
			// Use sharing period start as mock update date
			return parent.sharingPeriodStart.toISOString();
		},

		/**
		 * Format dates as ISO strings for GraphQL
		 */
		sharingPeriodStart: (parent: MockItemListingData): string => {
			return parent.sharingPeriodStart.toISOString();
		},

		sharingPeriodEnd: (parent: MockItemListingData): string => {
			return parent.sharingPeriodEnd.toISOString();
		},
	},
};

/**
 * GraphQL type definitions for Item Listing
 */
export const itemListingTypeDefs = `#graphql
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

	type ItemListingEdge {
		node: ItemListing!
		cursor: String!
	}

	type PageInfo {
		hasNextPage: Boolean!
		hasPreviousPage: Boolean!
		startCursor: String
		endCursor: String
	}

	type ItemListingConnection {
		edges: [ItemListingEdge!]!
		pageInfo: PageInfo!
		totalCount: Int!
	}

	input ListingFilter {
		category: String
		searchQuery: String
		state: String
	}

	extend type Query {
		activeListings(
			filter: ListingFilter
			first: Int
			after: String
		): ItemListingConnection!
		
		itemListing(id: ID!): ItemListing
		
		categories: [String!]!
	}
`;
