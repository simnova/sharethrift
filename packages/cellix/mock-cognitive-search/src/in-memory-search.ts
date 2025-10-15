import type {
	CognitiveSearchBase,
	CognitiveSearchLifecycle,
	SearchDocumentsResult,
	SearchIndex,
	SearchOptions,
} from './interfaces.js';
import { LunrSearchEngine } from './lunr-search-engine.js';

/**
 * In-memory implementation of Azure Cognitive Search
 *
 * Enhanced with Lunr.js for superior search capabilities:
 * - Full-text search with relevance scoring (TF-IDF)
 * - Field boosting (title gets higher weight than description)
 * - Fuzzy matching and wildcard support
 * - Stemming and stop word filtering
 * - Basic filtering and pagination support
 *
 * Maintains Azure Cognitive Search API compatibility while providing
 * enhanced mock search functionality for development environments.
 *
 * This implementation serves as a drop-in replacement for Azure Cognitive Search
 * in development and testing environments, offering realistic search behavior
 * without requiring cloud services or external dependencies.
 */
class InMemoryCognitiveSearch
	implements CognitiveSearchBase, CognitiveSearchLifecycle
{
	private indexes: Map<string, SearchIndex> = new Map();
	private documents: Map<string, Map<string, Record<string, unknown>>> =
		new Map();
	private lunrEngine: LunrSearchEngine;
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
		// Initialize Lunr.js search engine
		this.lunrEngine = new LunrSearchEngine();
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
		if (this.indexes.has(indexDefinition.name)) {
			return Promise.resolve();
		}

		console.log(`Creating index: ${indexDefinition.name}`);
		this.indexes.set(indexDefinition.name, indexDefinition);
		this.documents.set(indexDefinition.name, new Map());

		// Initialize Lunr index with empty documents
		this.lunrEngine.buildIndex(
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
		this.indexes.set(indexName, indexDefinition);

		if (!this.documents.has(indexName)) {
			this.documents.set(indexName, new Map());
		}

		// Rebuild Lunr index with current documents
		const documentMap = this.documents.get(indexName);
		const documents = documentMap ? Array.from(documentMap.values()) : [];
		this.lunrEngine.buildIndex(indexName, indexDefinition.fields, documents);
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
		if (!this.indexes.has(indexName)) {
			return Promise.reject(new Error(`Index ${indexName} does not exist`));
		}

		const documentMap = this.documents.get(indexName);
		if (!documentMap) {
			return Promise.reject(
				new Error(`Document storage not found for index ${indexName}`),
			);
		}

		const documentId = document['id'] as string;
		if (!documentId) {
			return Promise.reject(new Error('Document must have an id field'));
		}

		console.log(`Indexing document ${documentId} in index ${indexName}`);
		documentMap.set(documentId, { ...document });

		// Update Lunr index
		this.lunrEngine.addDocument(indexName, document);
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
		if (!this.indexes.has(indexName)) {
			return Promise.reject(new Error(`Index ${indexName} does not exist`));
		}

		const documentMap = this.documents.get(indexName);
		if (!documentMap) {
			return Promise.reject(
				new Error(`Document storage not found for index ${indexName}`),
			);
		}

		const documentId = document['id'] as string;
		if (!documentId) {
			return Promise.reject(new Error('Document must have an id field'));
		}

		console.log(`Deleting document ${documentId} from index ${indexName}`);
		documentMap.delete(documentId);

		// Update Lunr index
		this.lunrEngine.removeDocument(indexName, documentId);
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
		this.indexes.delete(indexName);
		this.documents.delete(indexName);
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
		if (!this.indexes.has(indexName)) {
			return Promise.resolve({ results: [], count: 0, facets: {} });
		}

		// Use Lunr.js for enhanced search with relevance scoring
		const result = this.lunrEngine.search(indexName, searchText, options);
		return Promise.resolve(result);
	}

	/**
	 * Debug method to inspect current state and statistics
	 *
	 * @returns Object containing debug information about indexes, document counts, and Lunr.js statistics
	 */
	getDebugInfo(): {
		indexes: string[];
		documentCounts: Record<string, number>;
		lunrStats: Record<
			string,
			{ documentCount: number; fieldCount: number } | null
		>;
	} {
		const documentCounts: Record<string, number> = {};
		const lunrStats: Record<
			string,
			{ documentCount: number; fieldCount: number } | null
		> = {};

		for (const [indexName, documentMap] of this.documents) {
			documentCounts[indexName] = documentMap.size;
			lunrStats[indexName] = this.lunrEngine.getIndexStats(indexName);
		}

		return {
			indexes: Array.from(this.indexes.keys()),
			documentCounts,
			lunrStats,
		};
	}
}

export { InMemoryCognitiveSearch };
