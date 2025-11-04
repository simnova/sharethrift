import type {
	CognitiveSearchBase,
	CognitiveSearchLifecycle,
	SearchDocumentsResult,
	SearchIndex,
	SearchOptions,
} from './interfaces.js';
import { IndexManager } from './index-manager.js';
import { DocumentStore } from './document-store.js';
import { SearchEngineAdapter } from './search-engine-adapter.js';

/**
 * In-memory implementation of Azure Cognitive Search
 *
 * Enhanced with Lunr.js and LiQE for superior search capabilities:
 * - Full-text search with relevance scoring (TF-IDF)
 * - Field boosting (title gets higher weight than description)
 * - Fuzzy matching and wildcard support
 * - Stemming and stop word filtering
 * - Advanced OData-like filtering with LiQE integration
 * - Complex filter expressions with logical operators
 * - String functions (contains, startswith, endswith)
 *
 * Maintains Azure Cognitive Search API compatibility while providing
 * enhanced mock search functionality for development environments.
 *
 * This implementation serves as a drop-in replacement for Azure Cognitive Search
 * in development and testing environments, offering realistic search behavior
 * without requiring cloud services or external dependencies.
 *
 * Refactored into focused modules for better separation of concerns:
 * - IndexManager: Manages index definitions
 * - DocumentStore: Manages document storage
 * - SearchEngineAdapter: Wraps Lunr/LiQE search engine
 */
