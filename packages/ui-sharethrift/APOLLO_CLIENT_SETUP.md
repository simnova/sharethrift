# Apollo Client Enhancement Documentation

## Overview

The Apollo Client configuration has been enhanced to provide robust authentication handling, automatic custom headers, and flexible terminating links for both batched and standard GraphQL requests.

## Key Features

### 1. Automatic Custom Headers

The Apollo Client now automatically includes the following headers with every request:

- `x-client-id`: Identifies the client application (currently: `ui-sharethrift-client`)
- `x-request-id`: Unique identifier for each request (format: `req-{timestamp}-{random}`)

### 2. Authentication Integration

- Seamlessly integrates with `react-oidc-context`
- Automatically adds `Authorization: Bearer <token>` header when user is authenticated
- Gracefully handles unauthenticated state

### 3. Flexible Terminating Links

Two types of terminating links are available:

- **Batched Requests**: `TerminatingApolloLinkForBatchedGraphqlServer` (default)
  - Combines multiple operations into single HTTP requests
  - Configurable `batchMax` (default: 15) and `batchInterval` (default: 50ms)
  
- **Standard Requests**: `TerminatingApolloLinkForStandardGraphqlServer`
  - Individual HTTP requests for each operation
  - Useful for specific operations that need immediate execution

### 4. Extensible Custom Headers

Easily add additional custom headers:

```typescript
const customHeaders = {
  'x-tenant-id': 'tenant-123',
  'x-user-role': () => getUserRole(), // Dynamic headers via functions
  'x-static-header': 'static-value'
};

<ApolloConnection customHeaders={customHeaders}>
  <App />
</ApolloConnection>
```

## Configuration Options

### ApolloConnection Props

```typescript
interface ApolloConnectionProps {
  children: React.ReactNode;
  customHeaders?: CustomHeadersConfig; // Additional headers to include
  useBatchedRequests?: boolean; // Whether to use batched (true) or standard (false) HTTP link
}
```

### Custom Headers Configuration

```typescript
interface CustomHeadersConfig {
  [key: string]: string | (() => string) | undefined;
}
```

## Usage Examples

### Basic Usage (Default Configuration)

```typescript
import { ApolloConnection } from './components/shared/apollo-connection';

function App() {
  return (
    <ApolloConnection>
      {/* Your app components */}
    </ApolloConnection>
  );
}
```

### With Custom Headers

```typescript
const customHeaders = {
  'x-organization-id': organizationId,
  'x-user-preferences': () => JSON.stringify(getUserPreferences())
};

<ApolloConnection customHeaders={customHeaders}>
  <App />
</ApolloConnection>
```

### Using Standard (Non-Batched) Requests

```typescript
<ApolloConnection useBatchedRequests={false}>
  <App />
</ApolloConnection>
```

## Headers Included in Every Request

1. **Default Headers** (always included):
   - `x-client-id`: ui-sharethrift-client
   - `x-request-id`: req-{timestamp}-{random}

2. **Authentication Header** (when user is authenticated):
   - `Authorization`: Bearer {access_token}

3. **Custom Headers** (when provided):
   - Any additional headers specified via `customHeaders` prop

## Testing

Comprehensive tests are included for:

- Utility functions (request ID generation, client ID)
- Apollo Link creation and configuration
- Integration testing with React components
- Authentication state handling
- Custom headers functionality

Run tests with:
```bash
npm run test
```

## Implementation Details

The enhancement builds upon the existing Apollo Client setup and maintains backward compatibility. The main improvements are:

1. **Enhanced BaseApolloLink**: Now automatically includes default custom headers and supports additional custom headers
2. **Separated Terminating Links**: Clear distinction between batched and standard HTTP links
3. **Improved Type Safety**: Full TypeScript support with proper interfaces
4. **Better Dependency Management**: Proper useCallback/useMemo usage to prevent unnecessary re-renders
5. **Comprehensive Testing**: Unit and integration tests ensure reliability

## Migration

Existing code using `ApolloConnection` will continue to work without changes. The old `TerminatingApolloLinkForGraphqlServer` is maintained as an alias to `TerminatingApolloLinkForBatchedGraphqlServer` for backward compatibility.

To take advantage of new features, update your `ApolloConnection` usage to include `customHeaders` or set `useBatchedRequests` as needed.