# ShareThrift Cognitive Search Service

A unified cognitive search service for ShareThrift that automatically detects and switches between Azure Cognitive Search and mock implementation based on environment configuration.

## Overview

This service provides a seamless development experience by automatically choosing the appropriate search implementation:

- **Development**: Uses mock implementation by default (no Azure credentials needed)
- **Production**: Uses Azure Cognitive Search with managed identity
- **Testing**: Uses mock implementation for fast, isolated tests

## Features

- ✅ Automatic implementation detection
- ✅ Environment-based configuration
- ✅ Service lifecycle management
- ✅ Drop-in replacement for Azure Cognitive Search
- ✅ Development-friendly defaults

## Environment Variables

### Development Mode (Default)
```bash
NODE_ENV=development
# No additional configuration needed - uses mock automatically
```

### Force Mock Mode
```bash
USE_MOCK_SEARCH=true
```

### Force Azure Mode
```bash
USE_AZURE_SEARCH=true
SEARCH_API_ENDPOINT=https://your-search.search.windows.net
```

### Azure with Managed Identity (Production)
```bash
NODE_ENV=production
SEARCH_API_ENDPOINT=https://prod-search.search.windows.net
MANAGED_IDENTITY_CLIENT_ID=your-client-id
```

### Optional Configuration
```bash
# Enable persistence for mock implementation
ENABLE_SEARCH_PERSISTENCE=true
SEARCH_PERSISTENCE_PATH=./.dev-data/search-indexes
```

## Usage

```typescript
import { ServiceCognitiveSearch } from '@sthrift/service-cognitive-search';

// Create service instance
const searchService = new ServiceCognitiveSearch();

// Start the service
await searchService.startup();

// Use search functionality
const results = await searchService.search('my-index', 'search text', {
  includeTotalCount: true,
  top: 10
});

// Stop the service
await searchService.shutdown();
```

## Integration

This service is designed to be registered in the ShareThrift infrastructure service registry:

```typescript
// In apps/api/src/index.ts
import { ServiceCognitiveSearch } from '@sthrift/service-cognitive-search';

Cellix.initializeInfrastructureServices((serviceRegistry) => {
  serviceRegistry.registerInfrastructureService(new ServiceCognitiveSearch());
});
```

## Implementation Detection Logic

1. **Force Mock**: If `USE_MOCK_SEARCH=true`
2. **Force Azure**: If `USE_AZURE_SEARCH=true`
3. **Auto-detect**:
   - Development + No Azure endpoint → Mock
   - Has Azure endpoint → Azure
   - Development (default) → Mock
   - Production (default) → Azure

## Development

```bash
# Build the package
npm run build

# Run tests
npm test

# Lint code
npm run lint
```
