import type { ServiceBase } from '@cellix/api-services-spec';
/**
 * Cognitive Search Service for ShareThrift
 *
 * Automatically detects environment and chooses between Azure Cognitive Search
 * and Mock implementation based on available credentials and configuration.
 */
export declare class ServiceCognitiveSearch implements ServiceBase<unknown> {
    private searchService;
    private implementationType;
    constructor();
    /**
     * Detects which implementation to use based on environment variables
     */
    private detectImplementation;
    /**
     * Creates the appropriate search service implementation
     */
    private createSearchService;
    /**
     * ServiceBase implementation
     */
    startUp(): Promise<void>;
    shutDown(): Promise<void>;
    /**
     * Proxy methods to the underlying search service
     */
    createIndexIfNotExists(indexDefinition: Record<string, unknown>): Promise<void>;
    createOrUpdateIndexDefinition(indexName: string, indexDefinition: Record<string, unknown>): Promise<void>;
    indexDocument(indexName: string, document: Record<string, unknown>): Promise<void>;
    deleteDocument(indexName: string, document: Record<string, unknown>): Promise<void>;
    deleteIndex(indexName: string): Promise<void>;
    search(indexName: string, searchText: string, options?: Record<string, unknown>): Promise<Record<string, unknown>>;
    indexExists(indexName: string): Promise<boolean>;
}
