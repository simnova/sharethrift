import { InMemoryCognitiveSearch } from '@cellix/mock-cognitive-search';
/**
 * Cognitive Search Service for ShareThrift
 *
 * Automatically detects environment and chooses between Azure Cognitive Search
 * and Mock implementation based on available credentials and configuration.
 */
export class ServiceCognitiveSearch {
    searchService;
    implementationType;
    constructor() {
        this.implementationType = this.detectImplementation();
        this.searchService = this.createSearchService();
    }
    /**
     * Detects which implementation to use based on environment variables
     */
    detectImplementation() {
        // Force mock mode
        if (process.env['USE_MOCK_SEARCH'] === 'true') {
            console.log('ServiceCognitiveSearch: Using mock implementation (forced)');
            return 'mock';
        }
        // Force Azure mode
        if (process.env['USE_AZURE_SEARCH'] === 'true') {
            console.log('ServiceCognitiveSearch: Using Azure implementation (forced)');
            return 'azure';
        }
        // Auto-detect based on environment and credentials
        const hasAzureEndpoint = !!process.env['SEARCH_API_ENDPOINT'];
        const isDevelopment = process.env['NODE_ENV'] === 'development' ||
            process.env['NODE_ENV'] === 'test';
        if (isDevelopment && !hasAzureEndpoint) {
            console.log('ServiceCognitiveSearch: Using mock implementation (development mode, no Azure endpoint)');
            return 'mock';
        }
        if (hasAzureEndpoint) {
            console.log('ServiceCognitiveSearch: Using Azure implementation (endpoint configured)');
            return 'azure';
        }
        // Default to mock in development, Azure in production
        if (isDevelopment) {
            console.log('ServiceCognitiveSearch: Using mock implementation (development default)');
            return 'mock';
        }
        console.log('ServiceCognitiveSearch: Using Azure implementation (production default)');
        return 'azure';
    }
    /**
     * Creates the appropriate search service implementation
     */
    createSearchService() {
        if (this.implementationType === 'mock') {
            return new InMemoryCognitiveSearch({
                enablePersistence: process.env['ENABLE_SEARCH_PERSISTENCE'] === 'true',
                persistencePath: process.env['SEARCH_PERSISTENCE_PATH'] ||
                    './.dev-data/search-indexes',
            });
        }
        // TODO: Implement Azure Cognitive Search wrapper when needed
        // For now, fall back to mock if Azure is requested but not implemented
        console.warn('ServiceCognitiveSearch: Azure implementation not yet available, falling back to mock');
        return new InMemoryCognitiveSearch({
            enablePersistence: process.env['ENABLE_SEARCH_PERSISTENCE'] === 'true',
            persistencePath: process.env['SEARCH_PERSISTENCE_PATH'] || './.dev-data/search-indexes',
        });
    }
    /**
     * ServiceBase implementation
     */
    async startUp() {
        console.log(`ServiceCognitiveSearch: Starting up with ${this.implementationType} implementation`);
        await this.searchService.startup();
    }
    async shutDown() {
        console.log('ServiceCognitiveSearch: Shutting down');
        await this.searchService.shutdown();
    }
    /**
     * Proxy methods to the underlying search service
     */
    async createIndexIfNotExists(indexDefinition) {
        return this.searchService.createIndexIfNotExists(indexDefinition);
    }
    async createOrUpdateIndexDefinition(indexName, indexDefinition) {
        return this.searchService.createOrUpdateIndexDefinition(indexName, indexDefinition);
    }
    async indexDocument(indexName, document) {
        return this.searchService.indexDocument(indexName, document);
    }
    async deleteDocument(indexName, document) {
        return this.searchService.deleteDocument(indexName, document);
    }
    async deleteIndex(indexName) {
        return this.searchService.deleteIndex(indexName);
    }
    async search(indexName, searchText, options) {
        return this.searchService.search(indexName, searchText, options);
    }
    async indexExists(indexName) {
        return this.searchService.indexExists(indexName);
    }
}
//# sourceMappingURL=search-service.js.map