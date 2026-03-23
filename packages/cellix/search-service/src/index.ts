import type { ServiceBase } from '@cellix/api-services-spec';

/**
 * Field types supported by search indexes
 * Based on Azure Cognitive Search EDM (Entity Data Model) types
 */
export type SearchFieldType =
	| 'Edm.String'
	| 'Edm.Int32'
	| 'Edm.Int64'
	| 'Edm.Double'
	| 'Edm.Boolean'
	| 'Edm.DateTimeOffset'
	| 'Edm.GeographyPoint'
	| 'Collection(Edm.String)'
	| 'Collection(Edm.Int32)'
	| 'Collection(Edm.Int64)'
	| 'Collection(Edm.Double)'
	| 'Collection(Edm.Boolean)'
	| 'Collection(Edm.DateTimeOffset)'
	| 'Collection(Edm.GeographyPoint)'
	| 'Edm.ComplexType'
	| 'Collection(Edm.ComplexType)';

/**
 * Defines a field in a search index
 */
export interface SearchField {
	name: string;
	type: SearchFieldType;
	key?: boolean;
	searchable?: boolean;
	filterable?: boolean;
	sortable?: boolean;
	facetable?: boolean;
	retrievable?: boolean;
	fields?: SearchField[]; // For complex types
}

/**
 * Defines the structure of a search index
 */
export interface SearchIndex {
	name: string;
	fields: SearchField[];
}

/**
 * Options for search queries
 */
export interface SearchOptions {
	queryType?: 'simple' | 'full';
	searchMode?: 'any' | 'all';
	includeTotalCount?: boolean;
	filter?: string;
	facets?: string[];
	top?: number;
	skip?: number;
	orderBy?: string[];
	select?: string[];
}

/**
 * A single search result with document and optional score
 */
export interface SearchResult<T = Record<string, unknown>> {
	document: T;
	score?: number;
}

/**
 * Complete search response with results and optional facets
 */
export interface SearchDocumentsResult<T = Record<string, unknown>> {
	results: Array<SearchResult<T>>;
	count?: number;
	facets?: Record<
		string,
		Array<{
			value: string | number | boolean;
			count: number;
		}>
	>;
}

/**
 * Generic search service interface
 *
 * This interface provides a generic abstraction for search functionality
 * that can be implemented by different search providers (Azure Cognitive Search,
 * mock implementations, etc.)
 *
 * The interface is application-agnostic and follows the ServiceBase pattern
 * used throughout the Cellix framework.
 */
export interface SearchService extends ServiceBase<unknown> {
	/**
	 * Create a search index if it doesn't already exist
	 *
	 * @param indexDefinition - The index definition to create
	 */
	createIndexIfNotExists(indexDefinition: SearchIndex): Promise<void>;

	/**
	 * Create or update a search index definition
	 *
	 * @param indexName - The name of the index
	 * @param indexDefinition - The index definition
	 */
	createOrUpdateIndexDefinition(
		indexName: string,
		indexDefinition: SearchIndex,
	): Promise<void>;

	/**
	 * Index (add or update) a document in the search index
	 *
	 * @param indexName - The name of the index
	 * @param document - The document to index
	 */
	indexDocument(
		indexName: string,
		document: Record<string, unknown>,
	): Promise<void>;

	/**
	 * Delete a document from the search index
	 *
	 * @param indexName - The name of the index
	 * @param document - The document to delete (must include key field)
	 */
	deleteDocument(
		indexName: string,
		document: Record<string, unknown>,
	): Promise<void>;

	/**
	 * Delete an entire search index
	 *
	 * @param indexName - The name of the index to delete
	 */
	deleteIndex(indexName: string): Promise<void>;

	/**
	 * Search documents in an index
	 *
	 * @param indexName - The name of the index to search
	 * @param searchText - The search query text
	 * @param options - Optional search parameters
	 * @returns Search results with documents and optional metadata
	 */
	search(
		indexName: string,
		searchText: string,
		options?: SearchOptions,
	): Promise<SearchDocumentsResult>;
}

/**
 * This package is types-only and has no runtime exports.
 * This constant exists solely to ensure TypeScript generates a JavaScript file.
 */
export const __TYPES_ONLY_PACKAGE__ = true;
