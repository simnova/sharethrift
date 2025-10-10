import type { CognitiveSearchBase, CognitiveSearchLifecycle, SearchDocumentsResult, SearchIndex, SearchOptions } from './interfaces.js';
/**
 * In-memory implementation of Azure Cognitive Search
 *
 * Provides basic search functionality for development environments:
 * - Document storage and retrieval
 * - Simple text search
 * - Basic filtering
 * - Pagination support
 *
 * Note: This is intentionally simplified and does not implement
 * full OData filter parsing or complex search features.
 */
declare class InMemoryCognitiveSearch implements CognitiveSearchBase, CognitiveSearchLifecycle {
    private indexes;
    private documents;
    private isInitialized;
    constructor(options?: {
        enablePersistence?: boolean;
        persistencePath?: string;
    });
    startup(): Promise<void>;
    shutdown(): Promise<void>;
    createIndexIfNotExists(indexDefinition: SearchIndex): Promise<void>;
    createOrUpdateIndexDefinition(indexName: string, indexDefinition: SearchIndex): Promise<void>;
    indexDocument(indexName: string, document: Record<string, unknown>): Promise<void>;
    deleteDocument(indexName: string, document: Record<string, unknown>): Promise<void>;
    deleteIndex(indexName: string): Promise<void>;
    search(indexName: string, searchText: string, options?: SearchOptions): Promise<SearchDocumentsResult>;
    private applyTextSearch;
    private applyFilters;
    private applySorting;
    private getFieldValue;
    /**
     * Debug method to inspect current state
     */
    getDebugInfo(): {
        indexes: string[];
        documentCounts: Record<string, number>;
    };
}
export { InMemoryCognitiveSearch };
