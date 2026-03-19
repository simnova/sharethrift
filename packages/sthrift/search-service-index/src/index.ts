/**
<<<<<<< HEAD:packages/cellix/mock-cognitive-search/src/index.ts
 * Mock Cognitive Search Package
 *
 * Provides a mock implementation of Azure Cognitive Search for local development.
 * This package allows developers to work with search functionality without requiring
 * Azure credentials or external services.
 */

export * from './in-memory-search.js';
// Default export for convenience
export { InMemoryCognitiveSearch as default } from './in-memory-search.js';
export * from './interfaces.js';
export * from './lunr-search-engine.js';
export * from './liqe-filter-engine.js';
=======
 * ShareThrift Search Service Index
 *
 * Application-specific search service with index definitions for ShareThrift.
 * Implements the Facade pattern with support for mock search implementation.
 */

export * from './service-search-index.ts';
export { ServiceSearchIndex as default } from './service-search-index.ts';

// Re-export domain index specs for convenience
export { ListingSearchIndexSpec } from '@sthrift/domain';
>>>>>>> 1708f96b4db82aa21d258f468d86a6520298bb75:packages/sthrift/search-service-index/src/index.ts
