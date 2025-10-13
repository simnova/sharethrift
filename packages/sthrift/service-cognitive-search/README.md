# ServiceCognitiveSearch

Cognitive Search service for ShareThrift with automatic detection of Azure vs Mock implementation.

## Overview

The `ServiceCognitiveSearch` provides a unified interface for cognitive search functionality, automatically detecting and switching between Azure Cognitive Search (production) and an in-memory mock implementation (development). This allows developers to work locally without Azure dependencies while ensuring production-ready Azure integration.

## Features

- **🔄 Automatic Implementation Detection**: Intelligently chooses between Azure Cognitive Search and mock implementation
- **🌍 Environment-Aware**: Uses environment variables to determine the appropriate implementation
- **🛡️ Fallback Support**: Gracefully falls back to mock implementation if Azure configuration is invalid
- **🔧 ServiceBase Compatible**: Implements the CellixJS ServiceBase interface for seamless integration
- **📊 Full Feature Parity**: Both implementations support all search operations (indexing, searching, filtering, faceting, sorting)
- **🔒 Multiple Authentication Methods**: Supports API key and Azure managed identity authentication

## Quick Start

```typescript
import { ServiceCognitiveSearch } from '@sthrift/service-cognitive-search';

// Initialize the service (auto-detects implementation)
const searchService = new ServiceCognitiveSearch();

// Start the service
await searchService.startUp();

// Create an index
await searchService.createIndexIfNotExists(indexDefinition);

// Index a document
await searchService.indexDocument('index-name', document);

// Search for documents
const results = await searchService.search('index-name', 'search text', {
  filter: "category eq 'electronics'",
  facets: ['category', 'location'],
  top: 10
});

// Shut down the service
await searchService.shutDown();
```

## Environment Configuration

### Mock Mode (Development)

```bash
# Force mock implementation
USE_MOCK_SEARCH=true

# Optional: Enable persistence for mock data
ENABLE_SEARCH_PERSISTENCE=true
SEARCH_PERSISTENCE_PATH=./.dev-data/search-indexes
```

### Azure Mode (Production)

#### Option 1: API Key Authentication
```bash
SEARCH_API_ENDPOINT=https://your-search-service.search.windows.net
SEARCH_API_KEY=your-admin-api-key
USE_AZURE_SEARCH=true
```

#### Option 2: Managed Identity (Recommended for Production)
```bash
SEARCH_API_ENDPOINT=https://your-search-service.search.windows.net
# No API key needed - uses Azure managed identity
```

### Auto-Detection Mode (Recommended)

```bash
# Set Azure credentials if available, otherwise uses mock
SEARCH_API_ENDPOINT=https://your-search-service.search.windows.net
SEARCH_API_KEY=your-admin-api-key
# Service will automatically choose Azure if credentials are valid
```

## Implementation Details

### Azure Cognitive Search

- Uses the official `@azure/search-documents` SDK
- Supports both API key and Azure credential authentication
- Converts ShareThrift index definitions to Azure format
- Handles all Azure-specific operations (indexing, searching, filtering, faceting)
- Provides comprehensive error handling and logging

### Mock Implementation

- In-memory search using the `@cellix/mock-cognitive-search` package
- Supports all the same operations as Azure implementation
- Optional persistence to disk for development
- Fast and lightweight for local development

## API Reference

### Core Methods

#### `startUp(): Promise<void>`
Initializes the search service and establishes connections.

#### `shutDown(): Promise<void>`
Cleans up resources and closes connections.

#### `createIndexIfNotExists(indexDefinition: SearchIndex): Promise<void>`
Creates a search index if it doesn't already exist.

#### `indexDocument(indexName: string, document: Record<string, unknown>): Promise<void>`
Indexes a document for searching.

#### `search(indexName: string, searchText: string, options?: SearchOptions): Promise<SearchDocumentsResult>`
Performs a search query with optional filtering, faceting, and sorting.

#### `deleteDocument(indexName: string, document: Record<string, unknown>): Promise<void>`
Removes a document from the search index.

#### `deleteIndex(indexName: string): Promise<void>`
Deletes an entire search index.

#### `indexExists(indexName: string): Promise<boolean>`
Checks if a search index exists.

