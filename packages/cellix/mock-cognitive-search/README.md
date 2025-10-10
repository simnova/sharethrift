# Mock Cognitive Search

A mock implementation of Azure Cognitive Search for local development environments.

## Overview

This package provides a drop-in replacement for Azure Cognitive Search that works entirely in memory, allowing developers to build and test search functionality without requiring Azure credentials or external services.

## Features

- ✅ In-memory document storage
- ✅ Basic text search across searchable fields
- ✅ Simple equality filtering
- ✅ Document indexing and deletion
- ✅ Pagination support
- ✅ Basic sorting
- ✅ Index management
- ✅ Lifecycle management (startup/shutdown)

## Limitations

This mock implementation intentionally simplifies several features:

- **No OData filter parsing**: Only supports simple equality filters (`field eq 'value'`)
- **No faceting**: Returns empty facets object
- **No complex search**: Uses simple string matching
- **No geospatial search**: GeographyPoint fields are not supported
- **No scoring**: All results have a mock score of 1.0

## Usage

```typescript
import { InMemoryCognitiveSearch } from '@cellix/mock-cognitive-search';

const searchService = new InMemoryCognitiveSearch();

// Initialize the service
await searchService.startup();

// Create an index
await searchService.createIndexIfNotExists({
  name: 'my-index',
  fields: [
    { name: 'id', type: 'Edm.String', key: true },
    { name: 'title', type: 'Edm.String', searchable: true },
    { name: 'category', type: 'Edm.String', filterable: true }
  ]
});

// Index a document
await searchService.indexDocument('my-index', {
  id: 'doc1',
  title: 'Sample Document',
  category: 'example'
});

// Search documents
const results = await searchService.search('my-index', 'sample', {
  includeTotalCount: true,
  top: 10
});

// Cleanup
await searchService.shutdown();
```

## Integration

This package is designed to be used as part of the ShareThrift infrastructure service layer. It will be automatically selected in development environments when Azure credentials are not available.

## Environment Variables

- `USE_MOCK_SEARCH=true` - Force use of mock implementation
- `NODE_ENV=development` - Automatically use mock if no Azure credentials

## Development

```bash
# Build the package
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Clean build artifacts
npm run clean
```
