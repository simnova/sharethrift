# service-mock-cognitive-search

An in-memory mock for Azure Cognitive Search, similar to `mongodb-memory-server`. Use this for local development and testing without connecting to Azure.

## Usage

```typescript
import { MockCognitiveSearch } from 'service-mock-cognitive-search';

const search = new MockCognitiveSearch();
await search.createIndexIfNotExists({ name: 'my-index', fields: [] });
await search.indexDocument('my-index', { id: '1', title: 'Test Document' });
const results = await search.search('my-index', 'Test');
```

## Scripts
- `npm run build` — Build the TypeScript source
- `npm run start` — Run the built code
- `npm test` — Run tests

## License
MIT
