/**
 * Search Service Mock Package
 *
 * Provides a mock implementation of SearchService for local development.
 * This package allows developers to work with search functionality without requiring
 * Azure credentials or external services.
 */

export * from './in-memory-search.ts';
// Default export for convenience
export { InMemoryCognitiveSearch as default } from './in-memory-search.ts';
export * from './lunr-search-engine.ts';
export * from './liqe-filter-engine.ts';
