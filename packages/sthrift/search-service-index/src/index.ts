/**
 * ShareThrift Search Service Index
 *
 * Application-specific search service with index definitions for ShareThrift.
 * Also re-exports mock search primitives used by legacy adapters.
 */

export * from './service-search-index.ts';
export { ServiceSearchIndex as default } from './service-search-index.ts';

// Legacy and utility exports used by other packages.
export * from './in-memory-search.js';
export * from './interfaces.js';
export * from './lunr-search-engine.js';
export * from './liqe-filter-engine.js';

// Re-export domain index spec for convenience.
export { ListingSearchIndexSpec } from '@sthrift/domain';
