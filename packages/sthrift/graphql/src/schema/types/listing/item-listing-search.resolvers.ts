import type { GraphContext } from '../../../init/context.ts';
import type { ItemListingSearchInput as GraphItemListingSearchInput } from '../../builder/generated.js';
import type { ItemListingSearchInput as DomainItemListingSearchInput } from '@sthrift/domain';

const toDomainInput = (
	input: GraphItemListingSearchInput,
): DomainItemListingSearchInput => {
	const domain: DomainItemListingSearchInput = {};
	if (input.searchString != null) {
		domain.searchString = input.searchString;
	}
	if (input.options != null) {
		domain.options = {};
		if (input.options.top != null) domain.options.top = input.options.top;
		if (input.options.skip != null) domain.options.skip = input.options.skip;
		if (input.options.orderBy != null)
			domain.options.orderBy = [...input.options.orderBy];
		if (input.options.filter != null) {
			domain.options.filter = {};
			const f = input.options.filter;
			if (f.category != null) domain.options.filter.category = [...f.category];
			if (f.state != null) domain.options.filter.state = [...f.state];
			if (f.sharerId != null) domain.options.filter.sharerId = [...f.sharerId];
			if (f.location != null) domain.options.filter.location = f.location;
			if (f.dateRange != null) {
				domain.options.filter.dateRange = {};
				if (f.dateRange.start != null)
					domain.options.filter.dateRange.start = f.dateRange.start;
				if (f.dateRange.end != null)
					domain.options.filter.dateRange.end = f.dateRange.end;
			}
		}
	}
	return domain;
};

const itemListingSearchResolvers = {
	Query: {
		searchItemListings: async (
			_parent: unknown,
			args: { input: GraphItemListingSearchInput },
			context: GraphContext,
		) => {
			try {
				const result =
					await context.applicationServices.Listing.ItemListingSearch.searchItemListings(
						toDomainInput(args.input),
					);

				return {
					items: result.items,
					count: result.count,
					facets: result.facets,
				};
			} catch (error) {
				console.error('Error in searchItemListings resolver:', error);
				throw new Error('Failed to search item listings');
			}
		},
	},
};

export default itemListingSearchResolvers;
