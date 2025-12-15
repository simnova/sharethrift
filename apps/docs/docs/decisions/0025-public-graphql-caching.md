---
sidebar_position: 25
sidebar_label: 0025 Public GraphQL Caching
description: "Decision record for public GraphQL caching with CDN support"
status:
contact: jason-t-hankins
date: 2025-12-12
deciders: 
consulted: 
informed:
---

# Public GraphQL Caching for CDN and Network Providers

## Context and Problem Statement

ShareThrift serves both authenticated users (managing events, communities, memberships) and unauthenticated visitors (browsing public event listings, viewing community pages). Public content could benefit from CDN caching (Cloudflare, Fastly) and network provider caching, but GraphQL's default behavior creates challenges:

1. JWT tokens in requests prevent public caching
2. POST requests aren't cached by CDNs by default
3. Full query strings increase bandwidth consumption
4. Risk of accidentally caching authenticated data and exposing sensitive information

We need guidance for enabling public caching of unauthenticated queries while maintaining security.

## Decision Drivers

- **Security**: Prevent JWT token leakage and accidental caching of sensitive data
- **Performance**: Reduce server load and improve response times for public content
- **Compatibility**: Work with existing GraphQL tooling (Apollo Client/Server)
- **Maintainability**: Clear separation between public and private queries
- **Measurability**: Validate caching effectiveness through monitoring

## Considered Options

### Option 1: Separate Endpoints (Public + Authenticated)

Create two distinct GraphQL endpoints:
- `/graphql` - Authenticated, requires JWT, POST requests
- `/graphql-public` - No auth, GET requests with APQ

### Option 2: Same Endpoint with Conditional Auth

Use a single endpoint with conditional authentication based on query/operation.

### Option 3: No Public Caching

Continue with current approach - all queries authenticated, no public caching.

## Decision Outcome

Chosen option: **Separate endpoints** - `/graphql` for authenticated requests and `/graphql-public` for public requests.

**Security**: Physical separation eliminates token leakage risk. Public endpoint never sees Authorization headers.

**Performance**: Each endpoint optimized for its use case - public uses GET requests with APQ and HTTP caching, authenticated uses POST with HTTP batching and DataLoader.

**Compatibility**: Standard HTTP caching works with any CDN without custom configuration.

**Maintainability**: Clear boundaries make public queries easy to audit and validate.

## Implementation Details

### Server Architecture

```typescript
// Single Apollo Server with dual endpoints

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    {
      async requestDidStart() {
        return {
          async willSendResponse({ response, contextValue }) {
            // Set cache headers based on endpoint
            if (contextValue.isPublic) {
              response.http.headers.set('Cache-Control', 'public, max-age=300, s-maxage=3600');
            } else {
              response.http.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            }
          },
        };
      },
    },
  ],
  persistedQueries: { cache: undefined },
  csrfPrevention: false, // Allow GET requests, requires further security safeguards, headers, rate limiting, etc.
});

// Authenticated endpoint
app.use('/graphql', expressMiddleware(server, {
  context: async () => ({
    loaders: createDataLoaders(collections),
    collections,
    isPublic: false,
  }),
}));

// Public endpoint with GET request transformation
app.use('/graphql-public',
  (req, _res, next) => {
    // Transform GET query params to req.body for Apollo Server
    if (req.method === 'GET' && req.query) {
      req.body = {
        operationName: req.query.operationName,
        variables: req.query.variables ? JSON.parse(req.query.variables) : undefined,
        extensions: req.query.extensions ? JSON.parse(req.query.extensions) : undefined,
        query: req.query.query,
      };
    }
    next();
  },
  expressMiddleware(server, {
    context: async () => ({
      loaders: createDataLoaders(collections),
      collections,
      isPublic: true,
    }),
  })
);
```

### Client Configuration

```typescript
// Authenticated Apollo Client
export const authenticatedClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  link: from([
    setContext((_, { headers }) => {
      const token = localStorage.getItem('auth_token');
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
        },
      };
    }),
    createHttpLink({ uri: 'http://localhost:4000/graphql' }),
  ]),
});

// Public Apollo Client with APQ and GET requests
export const publicClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql-public',
  cache: new InMemoryCache(),
  link: createPersistedQueryLink({
    sha256: async (query) => {
      const { createHash } = await import('crypto-hash');
      return createHash('sha256').update(query).digest('hex');
    },
    useGETForHashedQueries: true,
  }).concat(
    createHttpLink({
      uri: 'http://localhost:4000/graphql-public',
    })
  ),
});
```

### Schema Design

Define public queries explicitly:

```graphql
# Public schema subset
type Query {
  publicFeed(first: Int, after: String): PostConnection!
  publicPost(id: ID!): Post
  publicUser(username: String!): PublicUserProfile
}

# Authenticated schema (full access)
type Query {
  feed(first: Int, after: String): PostConnection!
  myFeed: PostConnection!
  myProfile: UserProfile!
  # ... all other queries
}
```

