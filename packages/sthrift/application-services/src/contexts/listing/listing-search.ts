/**
 * Listing Search Application Service
 *
 * Provides search functionality for Listings with filtering,
 * sorting, and pagination capabilities.
 */

import type {
	ListingSearchInput,
	ListingSearchResult,
	ListingSearchFilter,
	ListingSearchDocument,
} from '@sthrift/domain';
import type { CognitiveSearchDomain } from '@sthrift/domain';
import type {
	SearchOptions,
	SearchDocumentsResult,
} from '@cellix/search-service';
import { ListingSearchIndexSpec, convertListingToSearchDocument } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

/**
 * Application service for Listing search operations
 */
export class ListingSearchApplicationService {
	private readonly searchService: CognitiveSearchDomain;
	private readonly dataSources: DataSources;

	constructor(searchService: CognitiveSearchDomain, dataSources: DataSources) {
		this.searchService = searchService;
		this.dataSources = dataSources;
	}

	/**
	 * Search for listings with the provided input
	 */
	async searchListings(
		input: ListingSearchInput,
	): Promise<ListingSearchResult> {
		// Ensure the search index exists
		await this.searchService.createIndexIfNotExists(ListingSearchIndexSpec);

		// Build search query
		const searchString = input.searchString?.trim() || '*';
		const options = this.buildSearchOptions(input.options);

		// Execute search
		const searchResults = await this.searchService.search(
			ListingSearchIndexSpec.name,
			searchString,
			options,
		);

		// Convert results to application format
		return this.convertSearchResults(searchResults);
	}

	/**
	 * Bulk index all existing listings into the search index
	 * This is useful for initial setup or re-indexing
	 */
	async bulkIndexListings(): Promise<{
		successCount: number;
		totalCount: number;
		message: string;
	}> {
		console.log('[BulkIndex] Starting bulk indexing of existing listings...');

		// Ensure the search index exists
		await this.searchService.createIndexIfNotExists(ListingSearchIndexSpec);
		console.log('[BulkIndex] Search index verified/created');

		// Fetch all listings from the database WITH sharer populated
		const allListings =
			await this.dataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getAll(
				{ fields: ['sharer'] },
			);

		console.log(`[BulkIndex] Found ${allListings.length} listings to index`);

		if (allListings.length === 0) {
			return {
				successCount: 0,
				totalCount: 0,
				message: 'No listings found to index',
			};
		}

		// Convert each listing to a search document and index it
		const errors: Array<{ id: string; error: string }> = [];
		let successfulIndexes = 0;

		for (const listing of allListings) {
			try {
				console.log(`[BulkIndex] Processing listing ${listing.id} - ${listing.title}`);
				console.log(`[BulkIndex] Sharer data type: ${typeof listing.sharer}, value: ${JSON.stringify(listing.sharer).substring(0, 100)}`);
				
				// Convert listing to search document using the domain converter
				const searchDocument = convertListingToSearchDocument(
					listing as unknown as Record<string, unknown>,
				);

				console.log(`[BulkIndex] Converted to search document: ${JSON.stringify(searchDocument).substring(0, 200)}`);

				// Index the document
				await this.searchService.indexDocument(
					ListingSearchIndexSpec.name,
					searchDocument,
				);

				successfulIndexes++;
				console.log(`[BulkIndex] ✓ Successfully indexed listing: ${listing.id} - ${listing.title} (${successfulIndexes}/${allListings.length})`);
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : String(error);
				console.error(`[BulkIndex] ✗ Failed to index listing ${listing.id}:`, errorMessage);
				if (error instanceof Error && error.stack) {
					console.error(`[BulkIndex] Stack trace:`, error.stack);
				}
				errors.push({ id: listing.id, error: errorMessage });
			}
		}

		// Summary
		const successCount = allListings.length - errors.length;
		const message = `Successfully indexed ${successCount}/${allListings.length} listings`;
		console.log(message);

		if (errors.length > 0) {
			console.error(`Failed to index ${errors.length} listings:`, errors);
		}

		return {
			successCount,
			totalCount: allListings.length,
			message,
		};
	}

