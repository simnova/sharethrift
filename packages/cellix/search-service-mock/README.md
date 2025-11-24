# Mock Cognitive Search

Enhanced mock implementation of Azure Cognitive Search powered by Lunr.js and LiQE for local development environments.

## Overview

This package provides a sophisticated drop-in replacement for Azure Cognitive Search that works entirely in memory, offering advanced search capabilities through Lunr.js and LiQE integration. It allows developers to build and test search functionality with realistic relevance scoring, advanced filtering, and complex query capabilities without requiring Azure credentials or external services.

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
- ✅ **LiQE Integration**: Advanced OData-style filtering with complex expressions
- ✅ **Advanced Filtering**: Comparison operators, logical operators, string functions
- ✅ **Sorting & Pagination**: Full support for ordering and pagination

### Azure Compatibility
- ✅ Index management (create, update, delete)
- ✅ Document lifecycle (index, delete)
- ✅ Search API compatibility
- ✅ Lifecycle management (startup/shutdown)
- ✅ Debug information and statistics

## Architecture Overview

The mock implementation combines Lunr.js and LiQE to provide comprehensive search capabilities:

### Lunr.js Integration
1. **Relevance Scoring**: TF-IDF based scoring for realistic search results
2. **Field Boosting**: Title fields weighted 10x, description 2x, others 1x
3. **Query Enhancement**: Automatic wildcard and fuzzy matching
4. **Index Rebuilding**: Automatic index updates when documents change
5. **Performance**: Fast in-memory search with efficient indexing

### LiQE Integration
1. **OData Compatibility**: Full support for Azure Cognitive Search filter syntax
2. **Advanced Operators**: Comparison (`eq`, `ne`, `gt`, `lt`, `ge`, `le`) and logical (`and`, `or`) operators
3. **String Functions**: `contains()`, `startswith()`, `endswith()` for text filtering
4. **Complex Expressions**: Nested logical expressions with proper precedence
5. **Type Safety**: Robust parsing with validation and error handling

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

## Advanced Filtering with LiQE

The mock implementation supports full OData-style filtering through LiQE integration:

### Comparison Operators
```typescript
// Equality
await searchService.search('index', '', { filter: "category eq 'Sports'" });

// Inequality
await searchService.search('index', '', { filter: "price ne 500" });

// Greater than
await searchService.search('index', '', { filter: "price gt 100" });

// Less than or equal
await searchService.search('index', '', { filter: "price le 1000" });
```

### String Functions
```typescript
// Contains (case-insensitive)
await searchService.search('index', '', { filter: "contains(title, 'Bike')" });

// Starts with
await searchService.search('index', '', { filter: "startswith(title, 'Mountain')" });

// Ends with
await searchService.search('index', '', { filter: "endswith(title, 'Sale')" });
```

### Logical Operators
```typescript
// AND operator
await searchService.search('index', '', { 
  filter: "category eq 'Sports' and price gt 200" 
});

// OR operator
await searchService.search('index', '', { 
  filter: "category eq 'Sports' or category eq 'Urban'" 
});

// Complex nested expressions
await searchService.search('index', '', { 
  filter: "(category eq 'Sports' or category eq 'Urban') and price le 1000" 
});
```

### Combined Search and Filtering
```typescript
// Full-text search with advanced filtering
await searchService.search('index', 'bike', {
  filter: "contains(title, 'Mountain') and price gt 300",
  facets: ['category'],
  top: 10,
  includeTotalCount: true
});
```

## Limitations

Current limitations (planned for future enhancement):

- **No Geospatial Search**: GeographyPoint fields are not supported
- **Limited Geospatial**: No `geo.distance()` or location-based filtering
- **Memory Only**: No persistence across restarts
- **No Custom Analyzers**: Uses default text analysis (planned for future)

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

// Advanced filtering with LiQE
const advancedFilteredResults = await searchService.search('item-listings', 'bike', {
  filter: "contains(title, 'Mountain') and price gt 300",
  facets: ['category'],
  top: 10,
  includeTotalCount: true
});

// Complex logical expressions
const complexResults = await searchService.search('item-listings', '', {
  filter: "(category eq 'Sports' or category eq 'Urban') and price le 1000",
  orderBy: ['price desc'],
  top: 5
});

// String function filtering
const stringFunctionResults = await searchService.search('item-listings', '', {
  filter: "startswith(title, 'Mountain') or endswith(title, 'Bike')"
});
```

### Debug Information
```typescript
// Get detailed debug information including Lunr and LiQE stats
const debugInfo = searchService.getDebugInfo();
console.log(debugInfo.lunrStats); // Lunr index statistics
console.log(debugInfo.documentCounts); // Document counts per index

// Check LiQE filter capabilities
const filterEngine = searchService.getFilterCapabilities();
console.log(filterEngine.supportedFeatures); // Available operators and functions
console.log(filterEngine.isFilterSupported("price gt 100")); // true
```

### Cleanup
```typescript
await searchService.shutdown();
```

## Examples

The package includes comprehensive examples demonstrating all LiQE filtering capabilities:

```bash
# Run all examples
npm run examples
```

The examples cover:
- **Basic Comparison Operators**: `eq`, `ne`, `gt`, `lt`, `ge`, `le`
- **String Functions**: `contains()`, `startswith()`, `endswith()`
- **Logical Operators**: `and`, `or` with complex nested expressions
- **Combined Search**: Full-text search with advanced filtering
- **Filter Validation**: Capability checking and syntax validation

See `examples/liqe-filtering-examples.ts` for detailed implementation examples.

## Integration

This package is designed to be used as part of the ShareThrift infrastructure service layer. It will be automatically selected in development environments when Azure credentials are not available.

## Environment Variables

- `USE_MOCK_SEARCH=true` - Force use of mock implementation
- `NODE_ENV=development` - Automatically use mock if no Azure credentials
- `AZURE_SEARCH_ENDPOINT` - Azure Cognitive Search endpoint (required for production)
- `SEARCH_API_KEY` - Azure Cognitive Search API key (optional, uses DefaultAzureCredential if not provided)
- `LOG_LEVEL` - Set logging verbosity: `error`, `warn`, `info` (default in dev), or `debug` (defaults to `error` in production)

## Development

```bash
# Build the package
npm run build

# Run tests
npm test

# Run LiQE filtering examples
npm run examples

# Lint code
npm run lint

# Clean build artifacts
npm run clean
```
