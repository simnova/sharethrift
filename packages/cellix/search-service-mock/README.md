# Search Service Mock

In-memory search implementation powered by Lunr.js and LiQE for local development and testing.

## Features

- Full-text search with TF-IDF relevance scoring
- Field boosting (title 10x, description 2x weight)
- Fuzzy matching and wildcard support
- OData-style filtering via LiQE (eq, ne, gt, lt, contains, startswith, endswith)
- Sorting, pagination, and faceting
- Azure Cognitive Search API compatibility

## Usage

```typescript
import { InMemoryCognitiveSearch } from '@cellix/search-service-mock';

const searchService = new InMemoryCognitiveSearch();
await searchService.startUp();

// Create index
await searchService.createIndexIfNotExists({
  name: 'items',
  fields: [
    { name: 'id', type: 'Edm.String', key: true },
    { name: 'title', type: 'Edm.String', searchable: true },
    { name: 'category', type: 'Edm.String', filterable: true, facetable: true }
  ]
});

// Index documents
await searchService.indexDocument('items', {
  id: '1',
  title: 'Mountain Bike',
  category: 'Sports'
});

// Search with filters
const results = await searchService.search('items', 'bike', {
  filter: "category eq 'Sports'",
  top: 10,
  includeTotalCount: true
});
```

## Examples

Run filtering examples:

```bash
npm run examples
```

