/**
 * Item Listing Search Application Service
 *
 * Provides search functionality for Item Listings with filtering,
 * sorting, and pagination capabilities.
 */

import type {
	ListingSearchInput as ItemListingSearchInput,
	ListingSearchResult as ItemListingSearchResult,
	ListingSearchFilter as ItemListingSearchFilter,
	ListingSearchDocument as ItemListingSearchDocument,
} from '@sthrift/domain';
import type { CognitiveSearchDomain } from '@sthrift/domain';
import type {
	SearchOptions,
	SearchDocumentsResult,
} from '@cellix/search-service';
import { ListingSearchIndexSpec as ItemListingSearchIndexSpec } from '@sthrift/domain';

/**
 * Application service for Item Listing search operations
 */
export class ItemListingSearchApplicationService {
	private searchService: CognitiveSearchDomain;

	constructor(searchService: CognitiveSearchDomain) {
		this.searchService = searchService;
	}

	/**
	 * Search for item listings with the provided input
	 */
	async searchItemListings(
		input: ItemListingSearchInput,
	): Promise<ItemListingSearchResult> {
		// Ensure the search index exists
		await this.searchService.createIndexIfNotExists(ItemListingSearchIndexSpec);

		// Build search query
		const searchString = input.searchString?.trim() || '*';
		const options = this.buildSearchOptions(input.options ?? undefined);

		// Execute search
		const searchResults = await this.searchService.search(
			ItemListingSearchIndexSpec.name,
			searchString,
			options,
		);

		// Convert results to application format
		return this.convertSearchResults(searchResults);
	}

	/**
	 * Build search options from input
	 */
	private buildSearchOptions(
		inputOptions?:
			| {
					filter?: ItemListingSearchFilter | null;
					top?: number | null;
					skip?: number | null;
					orderBy?: readonly string[] | null;
			  }
			| null,
	): SearchOptions {
		const options: SearchOptions = {
			queryType: 'full',
			searchMode: 'all',
			includeTotalCount: true,
			facets: ['category,count:0', 'state,count:0', 'sharerId,count:0'],
			top: inputOptions?.top ?? 50,
			skip: inputOptions?.skip ?? 0,
			orderBy: inputOptions?.orderBy
				? [...inputOptions.orderBy]
				: ['updatedAt desc'],
		};

		// Build filter string
		if (inputOptions?.filter) {
			options.filter = this.buildFilterString(inputOptions.filter);
		}

		return options;
	}

	/**
	 * Build OData filter string from filter input
	 */
	private buildFilterString(filter: ItemListingSearchFilter): string {
		const filterParts: string[] = [];

		// Category filter
		if (filter.category && filter.category.length > 0) {
			const categoryFilters = filter.category.map(
				(cat: string) => `category eq '${cat}'`,
			);
			filterParts.push(`(${categoryFilters.join(' or ')})`);
		}

		// State filter
		if (filter.state && filter.state.length > 0) {
			const stateFilters = filter.state.map(
				(state: string) => `state eq '${state}'`,
			);
			filterParts.push(`(${stateFilters.join(' or ')})`);
		}

		// Sharer ID filter
		if (filter.sharerId && filter.sharerId.length > 0) {
			const sharerFilters = filter.sharerId.map(
				(id: string) => `sharerId eq '${id}'`,
			);
			filterParts.push(`(${sharerFilters.join(' or ')})`);
		}

		// Location filter (simple text matching)
		if (filter.location) {
			filterParts.push(`location eq '${filter.location}'`);
		}

		// Date range filter
		if (filter.dateRange) {
			if (filter.dateRange.start) {
				filterParts.push(`sharingPeriodStart ge ${filter.dateRange.start}`);
			}
			if (filter.dateRange.end) {
				filterParts.push(`sharingPeriodEnd le ${filter.dateRange.end}`);
			}
		}

		return filterParts.join(' and ');
	}

	/**
	 * Convert search results to application format
	 */
	private convertSearchResults(
		searchResults: SearchDocumentsResult,
	): ItemListingSearchResult {
		const items: ItemListingSearchDocument[] = searchResults.results.map(
			(result: { document: Record<string, unknown> }) =>
				result.document as unknown as ItemListingSearchDocument,
		);

		return {
			items,
			count: searchResults.count || 0,
			facets: searchResults.facets || {},
		};
	}
}
