/**
 * Item Listing Search GraphQL Resolvers
 *
 * Provides GraphQL resolvers for item listing search functionality.
 */

import type { GraphContext } from '../../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
import type { Resolvers } from '../../builder/generated.ts';
import { ItemListingSearchApplicationService } from '@sthrift/application-services';
import type { ServiceCognitiveSearch } from '@sthrift/service-cognitive-search';
import type {
	ItemListingSearchInput,
	ItemListingSearchResult,
	ItemListingSearchDocument,
} from '@sthrift/domain';

const itemListingSearchResolvers: Resolvers = {
	Query: {
		searchItemListings: async (
			_parent: unknown,
			args: { input: ItemListingSearchInput },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			console.log('searchItemListings resolver called with input:', args.input);

			try {
				// Get the search service from context
				const searchService = context.apiContext
					.searchService as ServiceCognitiveSearch;

				if (!searchService) {
					throw new Error('Search service not available in context');
				}

				// Create the search application service
				const searchApplicationService =
					new ItemListingSearchApplicationService(searchService);

				// Execute the search
				const result = await searchApplicationService.searchItemListings(
					args.input,
				);

				return result;
			} catch (error) {
				console.error('Error in searchItemListings resolver:', error);
				throw new Error('Failed to search item listings');
			}
		},
	},

	SearchFacets: {
		category: (
			facets: ItemListingSearchResult['facets'] | null | undefined,
		) => {
			return (
				facets?.category?.map((facet: { value: unknown; count: number }) => ({
					value: String(facet.value),
					count: facet.count,
				})) || []
			);
		},

		state: (facets: ItemListingSearchResult['facets'] | null | undefined) => {
			return (
				facets?.state?.map((facet: { value: unknown; count: number }) => ({
					value: String(facet.value),
					count: facet.count,
				})) || []
			);
		},

		sharerId: (
			facets: ItemListingSearchResult['facets'] | null | undefined,
		) => {
			return (
				facets?.sharerId?.map((facet: { value: unknown; count: number }) => ({
					value: String(facet.value),
					count: facet.count,
				})) || []
			);
		},

		createdAt: (
			facets: ItemListingSearchResult['facets'] | null | undefined,
		) => {
			return (
				facets?.createdAt?.map((facet: { value: unknown; count: number }) => ({
					value: String(facet.value),
					count: facet.count,
				})) || []
			);
		},
	},

	ItemListingSearchDocument: {
		id: (doc: ItemListingSearchDocument) => doc.id,
		title: (doc: ItemListingSearchDocument) => doc.title,
		description: (doc: ItemListingSearchDocument) => doc.description,
		category: (doc: ItemListingSearchDocument) => doc.category,
		location: (doc: ItemListingSearchDocument) => doc.location,
		sharerName: (doc: ItemListingSearchDocument) => doc.sharerName,
		sharerId: (doc: ItemListingSearchDocument) => doc.sharerId,
		state: (doc: ItemListingSearchDocument) => doc.state,
		sharingPeriodStart: (doc: ItemListingSearchDocument) => doc.sharingPeriodStart,
		sharingPeriodEnd: (doc: ItemListingSearchDocument) => doc.sharingPeriodEnd,
		createdAt: (doc: ItemListingSearchDocument) => doc.createdAt,
		updatedAt: (doc: ItemListingSearchDocument) => doc.updatedAt,
		images: (doc: ItemListingSearchDocument) => doc.images || [],
	},
};

export default itemListingSearchResolvers;