class InMemoryCognitiveSearch
	implements CognitiveSearchBase, CognitiveSearchLifecycle
{
	private indexManager: IndexManager;
	private documentStore: DocumentStore;
	private searchEngine: SearchEngineAdapter;
	private isInitialized = false;

	/**
	 * Creates a new instance of the in-memory cognitive search service
	 *
	 * @param options - Configuration options for the search service
	 * @param options.enablePersistence - Whether to enable persistence (future feature)
	 * @param options.persistencePath - Path for persistence storage (future feature)
	 */
	constructor(
		options: {
			enablePersistence?: boolean;
			persistencePath?: string;
		} = {},
	) {
		// Store options for future use
		void options;
		// Initialize focused modules
		this.indexManager = new IndexManager();
		this.documentStore = new DocumentStore();
		this.searchEngine = new SearchEngineAdapter();
	}

	/**
	 * Initializes the search service
	 *
	 * @returns Promise that resolves when startup is complete
	 */
	startup(): Promise<void> {
		if (this.isInitialized) {
			return Promise.resolve();
		}

		console.log('InMemoryCognitiveSearch: Starting up...');

		// TODO: Add optional file persistence here if needed
		// For now, we'll keep everything in memory

		this.isInitialized = true;
		console.log('InMemoryCognitiveSearch: Started successfully');
		return Promise.resolve();
	}

	/**
	 * Shuts down the search service and cleans up resources
	 *
	 * @returns Promise that resolves when shutdown is complete
	 */
	shutdown(): Promise<void> {
		console.log('InMemoryCognitiveSearch: Shutting down...');
		this.isInitialized = false;
		console.log('InMemoryCognitiveSearch: Shutdown complete');
		return Promise.resolve();
	}

	/**
	 * Creates a new search index if it doesn't already exist
	 *
	 * @param indexDefinition - The definition of the index to create
	 * @returns Promise that resolves when the index is created or already exists
	 */
	createIndexIfNotExists(indexDefinition: SearchIndex): Promise<void> {
		if (this.indexManager.has(indexDefinition.name)) {
			return Promise.resolve();
		}

		console.log(`Creating index: ${indexDefinition.name}`);
		this.indexManager.create(indexDefinition);
		this.documentStore.create(indexDefinition.name);

		// Initialize search engine index with empty documents
		this.searchEngine.build(
			indexDefinition.name,
			indexDefinition.fields,
			[],
		);
		return Promise.resolve();
	}

	/**
	 * Creates or updates an existing search index definition
	 *
	 * @param indexName - The name of the index to create or update
	 * @param indexDefinition - The definition of the index
	 * @returns Promise that resolves when the index is created or updated
	 */
	createOrUpdateIndexDefinition(
		indexName: string,
		indexDefinition: SearchIndex,
	): Promise<void> {
		console.log(`Creating/updating index: ${indexName}`);
		this.indexManager.create(indexDefinition);

		if (!this.documentStore.has(indexName)) {
			this.documentStore.create(indexName);
		}

		// Rebuild search engine index with current documents
		const documents = Array.from(this.documentStore.getDocs(indexName).values());
		this.searchEngine.build(indexName, indexDefinition.fields, documents);
		return Promise.resolve();
	}

	/**
	 * Adds or updates a document in the specified search index
	 *
	 * @param indexName - The name of the index to add the document to
	 * @param document - The document to index (must have an 'id' field)
	 * @returns Promise that resolves when the document is indexed
	 */
	indexDocument(
		indexName: string,
		document: Record<string, unknown>,
	): Promise<void> {
		if (!this.indexManager.has(indexName)) {
			return Promise.reject(new Error(`Index ${indexName} does not exist`));
		}

		if (!this.documentStore.has(indexName)) {
			return Promise.reject(
				new Error(`Document storage not found for index ${indexName}`),
			);
		}

		const documentId = document['id'] as string;
		if (!documentId) {
			return Promise.reject(new Error('Document must have an id field'));
		}

		console.log(`Indexing document ${documentId} in index ${indexName}`);
		this.documentStore.set(indexName, documentId, { ...document });

		// Update search engine index
		this.searchEngine.add(indexName, document);
		return Promise.resolve();
	}

	/**
	 * Removes a document from the specified search index
	 *
	 * @param indexName - The name of the index to remove the document from
	 * @param document - The document to remove (must have an 'id' field)
	 * @returns Promise that resolves when the document is removed
	 */
	deleteDocument(
		indexName: string,
		document: Record<string, unknown>,
	): Promise<void> {
		if (!this.indexManager.has(indexName)) {
			return Promise.reject(new Error(`Index ${indexName} does not exist`));
		}

		if (!this.documentStore.has(indexName)) {
			return Promise.reject(
				new Error(`Document storage not found for index ${indexName}`),
			);
		}

		const documentId = document['id'] as string;
		if (!documentId) {
			return Promise.reject(new Error('Document must have an id field'));
		}

		console.log(`Deleting document ${documentId} from index ${indexName}`);
		this.documentStore.delete(indexName, documentId);

		// Update search engine index
		this.searchEngine.remove(indexName, documentId);
		return Promise.resolve();
	}

	/**
	 * Deletes an entire search index and all its documents
	 *
	 * @param indexName - The name of the index to delete
	 * @returns Promise that resolves when the index is deleted
	 */
	deleteIndex(indexName: string): Promise<void> {
		console.log(`Deleting index: ${indexName}`);
		this.indexManager.delete(indexName);
		this.documentStore.deleteStore(indexName);
		return Promise.resolve();
	}

	/**
	 * Performs a search query on the specified index using Lunr.js
	 *
	 * @param indexName - The name of the index to search
	 * @param searchText - The search query text
	 * @param options - Optional search parameters (filters, pagination, facets, etc.)
	 * @returns Promise that resolves with search results including relevance scores
	 */
	search(
		indexName: string,
		searchText: string,
		options?: SearchOptions,
	): Promise<SearchDocumentsResult> {
		if (!this.indexManager.has(indexName)) {
			return Promise.resolve({ results: [], count: 0, facets: {} });
		}

		// Use search engine adapter for enhanced search with relevance scoring
		const result = this.searchEngine.search(indexName, searchText, options);
		return Promise.resolve(result);
	}

	/**
	 * Debug method to inspect current state and statistics
	 *
	 * @returns Object containing debug information about indexes, document counts, Lunr.js statistics, and LiQE capabilities
	 */
	getDebugInfo(): {
		indexes: string[];
		documentCounts: Record<string, number>;
		lunrStats: Record<
			string,
			{ documentCount: number; fieldCount: number } | null
		>;
		filterCapabilities: {
			operators: string[];
			functions: string[];
			examples: string[];
		};
	} {
		const indexes = this.indexManager.listIndexes();
		const documentCounts = this.documentStore.getAllCounts();
		const lunrStats: Record<
			string,
			{ documentCount: number; fieldCount: number } | null
		> = {};

		for (const indexName of indexes) {
			lunrStats[indexName] = this.searchEngine.getStats(indexName);
		}

		return {
			indexes,
			documentCounts,
			lunrStats,
			filterCapabilities: this.searchEngine.getFilterCapabilities(),
		};
	}

	/**
	 * Get information about supported LiQE filter capabilities
	 *
	 * @returns Object containing supported operators, functions, and examples
	 */
	getFilterCapabilities(): {
		operators: string[];
		functions: string[];
		examples: string[];
	} {
		return this.searchEngine.getFilterCapabilities();
	}

	/**
	 * Validate if a filter string is supported by LiQE
	 *
	 * @param filterString - Filter string to validate
	 * @returns True if the filter can be parsed by LiQE, false otherwise
	 */
	isFilterSupported(filterString: string): boolean {
		return this.searchEngine.isFilterSupported(filterString);
	}
}

export { InMemoryCognitiveSearch };
