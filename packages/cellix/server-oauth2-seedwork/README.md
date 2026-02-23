# @cellix/server-oauth2-seedwork

Core OAuth2/OIDC mock server logic for CellixJS monorepo. This seedwork contains all business logic for the OAuth2 server but is agnostic to project-specific configuration.

## Usage

```typescript
import { startMockOAuth2Server, type OAuth2Config } from '@cellix/server-oauth2-seedwork';
import { setupEnvironment } from '@cellix/server-oauth2-seedwork/setup-environment';

// Setup environment variables
setupEnvironment();

// Configure the server
const config: OAuth2Config = {
  port: 4000,
  baseUrl: 'http://localhost:4000',
  allowedRedirectUris: new Set(['http://localhost:3000/auth-redirect-user']),
  redirectUriToAudience: new Map([['http://localhost:3000/auth-redirect-user', 'user-portal']]),
  getUserProfile: (isAdminPortal) => ({
    email: 'user@example.com',
    givenName: 'Test',
    familyName: 'User',
    adminEmail: 'admin@example.com',
    adminGivenName: 'Admin',
    adminFamilyName: 'User',
  }),
};

// Start the server
startMockOAuth2Server(config).catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
```

## Exports

- `startMockOAuth2Server` - Main function to start the OAuth2 server
- `setupEnvironment` - Utility to setup environment variables from `.env` and `.env.local`
- Type exports: `OAuth2Config`, `UserProfile`, etc.

