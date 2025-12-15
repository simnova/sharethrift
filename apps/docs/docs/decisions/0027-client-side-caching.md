---
sidebar_position: 27
sidebar_label: 0027 Client-Side Caching
description: "Decision record for client-side caching strategies using Apollo Client"
status: 
contact: jason-t-hankins
date: 2025-12-12
deciders: 
consulted: 
informed:
---

# Client-Side Caching with Apollo Client

## Context and Problem Statement

ShareThrift requires responsive UI and reduced server load through effective client-side caching. Apollo Client provides a normalized cache, but we need clear guidance on:

- Cache policy selection (cache-first, network-only, cache-and-network)
- Security considerations for preventing sensitive data exposure in client cache
- Cache invalidation strategies for mutations
- Effective use of Apollo DevTools for debugging

This decision focuses on cache policy patterns with emphasis on security and data freshness requirements.

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

See ADR 0024 for re-render optimization details.

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

Chosen option: **Tiered caching strategy** based on data sensitivity and freshness requirements.

**Tier 1 - Public/Static (cache-first)**: Event listings, community pages, account plans

**Tier 2 - User-Specific (cache-and-network)**: User feeds, event attendance, notifications

**Tier 3 - Sensitive (network-only)**: Payment information, admin data, private messages

**Tier 4 - Highly Sensitive (no-cache)**: Passwords, credit cards, OTP codes

**Field-Level Policies**: Mask sensitive fields even if server sends real data (defense-in-depth)

**Optimistic Updates**: Use for likes, follows, attendance toggles. Avoid for complex validations and transactions.

### Implementation for ShareThrift

**Configure Cache:**
```typescript
const cache = new InMemoryCache({
  typePolicies: {
    User: {
      keyFields: ['id'],
      fields: {
        email: { read() { return '***@***.com'; } },
      },
    },
  },
});
```

**Apply Policies:**
```typescript
// Public event listings
useQuery(GET_PUBLIC_EVENTS, { fetchPolicy: 'cache-first' });

// User-specific feed
useQuery(GET_MY_FEED, { fetchPolicy: 'cache-and-network' });

// Payment information
useQuery(GET_PAYMENT_METHODS, { fetchPolicy: 'network-only' });
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

## Consequences

- Good, because instant UI response for cached data reduces perceived latency
- Good, because reduced server load lowers infrastructure costs
- Good, because field policies prevent sensitive data exposure as defense-in-depth
- Good, because optimistic updates provide immediate user feedback
- Good, because Apollo DevTools enable effective cache debugging
- Bad, because requires understanding cache normalization and key generation
- Bad, because aggressive caching risks stale data without proper invalidation
- Bad, because large caches consume client memory (target: 10-50 MB)
- Bad, because cache issues can be subtle to debug

## More Information

- [Social-Feed Demo Application](https://github.com/jason-t-hankins/Social-Feed/)
- [Apollo Client: Caching Overview](https://www.apollographql.com/docs/react/caching/overview/)
- [Apollo Client: Fetch Policies](https://www.apollographql.com/docs/react/data/queries/#setting-a-fetch-policy)
- [Apollo DevTools](https://www.apollographql.com/docs/react/development-testing/developer-tooling/#apollo-client-devtools)
