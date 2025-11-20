/**
 * Item Listing Search GraphQL Resolvers
 *
 * Provides GraphQL resolvers for item listing search functionality.
 */

import type { GraphContext } from '../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
import type {
	Resolvers,
	QuerySearchItemListingsArgs,
	SearchFacets,
	ItemListingSearchDocument as GraphQLItemListingSearchDocument,
} from '../builder/generated.ts';
import type {
	ItemListingSearchInput as DomainItemListingSearchInput,
	ItemListingSearchResult as DomainItemListingSearchResult,
	ItemListingSearchDocument as DomainItemListingSearchDocument,
} from '@sthrift/domain';

/**
 * Convert GraphQL ItemListingSearchInput to domain ItemListingSearchInput
 */
function toDomainItemListingSearchInput(
	input: QuerySearchItemListingsArgs['input'],
): DomainItemListingSearchInput {
	const domainInput: DomainItemListingSearchInput = {};

	if (input.searchString != null && input.searchString !== undefined) {
		domainInput.searchString = input.searchString;
	}

	if (input.options != null && input.options !== undefined) {
		domainInput.options = {};

		if (input.options.top != null && input.options.top !== undefined) {
			domainInput.options.top = input.options.top;
		}

		if (input.options.skip != null && input.options.skip !== undefined) {
			domainInput.options.skip = input.options.skip;
		}

		if (input.options.orderBy != null && input.options.orderBy !== undefined) {
			domainInput.options.orderBy = [...input.options.orderBy];
		}

		if (input.options.filter != null && input.options.filter !== undefined) {
			domainInput.options.filter = {};

			if (
				input.options.filter.category != null &&
				input.options.filter.category !== undefined
			) {
				domainInput.options.filter.category = [
					...input.options.filter.category,
				];
			}

			if (
				input.options.filter.state != null &&
				input.options.filter.state !== undefined
			) {
				domainInput.options.filter.state = [...input.options.filter.state];
			}

			if (
				input.options.filter.sharerId != null &&
				input.options.filter.sharerId !== undefined
			) {
				domainInput.options.filter.sharerId = [
					...input.options.filter.sharerId,
				];
			}

			if (
				input.options.filter.location != null &&
				input.options.filter.location !== undefined
			) {
				domainInput.options.filter.location = input.options.filter.location;
			}

			if (
				input.options.filter.dateRange != null &&
				input.options.filter.dateRange !== undefined
			) {
				domainInput.options.filter.dateRange = {};

				if (
					input.options.filter.dateRange.start != null &&
					input.options.filter.dateRange.start !== undefined
				) {
					const { start } = input.options.filter.dateRange;
					domainInput.options.filter.dateRange.start =
						start instanceof Date
							? start.toISOString()
							: typeof start === 'string'
								? start
								: String(start);
				}

				if (
					input.options.filter.dateRange.end != null &&
					input.options.filter.dateRange.end !== undefined
				) {
					const { end } = input.options.filter.dateRange;
					domainInput.options.filter.dateRange.end =
						end instanceof Date
							? end.toISOString()
							: typeof end === 'string'
								? end
								: String(end);
				}
			}
		}
	}

	return domainInput;
}

/**
 * Convert domain facets Record to GraphQL SearchFacets structure
 */
function toGraphQLSearchFacets(
	domainFacets: DomainItemListingSearchResult['facets'] | null | undefined,
): SearchFacets | null {
	if (!domainFacets) {
		return null;
	}

	const graphQLFacets: {
		__typename: 'SearchFacets';
		category?: Array<{
			__typename: 'SearchFacet';
			value: string;
			count: number;
		}>;
		state?: Array<{ __typename: 'SearchFacet'; value: string; count: number }>;
		sharerId?: Array<{
			__typename: 'SearchFacet';
			value: string;
			count: number;
		}>;
		createdAt?: Array<{
			__typename: 'SearchFacet';
			value: string;
			count: number;
		}>;
	} = {
		__typename: 'SearchFacets',
	};

	// biome-ignore lint/complexity/useLiteralKeys: bracket notation required for TS4111 (index signature access)
	const categoryFacets = domainFacets['category'];
	if (categoryFacets != null) {
		graphQLFacets.category = categoryFacets.map(
			(facet: { value: unknown; count: number }) => ({
				__typename: 'SearchFacet' as const,
				value: String(facet.value),
				count: facet.count,
			}),
		);
	}

	// biome-ignore lint/complexity/useLiteralKeys: bracket notation required for TS4111 (index signature access)
	const stateFacets = domainFacets['state'];
	if (stateFacets != null) {
		graphQLFacets.state = stateFacets.map(
			(facet: { value: unknown; count: number }) => ({
				__typename: 'SearchFacet' as const,
				value: String(facet.value),
				count: facet.count,
			}),
		);
	}

	// biome-ignore lint/complexity/useLiteralKeys: bracket notation required for TS4111 (index signature access)
	const sharerIdFacets = domainFacets['sharerId'];
	if (sharerIdFacets != null) {
		graphQLFacets.sharerId = sharerIdFacets.map(
			(facet: { value: unknown; count: number }) => ({
				__typename: 'SearchFacet' as const,
				value: String(facet.value),
				count: facet.count,
			}),
		);
	}

	// biome-ignore lint/complexity/useLiteralKeys: bracket notation required for TS4111 (index signature access)
	const createdAtFacets = domainFacets['createdAt'];
	if (createdAtFacets != null) {
		graphQLFacets.createdAt = createdAtFacets.map(
			(facet: { value: unknown; count: number }) => ({
				__typename: 'SearchFacet' as const,
				value: String(facet.value),
				count: facet.count,
			}),
		);
	}

	return graphQLFacets as SearchFacets;
}

