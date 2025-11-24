/**
 * ShareThrift Search Service Index
 *
 * Application-specific search service with index definitions for ShareThrift.
 * Implements the Facade pattern with support for mock search implementation.
 */

export * from './service-search-index.js';
export * from './indexes/item-listing-search-index.js';
export { ServiceSearchIndex as default } from './service-search-index.js';
