export { GeographyPoint, SearchIndex, SearchDocumentsResult } from '@azure/search-documents';
import type { SearchIndex } from '@azure/search-documents';

export interface CognitiveSearchBase {
  createIndexIfNotExists(indexDefinition: SearchIndex): Promise<void>;
  createOrUpdateIndexDefinition(indexName: string, indexDefinition: SearchIndex): Promise<void>;
  deleteDocument(indexName: string, document: Record<string, unknown>): Promise<void>;
  indexDocument(indexName: string, document: Record<string, unknown>): Promise<void>;
  deleteIndex(indexName: string): Promise<void>;
  indexExists(indexName: string): Promise<boolean>;
}