	/**
	 * Build search options from input
	 */
	private buildSearchOptions(inputOptions?: {
		filter?: ListingSearchFilter | null;
		top?: number | null;
		skip?: number | null;
		orderBy?: readonly string[] | null;
	} | null): SearchOptions {
		const options: SearchOptions = {
			queryType: 'full',
			searchMode: 'all',
			includeTotalCount: true,
			facets: ['category,count:0', 'state,count:0', 'sharerId,count:0'],
			top: inputOptions?.top || 50,
			skip: inputOptions?.skip || 0,
			orderBy: inputOptions?.orderBy ? [...inputOptions.orderBy] : ['updatedAt desc'],
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
	private buildFilterString(filter: ListingSearchFilter): string {
		const filterParts: string[] = [];

		// Category filter
		if (filter.category && filter.category.length > 0) {
			const categoryFilters = filter.category.map(
				(cat) => `category eq '${cat}'`,
			);
			filterParts.push(`(${categoryFilters.join(' or ')})`);
		}

		// State filter
		if (filter.state && filter.state.length > 0) {
			const stateFilters = filter.state.map((state) => `state eq '${state}'`);
			filterParts.push(`(${stateFilters.join(' or ')})`);
		}

		// Sharer ID filter
		if (filter.sharerId && filter.sharerId.length > 0) {
			const sharerFilters = filter.sharerId.map((id) => `sharerId eq '${id}'`);
			filterParts.push(`(${sharerFilters.join(' or ')})`);
		}

		// Location filter (simple text matching)
		if (filter.location) {
			filterParts.push(`location eq '${filter.location}'`);
		}

		// Date range filter
		if (filter.dateRange) {
			if (filter.dateRange.start) {
				// OData requires date strings to be quoted
				filterParts.push(`sharingPeriodStart ge '${filter.dateRange.start}'`);
			}
			if (filter.dateRange.end) {
				// OData requires date strings to be quoted
				filterParts.push(`sharingPeriodEnd le '${filter.dateRange.end}'`);
			}
		}

		return filterParts.join(' and ');
	}

	/**
	 * Convert search results to application format
	 */
	private convertSearchResults(
		searchResults: SearchDocumentsResult,
	): ListingSearchResult {
		const items: ListingSearchDocument[] = searchResults.results.map(
			(result: { document: Record<string, unknown> }) =>
				result.document as unknown as ListingSearchDocument,
		);

		// Convert facets from Record format to typed SearchFacets structure
		const facets = this.convertFacets(searchResults.facets);

		// Return with explicit facets (can be undefined if no facets)
		if (facets) {
			return {
				items,
				count: searchResults.count || 0,
				facets,
			};
		}

		return {
			items,
			count: searchResults.count || 0,
		};
	}

	/**
	 * Convert facets from generic Record format to domain SearchFacets format
	 */
	private convertFacets(
		facetsRecord: Record<string, Array<{ value: string | number | boolean; count: number }>> | undefined,
	): ListingSearchResult['facets'] {
		if (!facetsRecord) {
			return undefined;
		}

		const facets: ListingSearchResult['facets'] = {};

		if (facetsRecord['category']) {
			facets.category = facetsRecord['category'].map(f => ({ value: String(f.value), count: f.count }));
		}
		if (facetsRecord['state']) {
			facets.state = facetsRecord['state'].map(f => ({ value: String(f.value), count: f.count }));
		}
		if (facetsRecord['sharerId']) {
			facets.sharerId = facetsRecord['sharerId'].map(f => ({ value: String(f.value), count: f.count }));
		}
		if (facetsRecord['createdAt']) {
			facets.createdAt = facetsRecord['createdAt'].map(f => ({ value: String(f.value), count: f.count }));
		}

		return facets;
	}
}
