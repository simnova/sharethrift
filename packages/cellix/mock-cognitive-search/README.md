# Mock Cognitive Search

Enhanced mock implementation of Azure Cognitive Search powered by Lunr.js for local development environments.

## Overview

This package provides a sophisticated drop-in replacement for Azure Cognitive Search that works entirely in memory, offering advanced search capabilities through Lunr.js integration. It allows developers to build and test search functionality with realistic relevance scoring and advanced features without requiring Azure credentials or external services.

## Features

### Core Functionality
- ✅ In-memory document storage with automatic indexing
- ✅ Full-text search with TF-IDF relevance scoring
- ✅ Field boosting (title gets 10x weight vs description)
- ✅ Fuzzy matching and wildcard support (`bik*`, `bik~1`)
- ✅ Stemming and stop word filtering
- ✅ Multi-field search across all searchable fields

### Code Quality & Standards
- ✅ Full TypeScript support with strict typing
- ✅ Comprehensive JSDoc documentation for all public APIs
- ✅ Follows CellixJS monorepo coding conventions
- ✅ Proper error handling with graceful fallbacks
- ✅ Extensive unit test coverage with Vitest

### Advanced Features
- ✅ **Lunr.js Integration**: Client-side full-text search with relevance scoring
- ✅ **Field Boosting**: Title fields get higher relevance than descriptions
- ✅ **Fuzzy Matching**: Handles typos with edit distance (`~1`)
- ✅ **Wildcard Support**: Prefix matching with `*` operator
- ✅ **Stemming**: Finds "rent" when searching "rental"
- ✅ **Faceting**: Category, boolean, and numeric facet support
- ✅ **Complex Filtering**: OData-style equality filters
- ✅ **Sorting & Pagination**: Full support for ordering and pagination

### Azure Compatibility
- ✅ Index management (create, update, delete)
- ✅ Document lifecycle (index, delete)
- ✅ Search API compatibility
- ✅ Lifecycle management (startup/shutdown)
- ✅ Debug information and statistics

## Lunr.js Integration Architecture

The mock implementation uses Lunr.js internally to provide:

1. **Relevance Scoring**: TF-IDF based scoring for realistic search results
2. **Field Boosting**: Title fields weighted 10x, description 2x, others 1x
3. **Query Enhancement**: Automatic wildcard and fuzzy matching
4. **Index Rebuilding**: Automatic index updates when documents change
5. **Performance**: Fast in-memory search with efficient indexing

## Search Query Syntax

### Basic Search
```typescript
// Simple text search with relevance scoring
await searchService.search('index', 'mountain bike');
```

### Fuzzy Matching
```typescript
// Automatic fuzzy matching for typos
await searchService.search('index', 'bik'); // finds "bike", "bicycle"

// Explicit fuzzy matching
await searchService.search('index', 'bik~1'); // edit distance of 1
```

### Wildcard Support
```typescript
// Prefix matching
await searchService.search('index', 'bik*'); // finds "bike", "bicycle"

// Combined with fuzzy
await searchService.search('index', 'bik* bik~1'); // both prefix and fuzzy
```

### Field Boosting
Titles are automatically boosted 10x over descriptions:
```typescript
// "Mountain Bike" in title will rank higher than "mountain bike" in description
await searchService.search('index', 'mountain bike');
```

## Limitations

Current limitations (planned for future enhancement):

- **Limited OData Support**: Only basic equality filters (`field eq 'value'`)
- **No Geospatial Search**: GeographyPoint fields are not supported
- **No Complex Queries**: No boolean operators or nested filters
- **Memory Only**: No persistence across restarts

## Usage

### Basic Setup
```typescript
import { InMemoryCognitiveSearch } from '@cellix/mock-cognitive-search';

const searchService = new InMemoryCognitiveSearch();

// Initialize the service
await searchService.startup();

// Create an index with searchable fields
await searchService.createIndexIfNotExists({
  name: 'item-listings',
  fields: [
    { name: 'id', type: 'Edm.String', key: true, retrievable: true },
    { name: 'title', type: 'Edm.String', searchable: true, filterable: true },
    { name: 'description', type: 'Edm.String', searchable: true },
    { name: 'category', type: 'Edm.String', filterable: true, facetable: true },
    { name: 'price', type: 'Edm.Double', filterable: true, sortable: true }
  ]
});
```

### Indexing Documents
```typescript
// Index documents with full-text content
await searchService.indexDocument('item-listings', {
  id: '1',
  title: 'Mountain Bike for Sale',
  description: 'High-quality mountain bike perfect for trail riding',
  category: 'Sports',
  price: 500
});

await searchService.indexDocument('item-listings', {
  id: '2', 
  title: 'Road Bike',
  description: 'Lightweight road bike ideal for commuting',
  category: 'Sports',
  price: 300
});
```

### Advanced Search Examples
```typescript
// Basic search with relevance scoring
const basicResults = await searchService.search('item-listings', 'mountain bike');
console.log(basicResults.results[0].score); // Real relevance score

// Fuzzy matching for typos
const fuzzyResults = await searchService.search('item-listings', 'bik'); // finds "bike"

// Wildcard prefix matching
const wildcardResults = await searchService.search('item-listings', 'bik*');

// Combined search with filters
const filteredResults = await searchService.search('item-listings', 'bike', {
  filter: "category eq 'Sports'",
  facets: ['category'],
  top: 10,
  includeTotalCount: true
});

// Sorting by price
const sortedResults = await searchService.search('item-listings', 'bike', {
  orderBy: ['price desc'],
  top: 5
});
```

### Debug Information
```typescript
// Get detailed debug information including Lunr stats
const debugInfo = searchService.getDebugInfo();
console.log(debugInfo.lunrStats); // Lunr index statistics
console.log(debugInfo.documentCounts); // Document counts per index
```

### Cleanup
```typescript
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
