import type { CognitiveSearchBase, CognitiveSearchLifecycle, SearchDocumentsResult, SearchIndex, SearchOptions } from './interfaces.js';
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
 */
declare class InMemoryCognitiveSearch implements CognitiveSearchBase, CognitiveSearchLifecycle {
    private indexes;
    private documents;
    private lunrEngine;
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
    /**
     * Debug method to inspect current state
     */
    getDebugInfo(): {
        indexes: string[];
        documentCounts: Record<string, number>;
        lunrStats: Record<string, {
            documentCount: number;
            fieldCount: number;
        } | null>;
    };
}
export { InMemoryCognitiveSearch };
