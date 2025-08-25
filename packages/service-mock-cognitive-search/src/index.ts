import type { SearchDocumentsResult, SearchIndex } from '@azure/search-documents';
import type { CognitiveSearchBase } from './services-seedwork-cognitive-search-interfaces';

export class AzCognitiveSearch implements CognitiveSearchBase {
  private indexes: Map<string, { definition: SearchIndex, documents: Record<string, unknown>[] }> = new Map();
  private mongoUri: string;
  private dbName: string;

  constructor() {
    this.mongoUri = process.env['COSMOSDB_CONNECTION_STRING'] ?? '';
    this.dbName = process.env['COSMOSDB_DBNAME'] ?? '';
    if (!this.mongoUri) {
      throw new Error('MongoDB connection string is required');
    }
    if (!this.dbName) {
      throw new Error('MongoDB database name is required');
    }
    void this.initializeIndexes();
  }

  private async initializeIndexes(): Promise<void> {
    const client = new (await import('mongodb')).MongoClient(this.mongoUri);
    await client.connect();
    const db = client.db(this.dbName);
    const collections = await db.listCollections().toArray();
    for (const coll of collections) {
      const collection = db.collection(coll.name);
      const docs = await collection.find({}).toArray();
      this.indexes.set(coll.name, { definition: { name: coll.name, fields: [] }, documents: docs as Record<string, unknown>[] });
    }
    await client.close();
  }

  indexExists(indexName: string): boolean {
    return this.indexes.has(indexName);
  }

  createIndexIfNotExists(indexDefinition: SearchIndex): void {
    if (!this.indexes.has(indexDefinition.name)) {
      this.indexes.set(indexDefinition.name, { definition: indexDefinition, documents: [] });
    }
  }

  createOrUpdateIndexDefinition(indexName: string, indexDefinition: SearchIndex): void {
    this.indexes.set(indexName, { definition: indexDefinition, documents: [] });
  }

  search(indexName: string, searchText: string, _options?: Record<string, unknown>): SearchDocumentsResult<Record<string, unknown>> {
    const startTime = Date.now();
    const index = this.indexes.get(indexName);
    if (!index) throw new Error(`Index ${indexName} does not exist`);
    const results = index.documents.filter((doc: Record<string, unknown>) =>
      Object.values(doc).some(val => typeof val === 'string' && val.includes(searchText))
    );
    console.log(`SearchLibrary took ${Date.now() - startTime}ms`);
    return { results } as SearchDocumentsResult<Record<string, unknown>>;
  }

  deleteDocument(indexName: string, document: Record<string, unknown>): void {
    const index = this.indexes.get(indexName);
    if (!index) throw new Error(`Index ${indexName} does not exist`);
    index.documents = index.documents.filter(doc => doc.id !== document.id);
  }

  indexDocument(indexName: string, document: Record<string, unknown>): void {
    const index = this.indexes.get(indexName);
    if (!index) throw new Error(`Index ${indexName} does not exist`);
    index.documents.push(document);
  }

  deleteIndex(indexName: string): void {
    this.indexes.delete(indexName);
  }
}