/**
 * Convert domain ItemListingSearchResult to GraphQL ItemListingSearchResult format
 */
function toGraphQLItemListingSearchResult(
	result: DomainItemListingSearchResult,
): {
	items: DomainItemListingSearchDocument[];
	count: number;
	facets: SearchFacets | null;
} {
	// Convert facets from Record format to SearchFacets structure for GraphQL
	const facets = toGraphQLSearchFacets(result.facets);

	return {
		items: result.items,
		count: result.count,
		facets,
	};
}

const itemListingSearchResolvers: Resolvers = {
	Query: {
		searchItemListings: async (
			_parent: unknown,
			args: QuerySearchItemListingsArgs,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			console.log('searchItemListings resolver called with input:', args.input);

			try {
				// Convert GraphQL input to domain input
				const domainInput = toDomainItemListingSearchInput(args.input);

				// Call domain service
				const domainResult =
					await context.applicationServices.Listing.ItemListingSearch.searchItemListings(
						domainInput,
					);

				// Convert domain result to GraphQL result format
				return toGraphQLItemListingSearchResult(domainResult);
			} catch (error) {
				console.error('Error in searchItemListings resolver:', error);
				throw new Error('Failed to search item listings');
			}
		},
	},

	Mutation: {
		bulkIndexItemListings: async (
			_parent: unknown,
			_args: unknown,
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			console.log('bulkIndexItemListings mutation called');

			try {
				// Call the application service to bulk index listings
				return await context.applicationServices.Listing.ItemListingSearch.bulkIndexItemListings();
			} catch (error) {
				console.error('Error in bulkIndexItemListings mutation:', error);
				throw new Error('Failed to bulk index item listings');
			}
		},
	},

	SearchFacets: {
		category: (facets: SearchFacets) => facets.category ?? null,
		state: (facets: SearchFacets) => facets.state ?? null,
		sharerId: (facets: SearchFacets) => facets.sharerId ?? null,
		createdAt: (facets: SearchFacets) => facets.createdAt ?? null,
	},

	ItemListingSearchDocument: {
		id: (doc: GraphQLItemListingSearchDocument) => {
			// Handle both GraphQL type (with __typename) and domain type
			const domainDoc = doc as unknown as DomainItemListingSearchDocument;
			return domainDoc.id;
		},
		title: (doc: GraphQLItemListingSearchDocument) => {
			const domainDoc = doc as unknown as DomainItemListingSearchDocument;
			return domainDoc.title;
		},
		description: (doc: GraphQLItemListingSearchDocument) => {
			const domainDoc = doc as unknown as DomainItemListingSearchDocument;
			return domainDoc.description;
		},
		category: (doc: GraphQLItemListingSearchDocument) => {
			const domainDoc = doc as unknown as DomainItemListingSearchDocument;
			return domainDoc.category;
		},
		location: (doc: GraphQLItemListingSearchDocument) => {
			const domainDoc = doc as unknown as DomainItemListingSearchDocument;
			return domainDoc.location;
		},
		sharerName: (doc: GraphQLItemListingSearchDocument) => {
			const domainDoc = doc as unknown as DomainItemListingSearchDocument;
			return domainDoc.sharerName;
		},
		sharerId: (doc: GraphQLItemListingSearchDocument) => {
			const domainDoc = doc as unknown as DomainItemListingSearchDocument;
			return domainDoc.sharerId;
		},
		state: (doc: GraphQLItemListingSearchDocument) => {
			const domainDoc = doc as unknown as DomainItemListingSearchDocument;
			return domainDoc.state;
		},
		sharingPeriodStart: (doc: GraphQLItemListingSearchDocument) => {
			const domainDoc = doc as unknown as DomainItemListingSearchDocument;
			return new Date(domainDoc.sharingPeriodStart);
		},
		sharingPeriodEnd: (doc: GraphQLItemListingSearchDocument) => {
			const domainDoc = doc as unknown as DomainItemListingSearchDocument;
			return new Date(domainDoc.sharingPeriodEnd);
		},
		createdAt: (doc: GraphQLItemListingSearchDocument) => {
			const domainDoc = doc as unknown as DomainItemListingSearchDocument;
			return new Date(domainDoc.createdAt);
		},
		updatedAt: (doc: GraphQLItemListingSearchDocument) => {
			const domainDoc = doc as unknown as DomainItemListingSearchDocument;
			return new Date(domainDoc.updatedAt);
		},
		images: (doc: GraphQLItemListingSearchDocument) => {
			const domainDoc = doc as unknown as DomainItemListingSearchDocument;
			// Convert string[] to ReadonlyArray<string> for GraphQL type
			return [...(domainDoc.images || [])];
		},
	},
};

export default itemListingSearchResolvers;
