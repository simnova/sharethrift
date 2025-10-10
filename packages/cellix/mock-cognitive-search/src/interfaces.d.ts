/**
 * Mock Cognitive Search Interfaces
 *
 * These interfaces match the Azure Cognitive Search SDK patterns
 * to provide a drop-in replacement for development environments.
 */
export interface SearchIndex {
	name: string;
	fields: SearchField[];
}
export interface SearchField {
	name: string;
	type: SearchFieldType;
	key?: boolean;
	searchable?: boolean;
	filterable?: boolean;
	sortable?: boolean;
	facetable?: boolean;
	retrievable?: boolean;
}
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
export interface SearchDocumentsResult<T = Record<string, unknown>> {
	results: Array<{
		document: T;
		score?: number;
	}>;
	count?: number;
	facets?: Record<
		string,
		Array<{
			value: string | number | boolean;
			count: number;
		}>
	>;
}
export interface SearchResult {
	document: Record<string, unknown>;
	score?: number;
}
/**
 * Base interface for cognitive search implementations
 * Matches the pattern from ownercommunity and AHP codebases
 */
export interface CognitiveSearchBase {
	createIndexIfNotExists(indexDefinition: SearchIndex): Promise<void>;
	createOrUpdateIndexDefinition(
		indexName: string,
		indexDefinition: SearchIndex,
	): Promise<void>;
	indexDocument(
		indexName: string,
		document: Record<string, unknown>,
	): Promise<void>;
	deleteDocument(
		indexName: string,
		document: Record<string, unknown>,
	): Promise<void>;
	deleteIndex(indexName: string): Promise<void>;
	search(
		indexName: string,
		searchText: string,
		options?: SearchOptions,
	): Promise<SearchDocumentsResult>;
}
/**
 * Lifecycle interface for services that need startup/shutdown
 */
export interface CognitiveSearchLifecycle {
	startup(): Promise<void>;
	shutdown(): Promise<void>;
}
/**
 * Extended interface combining base functionality with lifecycle
 */
export interface CognitiveSearchService
	extends CognitiveSearchBase,
		CognitiveSearchLifecycle {}
