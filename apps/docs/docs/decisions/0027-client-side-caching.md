# Client-Side Caching with Apollo Client

## Context and Problem Statement

Client-side caching is critical for responsive UX and reducing server load. Apollo Client provides a normalized cache, but developers need guidance on:

- Cache policy selection (cache-first, network-only, cache-and-network)
- Security: preventing sensitive data exposure in cache
- Varying field selections: how Apollo merges queries with different fields
- Cache invalidation strategies
- Effective use of Apollo DevTools

This ADR provides patterns for client-side caching with emphasis on security and field-level access control.

**Live Demo**: `client/src/demos/05-client-cache/ClientCacheDemo.tsx`

## Decision Drivers

- Performance: Minimize network requests and server load
- Security: Never expose sensitive data in client cache
- User Experience: Instant UI updates with optimistic responses
- Data Freshness: Balance caching with real-time requirements
- Developer Experience: Clear patterns that scale with team size

## Considered Options

### Apollo Client vs Alternatives

Evaluated: Apollo Client, TanStack Query, SWR, Redux RTK Query

**Apollo Client chosen for**:
- Automatic normalization (User:123 cached once, shared across queries)
- GraphQL-first with fragments, type policies, subscriptions
- Field policies for data transformation/masking
- Excellent DevTools

**Trade-offs**:
- Bundle size: 33 KB vs 5-13 KB for alternatives
- Learning curve: normalization and cache keys
- GraphQL-only (can't cache REST easily)

**Rationale**: For GraphQL projects with complex data relationships, Apollo's normalized cache and GraphQL-specific features provide best DX and performance.

### Cache Policies

Apollo Client offers multiple fetch policies:

#### cache-first (Default)
Read from cache, fetch on cache miss. Best for static/public data.

```typescript
useQuery(GET_PRODUCT_CATALOG, { fetchPolicy: 'cache-first' });
```

Use cases: Product catalogs, blog posts, reference data

#### network-only
Always fetch fresh, appropriate for sensitive data.

```typescript
useQuery(GET_BANK_BALANCE, { fetchPolicy: 'network-only' });
```

Use cases: Bank balances, private messages, real-time data

#### cache-and-network
Show cached instantly, refresh in background.

```typescript
useQuery(GET_USER_FEED, { fetchPolicy: 'cache-and-network' });
```

Use cases: Social feeds, dashboards

#### no-cache
Bypasses cache entirely for single-use data.

```typescript
useQuery(GET_OTP, { fetchPolicy: 'no-cache' });
```

Use cases: OTP codes, reset tokens

### Field-Level Security

Use field policies to mask sensitive data:

```typescript
const cache = new InMemoryCache({
  typePolicies: {
    User: {
      fields: {
        ssn: {
          read() {
            return '***-**-****'; // Always masked
          },
        },
      },
    },
  },
});
```

Benefits: Defense-in-depth, cache inspector safety, redacted logs

### Varying Field Selections

Apollo merges queries with different fields into same cache entry.

Query minimal fields first, then full profile:
- Minimal query caches 3 fields
- Full query merges 6 fields total
- Subsequent minimal queries read all 6 from cache

Key insight: Query broader fields first, narrower queries benefit from cache.

### useFragment for Cache Reads

Read cached data without network request:

```typescript
function PostCard({ id }: { id: string }) {
  const { complete, data } = useFragment({
    fragment: POST_CARD_FRAGMENT,
    from: { __typename: 'Post', id },
  });

  if (!complete) return null;
  return <div>{data.content}</div>;
}
```

Benefits: Zero network overhead, live updates, avoids prop drilling

See ADR 0001 for re-render optimization details.

### Optimistic Updates

Update UI instantly before server confirms:

```typescript
const [likePost] = useMutation(LIKE_POST, {
  optimisticResponse: {
    likePost: { __typename: 'Post', id: postId, likeCount: currentLikeCount + 1 },
  },
});
```

Flow: UI updates instantly, mutation sent to server, Apollo auto-rolls back on failure.

Use cases: Likes, favorites, toggles

## Decision Outcome

Adopt tiered caching strategy based on data sensitivity:

### Tier 1: Public/Static - cache-first
Product catalogs, blog posts, reference data

### Tier 2: User-Specific - cache-and-network
Social feeds, shopping carts, dashboards

### Tier 3: Sensitive - network-only
Account balances, private messages, financial data

### Tier 4: Highly Sensitive - no-cache
Passwords, credit cards, OTP codes, SSNs

### Field-Level Policies
Always mask: User.ssn, User.creditCard (even if server sends real data)

### Optimistic Updates
Use for: Likes, follows, toggles
Avoid for: Complex validation, transactions, unpredictable side effects

## Implementation

### Configure Cache

```typescript
const cache = new InMemoryCache({
  typePolicies: {
    User: {
      keyFields: ['id'],
      fields: {
        ssn: { read() { return '***-**-****'; } },
      },
    },
  },
});
```

### Use Appropriate Policies

```typescript
// Public data
useQuery(GET_PRODUCTS, { fetchPolicy: 'cache-first' });

// Sensitive data
useQuery(GET_BALANCE, { fetchPolicy: 'network-only' });

// User feeds
useQuery(GET_FEED, { fetchPolicy: 'cache-and-network' });
```

## Cache Invalidation

### Refetch Queries
```typescript
useMutation(UPDATE_POST, {
  refetchQueries: ['GetFeed'],
});
```

### Cache Eviction
```typescript
useMutation(DELETE_POST, {
  update(cache) {
    cache.evict({ id: cache.identify({ __typename: 'Post', id: postId }) });
    cache.gc();
  },
});
```

### Polling (use sparingly)
```typescript
useQuery(GET_NOTIFICATIONS, { pollInterval: 5000 });
```

## Tooling and Debugging

### Apollo DevTools
Chrome/Firefox extension for cache inspection, query tracking, mutation debugging

### Browser Network Tab
Filter by `graphql` to verify cache behavior:
- cache-first: no network request after first fetch
- network-only: always hits network

### Cache Debugging
```typescript
console.log(client.cache.extract()); // View entire cache
```

## Considerations

### Memory Usage
Large caches consume client memory. Target: 10-50 MB for most apps.
Mitigation: Run cache.gc() periodically, evict old entries.

### Stale Data
Cached data becomes outdated. Use cache-and-network for frequently changing data, mutation-based invalidation.

### Privacy
Clear cache on logout: `client.clearStore()`
Use network-only for sensitive data on shared devices.

### Multi-Tab Consistency
Separate caches per tab. Use BroadcastChannel API or polling for sync.

## Example Scenarios

### E-Commerce
- Product info: cache-first
- Reviews: cache-and-network
- Inventory: network-only with polling

### Social Feed
- Feed: cache-and-network
- Likes: Optimistic updates

### Banking
- Balance: network-only
- Transactions: cache-and-network
- Profile: cache-first

## Consequences

### Positive
- Instant UI for cached data, reduced server load
- Field policies prevent sensitive data exposure
- Optimistic updates provide instant feedback
- Apollo DevTools enable effective debugging

### Negative
- Requires understanding normalization and cache keys
- Aggressive caching risks stale data
- Large caches consume client memory
- Cache issues can be subtle to debug

### Neutral
- Team training required for cache policies
- Periodic review needed as app evolves

## Related

- ADR 0001: useFragment for cache reads without queries
- ADR 0003: Server-side permission-aware caching
- DataLoader optimizes database, client cache optimizes network

## References

- [Apollo Client Caching](https://www.apollographql.com/docs/react/caching/overview/)
- [Fetch Policies](https://www.apollographql.com/docs/react/data/queries/#setting-a-fetch-policy)
- [Apollo DevTools](https://www.apollographql.com/docs/react/development-testing/developer-tooling/#apollo-client-devtools)
