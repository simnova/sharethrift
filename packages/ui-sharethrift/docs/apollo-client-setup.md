# Apollo Client Setup

This document provides examples of how to use the enhanced Apollo Client configuration.

## Overview

The Apollo Client setup provides:

- **Authentication Handling**: Automatically includes `Authorization` header when user is authenticated
- **Custom Headers**: Adds standard headers (`x-client-id`, `x-request-id`) and allows additional custom headers
- **Batching Support**: Configurable batching for GraphQL requests
- **Extensible Architecture**: Easy to add new headers or routing logic

## Basic Usage

The Apollo Client is automatically configured when you wrap your app with `ApolloConnection`:

```tsx
import { ApolloConnection } from './components/shared/apollo-connection';

function App() {
  return (
    <ApolloConnection>
      {/* Your app components */}
    </ApolloConnection>
  );
}
```

## Headers Added Automatically

Every GraphQL request will include:

### Standard Headers
- `x-client-id`: `'ui-sharethrift'` (from environment or default)
- `x-request-id`: Unique ID per request (format: `req_{timestamp}_{random}`)

### Authentication Header (when authenticated)
- `Authorization`: `Bearer {access_token}` (from react-oidc-context)

### Custom Headers (configurable)
- `x-app-version`: From `VITE_APP_VERSION` environment variable
- Any additional headers configured in `ApolloConnection`

## Configuration

### Environment Variables

Set these in your `.env` file:

```env
VITE_FUNCTION_ENDPOINT=http://localhost:4000/graphql
VITE_CLIENT_ID=ui-sharethrift
VITE_APP_VERSION=1.0.0
```

### Adding Custom Headers

Modify the `apolloConfig` in `apollo-connection.tsx`:

```tsx
const apolloConfig: ApolloClientConfig = {
  uri: `${import.meta.env.VITE_FUNCTION_ENDPOINT}`,
  batchMax: 15,
  batchInterval: 50,
  customHeaders: {
    'x-app-version': import.meta.env.VITE_APP_VERSION || '1.0.0',
    'x-feature-flag': 'new-ui-enabled',
    'x-environment': import.meta.env.NODE_ENV,
    // Add more custom headers as needed
  } as CustomHeaders
};
```

## Testing

Comprehensive tests are provided for:

- Header injection (authentication and custom)
- Link chain construction
- Component integration

Run tests with:

```bash
npm run test:run
```

## Example Request Headers

When a user is authenticated, requests will include headers like:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
x-client-id: ui-sharethrift
x-request-id: req_1704067200000_abc123def
x-app-version: 1.0.0
Content-Type: application/json
```

When unauthenticated:

```
x-client-id: ui-sharethrift
x-request-id: req_1704067200000_xyz789ghi
x-app-version: 1.0.0
Content-Type: application/json
```

## Advanced Usage

### Adding Conditional Headers

Use `ApolloLinkToAddCustomHeader` for conditional headers:

```tsx
// Add community header only when not in accounts context
ApolloLinkToAddCustomHeader('x-community-id', communityId, (communityId !== 'accounts'))
```

### Multiple Custom Headers

Use `ApolloLinkToAddCustomHeaders` for multiple headers at once:

```tsx
const userHeaders = {
  'x-user-role': user?.role,
  'x-user-preferences': JSON.stringify(user?.preferences)
};

ApolloLinkToAddCustomHeaders(userHeaders)
```

## Link Chain Architecture

The Apollo Link chain is constructed as:

1. **BaseApolloLink**: Adds standard custom headers
2. **ApolloLinkToAddAuthHeader**: Adds authentication header
3. **TerminatingApolloLinkForGraphqlServer**: Handles HTTP transport with batching

This modular approach makes it easy to add new links or modify the chain order.