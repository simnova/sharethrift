/**
 * ShareThrift Cognitive Search Service
 *
 * Provides a unified interface for cognitive search functionality with automatic
 * detection between Azure Cognitive Search and mock implementation based on
 * environment configuration.
 */

export * from './search-service.js';
export { ServiceCognitiveSearch as default } from './search-service.js';
export { AzureCognitiveSearch } from './azure-search-service.js';
