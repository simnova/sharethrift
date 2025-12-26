/**
 * ShareThrift Search Service Index
 *
 * Application-specific search service with index definitions for ShareThrift.
 * Implements the Facade pattern with support for mock search implementation.
 */

export * from './service-search-index.ts';
export { ServiceSearchIndex as default } from './service-search-index.ts';

// Re-export domain index specs for convenience
export { ListingSearchIndexSpec } from '@sthrift/domain';