## Integration

The service integrates seamlessly with the ShareThrift ecosystem:

### Event-Driven Indexing
- **Item Listing Updates**: Automatically indexes item listings when they are created or updated
- **Item Listing Deletions**: Removes deleted item listings from the search index
- **Hash-Based Change Detection**: Only re-indexes documents when they have actually changed

### GraphQL API
- Provides search functionality through GraphQL resolvers
- Supports complex search queries with filtering and faceting
- Integrates with the existing GraphQL schema

### Domain Layer
- Uses domain entities and search index specifications
- Follows Domain-Driven Design patterns
- Maintains consistency with the existing domain model

## Examples

### Basic Usage
```typescript
import { ServiceCognitiveSearch } from '@sthrift/service-cognitive-search';

const searchService = new ServiceCognitiveSearch();
await searchService.startUp();

// Create index
await searchService.createIndexIfNotExists({
  name: 'items',
  fields: [
    { name: 'id', type: 'Edm.String', key: true },
    { name: 'title', type: 'Edm.String', searchable: true },
    { name: 'category', type: 'Edm.String', filterable: true }
  ]
});

// Index document
await searchService.indexDocument('items', {
  id: 'item-1',
  title: 'Vintage Camera',
  category: 'electronics'
});

// Search
const results = await searchService.search('items', 'camera');
console.log(`Found ${results.count} results`);
```

### Advanced Search with Filters and Facets
```typescript
const results = await searchService.search('items', 'vintage', {
  filter: "category eq 'electronics'",
  facets: ['category', 'location'],
  top: 10,
  skip: 0,
  orderBy: ['createdAt desc']
});

// Process results
results.results.forEach(result => {
  console.log(`${result.document.title} (Score: ${result.score})`);
});

// Process facets
if (results.facets) {
  Object.entries(results.facets).forEach(([facetName, facetValues]) => {
    console.log(`${facetName}:`);
    facetValues.forEach(facet => {
      console.log(`  ${facet.value}: ${facet.count}`);
    });
  });
}
```

## Error Handling

The service provides comprehensive error handling:

- **Configuration Errors**: Falls back to mock implementation if Azure configuration is invalid
- **Network Errors**: Provides detailed error messages for Azure connectivity issues
- **Index Errors**: Handles index creation and management errors gracefully
- **Search Errors**: Provides meaningful error messages for search failures

## Performance Considerations

### Azure Implementation
- Connection pooling is handled automatically by the Azure SDK
- Search clients are cached per index name for efficiency
- Built-in retry logic for transient failures
- Supports batch operations for efficient indexing

### Mock Implementation
- In-memory operations are extremely fast
- Optional persistence reduces startup time for large datasets
- Minimal memory footprint for development

## Security

### Azure Implementation
- Supports Azure managed identity for secure authentication
- API key rotation is handled through Azure Key Vault
- Network security through private endpoints
- Comprehensive audit logging

### Mock Implementation
- No external dependencies or network calls
- Data persistence is optional and local-only
- Safe for development and testing environments

## Development

### Running Examples
```bash
# Mock mode
USE_MOCK_SEARCH=true node examples/azure-vs-mock-comparison.js

# Azure mode
SEARCH_API_ENDPOINT=https://your-service.search.windows.net \
SEARCH_API_KEY=your-key \
node examples/azure-vs-mock-comparison.js
```

### Building
```bash
npm run build
```

### Testing
```bash
npm test
```

## Troubleshooting

### Common Issues

1. **Azure Connection Failed**: Check your `SEARCH_API_ENDPOINT` and `SEARCH_API_KEY` environment variables
2. **Index Creation Failed**: Verify your Azure service has sufficient quota and permissions
3. **Search Results Empty**: Check that documents are properly indexed and the search query is valid
4. **Mock Data Not Persisting**: Ensure the `SEARCH_PERSISTENCE_PATH` directory is writable

### Debug Mode
Set `NODE_ENV=development` to enable detailed logging for troubleshooting.

## Contributing

1. Follow the existing code patterns and TypeScript conventions
2. Add tests for new functionality
3. Update documentation for any API changes
4. Ensure both Azure and mock implementations work correctly