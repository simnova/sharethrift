/**
 * Mock Cognitive Search Package
 *
 * Provides a mock implementation of Azure Cognitive Search for local development.
 * This package allows developers to work with search functionality without requiring
 * Azure credentials or external services.
 */
export * from './in-memory-search.js';
export { InMemoryCognitiveSearch as default } from './in-memory-search.js';
export * from './interfaces.js';