### Cache-Control Headers

```typescript
// Public endpoint - 5 min browser cache, 1 hour CDN cache
response.http.headers.set('Cache-Control', 'public, max-age=300, s-maxage=3600');

// Authenticated endpoint - no caching
response.http.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
```

## Automatic Persisted Queries (APQ)

### What is APQ?

APQ sends a SHA-256 hash of the query instead of the full query string:

```
# Without APQ (POST)
POST /graphql-public
{
  "query": "query GetFeed { feed { edges { node { id content } } } }"
}

# With APQ (GET)
GET /graphql-public?extensions={"persistedQuery":{"version":1,"sha256Hash":"abc123..."}}
```

### Benefits

1. **Reduced request size**: Hash (64 chars) vs full query (100s-1000s chars)
2. **Cacheable GET requests**: CDNs cache by URL
3. **Bandwidth savings**: Especially for mobile users

### Implementation

```typescript
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { sha256 } from 'crypto-hash';

const link = createPersistedQueryLink({ 
  sha256,
  useGETForHashedQueries: true,
}).concat(httpLink);
```

### Server Support

Apollo Server supports APQ out-of-the-box (enabled by default).

## Consequences

### Good

1. **Reduced Server Load**
   - CDN serves 80-95% of public requests
   - Server handles only cache misses and authenticated requests
   - Scales to handle traffic spikes without infrastructure changes

2. **Improved Performance**
   - 97% faster response times for cached content (5ms vs 200ms)
   - Edge caching reduces latency for geographically distributed users
   - APQ reduces bandwidth by 90% for typical queries

3. **Security Benefits**
   - Physical endpoint separation eliminates token leakage risk
   - Clear audit trail for public vs private access
   - Impossible to accidentally cache authenticated requests

4. **Standard HTTP Compliance**
   - Works with any CDN (Cloudflare, Fastly, Akamai)
   - Compatible with ISP caching infrastructure
   - No vendor lock-in or custom configuration required

### Bad

1. **Increased Complexity**
   - Two Apollo Client instances to maintain
   - Separate schema subsets for public vs private queries
   - Must carefully categorize queries as public or private

2. **Cache Invalidation Challenges**
   - Stale data risk with long TTLs
   - Need purge strategy for urgent updates
   - CDN cache may lag behind database changes

3. **Loss of HTTP Batching**
   - GET requests cannot be batched
   - Multiple public queries = multiple HTTP requests
   - Trade-off: choose batching OR caching, not both

4. **Developer Overhead**
   - Team must understand two different patterns
   - Risk of confusion about which client to use
   - Testing requires validating both endpoints

## ShareThrift Query Classification

| Query | Public? | Reason |
|-------|---------|--------|
| `userById()` |  Yes | Should be able to see users' pages, specifics may be blocked |
| `accountPlans()` |  Yes | Shown to unauthenticated users during signup |
| `currentUser()` |  No | requires authentication and could cause errors |
| `adminUserById()` |  No | specific calls like this could leak sensitive info |



### Alternative Approach: Same Endpoint with Conditional Auth

This approach uses a single `/graphql` endpoint for both authenticated and public queries, with conditional logic to determine when to include authentication headers.

**Implementation Pattern:**
```typescript
// Client conditionally adds auth based on operation name
const conditionalAuthLink = setContext((operation, { headers }) => {
  const authenticatedOperations = ['GetFeed', 'GetPost', 'MyProfile'];
  const shouldAuthenticate = authenticatedOperations.includes(operation.operationName || '');
  
  if (shouldAuthenticate) {
    return { headers: { ...headers, authorization: `Bearer ${token}` } };
  }
  
  // For public queries, remove auth and signal the server
  return { 
    headers: { 
      ...headers, 
      authorization: undefined,
      'X-Public-Query': 'true' // Custom header to trigger cache headers
    } 
  };
});

// Server checks custom header to determine cache policy
app.use('/graphql', expressMiddleware(server, {
  context: async ({ req }) => ({
    isPublic: req.headers['x-public-query'] === 'true',
    // ... other context
  })
}));
```

**How It Works:**
1. Client maintains whitelist of operations requiring authentication
2. `setContext` checks operation name before adding auth header
3. Public queries send custom `X-Public-Query` header instead
4. Server reads header and sets cache policy accordingly
5. Apollo Server plugin applies correct `Cache-Control` headers

**Note:** This approach is not recommended due to security risks of misconfigured queries exposing tokens to CDN and the maintenance burden of maintaining operation whitelists.


## More Information

- [Social-Feed Demo Application](https://github.com/jason-t-hankins/Social-Feed/)
- [Apollo Server: Automatic Persisted Queries](https://www.apollographql.com/docs/apollo-server/performance/apq/)
- [MDN: HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [GraphQL over HTTP Specification](https://graphql.github.io/graphql-over-http/)
- [Cloudflare: CDN Caching Best Practices](https://www.cloudflare.com/learning/cdn/caching-best-practices/)