# Authentication Implementation

This document describes the authentication system implemented for ShareThrift as an alternative to Azure B2C.

## Overview

The authentication system provides a complete auth flow for both frontend (React) and backend (GraphQL API) that can work in development mode with mock authentication and production mode with real OIDC providers.

## Architecture

### Frontend (UI Package)

- **AuthProvider Component**: Smart wrapper that switches between simple auth (development) and OIDC (production)
- **Simple Auth Mode**: Uses localStorage for session persistence with mock user data
- **OIDC Mode**: Uses `react-oidc-context` for production authentication
- **Apollo Client Integration**: Automatically adds Bearer tokens to GraphQL requests

### Backend (API Package)

- **Token Validation**: Validates Bearer tokens from Authorization headers
- **User Context**: Provides authenticated user information to GraphQL resolvers
- **Passport Integration**: User context available through domain execution context

## Development Mode

In development mode (`NODE_ENV=development` or `VITE_AUTH_MODE=development`):

1. User clicks "Sign In" button
2. Mock authentication simulates login process
3. Mock user data is stored in localStorage
4. Mock JWT token is sent with API requests
5. Backend recognizes mock token and provides user context

### Mock User Data
```typescript
{
  access_token: 'mock-access-token-dev',
  profile: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    sub: 'user-123'
  }
}
```

## Production Mode

In production mode, the system uses real OIDC provider configuration:

```typescript
{
  authority: 'https://your-oidc-provider.com',
  client_id: 'your-client-id',
  redirect_uri: 'https://your-app.com/callback',
  // ... other OIDC settings
}
```

## API Endpoints

### GraphQL Schema

```graphql
type User {
  id: ID!
  email: String!
  name: String
}

type Query {
  hello: String
  me: User  # Returns current authenticated user
}
```

### Authentication Flow

1. Frontend sends GraphQL request with `Authorization: Bearer <token>` header
2. Backend validates token in GraphQL context middleware
3. User information is available in all resolvers via `context.passport`
4. Unauthenticated requests return appropriate errors

## Environment Variables

### Frontend (.env)
```
VITE_AUTH_MODE=development  # or production
VITE_AUTH_AUTHORITY=https://your-oidc-provider.com
VITE_AUTH_CLIENT_ID=your-client-id
VITE_AUTH_REDIRECT_URI=https://your-app.com/callback
VITE_FUNCTION_ENDPOINT=http://localhost:7071/api/graphql
```

### Backend
No additional environment variables required for basic auth functionality.

## Migration to Azure B2C

To migrate to Azure B2C:

1. Configure B2C tenant and application
2. Update environment variables with B2C endpoints
3. Set `VITE_AUTH_MODE=production`
4. Update backend token validation to use B2C JWT validation
5. Test the complete flow

The current implementation provides a smooth migration path to real B2C without code changes to the auth flow logic.

## Testing

### Manual Testing

1. Start the application: `npm run start`
2. Navigate to UI: `http://localhost:5173`
3. Click "Sign In" - should authenticate and show main app
4. Check browser localStorage for auth state
5. Make GraphQL requests to test API authentication

### API Testing with curl

```bash
# Unauthenticated request
curl -X POST http://localhost:7071/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ hello }"}'

# Authenticated request
curl -X POST http://localhost:7071/api/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer mock-access-token-dev" \
  -d '{"query": "{ me { id email name } }"}'
```

## Security Considerations

- Mock authentication is only for development
- Production tokens should be properly validated
- Implement proper JWT signature verification for production
- Use HTTPS in production
- Implement token refresh logic
- Add proper error handling for expired tokens