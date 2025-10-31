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
 */
class InMemoryCognitiveSearch {
    indexes = new Map();
    documents = new Map();
    lunrEngine;
    isInitialized = false;
    constructor(options = {}) {
        // Store options for future use
        void options;
        // Initialize Lunr.js search engine
        this.lunrEngine = new LunrSearchEngine();
    }
    startup() {
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
    shutdown() {
        console.log('InMemoryCognitiveSearch: Shutting down...');
        this.isInitialized = false;
        console.log('InMemoryCognitiveSearch: Shutdown complete');
        return Promise.resolve();
    }
    createIndexIfNotExists(indexDefinition) {
        if (this.indexes.has(indexDefinition.name)) {
            return Promise.resolve();
        }
        console.log(`Creating index: ${indexDefinition.name}`);
        this.indexes.set(indexDefinition.name, indexDefinition);
        this.documents.set(indexDefinition.name, new Map());
        // Initialize Lunr index with empty documents
        this.lunrEngine.buildIndex(indexDefinition.name, indexDefinition.fields, []);
        return Promise.resolve();
    }
    createOrUpdateIndexDefinition(indexName, indexDefinition) {
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
    indexDocument(indexName, document) {
        if (!this.indexes.has(indexName)) {
            return Promise.reject(new Error(`Index ${indexName} does not exist`));
        }
        const documentMap = this.documents.get(indexName);
        if (!documentMap) {
            return Promise.reject(new Error(`Document storage not found for index ${indexName}`));
        }
        const documentId = document['id'];
        if (!documentId) {
            return Promise.reject(new Error('Document must have an id field'));
        }
        console.log(`Indexing document ${documentId} in index ${indexName}`);
        documentMap.set(documentId, { ...document });
        // Update Lunr index
        this.lunrEngine.addDocument(indexName, document);
        return Promise.resolve();
    }
    deleteDocument(indexName, document) {
        if (!this.indexes.has(indexName)) {
            return Promise.reject(new Error(`Index ${indexName} does not exist`));
        }
        const documentMap = this.documents.get(indexName);
        if (!documentMap) {
            return Promise.reject(new Error(`Document storage not found for index ${indexName}`));
        }
        const documentId = document['id'];
        if (!documentId) {
            return Promise.reject(new Error('Document must have an id field'));
        }
        console.log(`Deleting document ${documentId} from index ${indexName}`);
        documentMap.delete(documentId);
        // Update Lunr index
        this.lunrEngine.removeDocument(indexName, documentId);
        return Promise.resolve();
    }
    deleteIndex(indexName) {
        console.log(`Deleting index: ${indexName}`);
        this.indexes.delete(indexName);
        this.documents.delete(indexName);
        return Promise.resolve();
    }
    search(indexName, searchText, options) {
        if (!this.indexes.has(indexName)) {
            return Promise.resolve({ results: [], count: 0, facets: {} });
        }
        // Use Lunr.js for enhanced search with relevance scoring
        const result = this.lunrEngine.search(indexName, searchText, options);
        return Promise.resolve(result);
    }
    /**
     * Debug method to inspect current state
     */
    getDebugInfo() {
        const documentCounts = {};
        const lunrStats = {};
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
//# sourceMappingURL=in-memory-search.js.map