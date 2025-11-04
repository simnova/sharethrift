import type {
	SearchField,
	SearchOptions,
	SearchDocumentsResult,
} from './interfaces.js';
import { LunrSearchEngine } from './lunr-search-engine.js';

/**
 * Search Engine Adapter
 *
 * Wraps the Lunr.js search engine and provides a clean interface
 * for search operations. This adapter layer allows for easy swapping
 * of search engines in the future if needed.
 */
export class SearchEngineAdapter {
	private engine: LunrSearchEngine;

	constructor() {
		this.engine = new LunrSearchEngine();
	}

	/**
	 * Build an index
	 *
	 * @param indexName - The name of the index
	 * @param fields - Array of search field definitions
	 * @param documents - Array of documents to index initially
	 */
	build(
		indexName: string,
		fields: SearchField[],
		documents: Record<string, unknown>[],
	): void {
		this.engine.buildIndex(indexName, fields, documents);
	}

	/**
	 * Add a document to an index
	 *
	 * @param indexName - The name of the index
	 * @param document - The document to add
	 */
	add(indexName: string, document: Record<string, unknown>): void {
		this.engine.addDocument(indexName, document);
	}

	/**
	 * Remove a document from an index
	 *
	 * @param indexName - The name of the index
	 * @param documentId - The ID of the document to remove
	 */
	remove(indexName: string, documentId: string): void {
		this.engine.removeDocument(indexName, documentId);
	}

	/**
	 * Search an index
	 *
	 * @param indexName - The name of the index
	 * @param searchText - The search query text
	 * @param options - Optional search parameters
	 * @returns Search results with relevance scores
	 */
	search(
		indexName: string,
		searchText: string,
		options?: SearchOptions,
	): SearchDocumentsResult {
		return this.engine.search(indexName, searchText, options);
	}

	/**
	 * Get index statistics
	 *
	 * @param indexName - The name of the index
	 * @returns Statistics object or null if index doesn't exist
	 */
	getStats(
		indexName: string,
	): { documentCount: number; fieldCount: number } | null {
		return this.engine.getIndexStats(indexName);
	}

	/**
	 * Get filter capabilities
	 *
	 * @returns Object containing supported operators, functions, and examples
	 */
	getFilterCapabilities(): {
		operators: string[];
		functions: string[];
		examples: string[];
	} {
		return this.engine.getFilterCapabilities();
	}

	/**
	 * Check if a filter is supported
	 *
	 * @param filterString - Filter string to validate
	 * @returns True if the filter is supported, false otherwise
	 */
	isFilterSupported(filterString: string): boolean {
		return this.engine.isFilterSupported(filterString);
	}

	/**
	 * Check if an index exists
	 *
	 * @param indexName - The name of the index
	 * @returns True if the index exists, false otherwise
	 */
	hasIndex(indexName: string): boolean {
		return this.engine.hasIndex(indexName);
	}
}

