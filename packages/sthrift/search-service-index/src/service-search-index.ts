import type {
	SearchService,
	SearchIndex,
	SearchOptions,
	SearchDocumentsResult,
} from '@cellix/search-service';
import { InMemoryCognitiveSearch } from '@sthrift/search-service-mock';
import { ListingSearchIndexSpec } from './indexes/listing-search-index.js';

/**
 * ShareThrift Search Service Index - FACADE
 *
 * This class provides application-specific search functionality for ShareThrift.
 * It implements the Facade pattern by providing a simple interface while hiding
 * the complexity of the underlying search implementation.
 *
 * Currently supports:
 * - Mock implementation for local development
 *
 * Future: Will support Azure Cognitive Search with automatic environment detection
 *
 * The facade:
 * 1. Implements the generic SearchService interface (which extends ServiceBase)
 * 2. Knows about domain-specific indexes (listings, etc.)
 * 3. Delegates all operations to the underlying implementation
 * 4. Provides convenience methods for common operations
 */
export class ServiceSearchIndex implements SearchService {
	private searchService: SearchService;
	private readonly implementationType = 'mock';

	/**
	 * Creates a new instance of the search service facade
	 *
	 * @param _config - Configuration options (currently unused, for future Azure support)
	 */
	constructor(_config?: {
		enablePersistence?: boolean;
		persistencePath?: string;
	}) {
		// For now, always use mock implementation
		// Future: Add factory logic to detect Azure vs Mock
		this.searchService = new InMemoryCognitiveSearch();

		console.log(
			`ServiceSearchIndex: Initialized with ${this.implementationType} implementation`,
		);
	}

	/**
	 * ServiceBase implementation - Initialize the search service
	 */
	async startUp(): Promise<ServiceSearchIndex> {
		console.log('ServiceSearchIndex: Starting up');
		await this.searchService.startUp();

		// Initialize application-specific indexes
		await this.initializeIndexes();

		return this;
	}

	/**
	 * ServiceBase implementation - Shutdown the search service
	 */
	async shutDown(): Promise<void> {
		console.log('ServiceSearchIndex: Shutting down');
		await this.searchService.shutDown();
	}

	/**
	 * Initialize domain-specific search indexes
	 * Called during startup to ensure all indexes exist
	 */
	private async initializeIndexes(): Promise<void> {
		console.log('ServiceSearchIndex: Initializing domain indexes');

		// Create item listing index
		await this.createIndexIfNotExists(ListingSearchIndexSpec);

		// Future: Add other indexes (users, reservations, etc.)
	}

	/**
	 * FACADE METHODS - Delegate to underlying search service
	 * These methods implement the SearchService interface
	 */

	async createIndexIfNotExists(indexDefinition: SearchIndex): Promise<void> {
		return await this.searchService.createIndexIfNotExists(indexDefinition);
	}

	async createOrUpdateIndexDefinition(
		indexName: string,
		indexDefinition: SearchIndex,
	): Promise<void> {
		return await this.searchService.createOrUpdateIndexDefinition(
			indexName,
			indexDefinition,
		);
	}

	async indexDocument(
		indexName: string,
		document: Record<string, unknown>,
	): Promise<void> {
		return await this.searchService.indexDocument(indexName, document);
	}

	async deleteDocument(
		indexName: string,
		document: Record<string, unknown>,
	): Promise<void> {
		return await this.searchService.deleteDocument(indexName, document);
	}

	async deleteIndex(indexName: string): Promise<void> {
		return await this.searchService.deleteIndex(indexName);
	}

	async search(
		indexName: string,
		searchText: string,
		options?: SearchOptions,
	): Promise<SearchDocumentsResult> {
		return await this.searchService.search(indexName, searchText, options);
	}

	/**
	 * CONVENIENCE METHODS - Domain-specific helpers
	 * These methods provide a simpler interface for common operations
	 */

	/**
	 * Search item listings
	 *
	 * @param searchText - The search query text
	 * @param options - Optional search parameters
	 * @returns Search results for listings
	 */
	async searchListings(
		searchText: string,
		options?: SearchOptions,
	): Promise<SearchDocumentsResult> {
		return await this.search(
			ListingSearchIndexSpec.name,
			searchText,
			options,
		);
	}

	/**
	 * Index an item listing document
	 *
	 * @param listing - The listing document to index
	 */
	async indexListing(listing: Record<string, unknown>): Promise<void> {
		return await this.indexDocument(ListingSearchIndexSpec.name, listing);
	}

	/**
	 * Delete an item listing from the search index
	 *
	 * @param listing - The listing document to delete (must include id)
	 */
	async deleteListing(listing: Record<string, unknown>): Promise<void> {
		return await this.deleteDocument(ListingSearchIndexSpec.name, listing);
	}
}
