/**
 * Item Listing Search GraphQL Resolvers
 *
 * Provides GraphQL resolvers for item listing search functionality.
 */

import type { GraphContext } from '../../../init/context.ts';
import type { GraphQLResolveInfo } from 'graphql';
import type { Resolvers } from '../../builder/generated.ts';

const itemListingSearchResolvers: Resolvers = {
	Query: {
		searchItemListings: async (
			_parent: unknown,
			args: { input: any },
			context: GraphContext,
			_info: GraphQLResolveInfo,
		) => {
			try {
				return await context.applicationServices.Listing.ListingSearch.searchItemListings(
					args.input,
				);
			} catch (error) {
				console.error('Error in searchItemListings resolver:', error);
				throw new Error('Failed to search item listings');
			}
		},
	},

	SearchFacets: {
		category: (facets: any) => {
			return (
				facets.category?.map((facet: any) => ({
					value: facet.value,
					count: facet.count,
				})) || []
			);
		},

		state: (facets: any) => {
			return (
				facets.state?.map((facet: any) => ({
					value: facet.value,
					count: facet.count,
				})) || []
			);
		},

		sharerId: (facets: any) => {
			return (
				facets.sharerId?.map((facet: any) => ({
					value: facet.value,
					count: facet.count,
				})) || []
			);
		},

		createdAt: (facets: any) => {
			return (
				facets.createdAt?.map((facet: any) => ({
					value: facet.value,
					count: facet.count,
				})) || []
			);
		},
	},

	ItemListingSearchDocument: {
		id: (doc: any) => doc.id,
		title: (doc: any) => doc.title,
		description: (doc: any) => doc.description,
		category: (doc: any) => doc.category,
		location: (doc: any) => doc.location,
		sharerName: (doc: any) => doc.sharerName,
		sharerId: (doc: any) => doc.sharerId,
		state: (doc: any) => doc.state,
		sharingPeriodStart: (doc: any) => doc.sharingPeriodStart,
		sharingPeriodEnd: (doc: any) => doc.sharingPeriodEnd,
		createdAt: (doc: any) => doc.createdAt,
		updatedAt: (doc: any) => doc.updatedAt,
		images: (doc: any) => doc.images || [],
	},
};

export default itemListingSearchResolvers;
