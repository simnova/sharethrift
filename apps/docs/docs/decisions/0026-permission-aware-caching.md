---
sidebar_position: 26
sidebar_label: 0026 Permission-Aware Caching
description: "Decision record for implementing permission-aware in-memory caching in ShareThrift's GraphQL API."
status: 
contact: jason-t-hankins
date: 2025-12-12
deciders: 
consulted: 
informed:
---

# Permission-Aware In-Memory Caching for GraphQL

## Context and Problem Statement

ShareThrift's GraphQL API serves data to users with different permission levels - regular members, community admins, and platform administrators. A naive server-side caching implementation could accidentally serve admin-only data to regular users, creating serious security vulnerabilities.

For example, admin users viewing event analytics (attendance rates, revenue) and regular members viewing the same event listing must not share cached data. Without permission-aware caching, an admin's cached response could leak sensitive information to regular users.

## Decision Drivers

- **Security**: Users must never receive data they're not authorized to see
- **Performance**: Avoid re-computing the same data for users with identical permissions
- **Memory Efficiency**: Don't cache duplicate data unnecessarily
- **Maintainability**: Clear, auditable permission checks
- **Scalability**: Support complex permission models (roles, groups, ACLs)

## Considered Options

### Option 1: No Server-Side Caching

Don't cache at the GraphQL layer - compute fresh for every request.

### Option 2: Permission-Aware Cache Keys

Include user permissions in cache keys to ensure isolation between permission levels.

### Option 3: Post-Fetch Filtering

Cache the full dataset, then filter based on permissions before returning.

### Option 4: Separate Queries Per Permission Level

Create distinct queries for each permission level (e.g., `adminFeed`, `userFeed`).

## Decision Outcome

Chosen option: **Permission-aware cache keys** - Include user permissions in cache keys to ensure isolation between permission levels.

**Security**: Cache keys include query, variables, userId, role, and permissions. Example: `GetEvents::{"first":5}::alice::admin::[]` vs `GetEvents::{"first":5}::bob::member::[]`. Users cannot access cached data for other permission levels.

**Efficiency**: Users with identical permissions share cache entries. 1000 regular members = 1 cache entry.

**Field-Level Control**: GraphQL resolvers check permissions before returning fields, storing only filtered results in cache.

**Compatibility**: Works with Apollo Server, Express GraphQL, and existing DataLoader optimizations.

## Implementation Details

### Cache Key Structure

```typescript
interface CacheKey {
  query: string;              // Operation name: "GetFeedWithAnalytics"
  variables?: Record<string, any>;  // Query variables: { first: 5 }
  userId?: string;            // User ID: "507f1f77bcf86cd799439011"
  role?: string;              // User role: "admin" | "user"
  permissions?: string[];     // Additional permissions: ["read:analytics"]
}

// Generated key (stringified):
// "GetFeedWithAnalytics::{"first":5}::alice::admin::[]"
```

### Permission-Aware Resolver

```typescript
Post: {
  analytics: async (parent, _, { user, cache }) => {
    // Permission check
    if (user?.role !== 'admin') {
      return null;  // Don't reveal analytics to non-admins
    }

    // Cache key includes user role
    const cacheKey = {
      query: 'PostAnalytics',
      variables: { postId: parent.id },
      userId: user.id,
      role: user.role,
    };

    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    // Fetch from database
    const analytics = await fetchAnalytics(parent.id);

    // Store in cache with 30s TTL
    cache.set(cacheKey, analytics, 30000);

    return analytics;
  }
}
```

### Cache Implementation

```typescript
class PermissionAwareCache {
  private cache: Map<string, CacheEntry<any>>;
  private maxSize: number = 1000;
  private defaultTTL: number = 60000; // 1 minute

  private generateKey(cacheKey: CacheKey): string {
    return [
      cacheKey.query,
      JSON.stringify(cacheKey.variables || {}),
      cacheKey.userId || 'anonymous',
      cacheKey.role || 'none',
      JSON.stringify(cacheKey.permissions?.sort() || []),
    ].join('::');
  }

  get<T>(cacheKey: CacheKey): T | null {
    const key = this.generateKey(cacheKey);
    const entry = this.cache.get(key);

    if (!entry || Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(cacheKey: CacheKey, data: T, ttl?: number): void {
    if (this.cache.size >= this.maxSize) {
      // Simple LRU: delete oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    const key = this.generateKey(cacheKey);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  // Invalidate entries matching pattern
  invalidate(pattern: { query?: string; userId?: string; role?: string }): number {
    let deletedCount = 0;
    for (const [key] of this.cache.entries()) {
      if (this.matchesPattern(key, pattern)) {
        this.cache.delete(key);
        deletedCount++;
      }
    }
    return deletedCount;
  }
}
```


## Consequences

- Good, because zero risk of permission leakage between users
- Good, because reduces database queries by 70-90% for users with same permissions
- Good, because cache lookups under 1ms vs 50-200ms database queries
- Good, because supports complex permission models (RBAC, ABAC, custom)
- Good, because cache hits and misses logged per role for monitoring
- Bad, because one cache entry per unique permission set increases memory usage
- Bad, because changing user permissions requires invalidating their cache entries
- Bad, because first request for each permission level is always slow (cold cache)


## Trade-Offs

### Memory vs. Performance

**Low TTL (Time to Live) (10-30s):**
- Fresh data
- Lower memory usage
- ...More database queries

**High TTL (5-10min):**
- Fewer database queries
- Better performance
- ...Higher memory usage
- ...Stale/Outdated data risk

**Recommendation**: 30sec-5min TTL for most use cases (Feed, Dashboard, User Profile, etc.)

### Granularity

**Coarse (role-level):**
```typescript
cacheKey = { query, variables, role }
// All admins share cache
```

**Fine (user-level):**
```typescript
cacheKey = { query, variables, userId, role }
// Each user has own cache
```

**Recommendation**: 
- Use role-level for data that doesn't vary per user
- Use user-level for personalized data
- Hybrid approach: include `userId` only when needed

## Cache Invalidation Strategies

### Time-Based (TTL)

```typescript
cache.set(key, data, 60000); // Expires after 60s
```

**Pros:** Simple, predictable
**Cons:** May serve stale data for TTL duration

### Event-Based

```typescript
// When post is updated
Mutation: {
  updatePost: async (_, { id, content }) => {
    await db.posts.update(id, content);
    cache.invalidate({ query: 'GetFeed' }); // Clear all feed caches
    cache.invalidate({ query: 'GetPost', variables: { id } });
  }
}
```

**Pros:** Always fresh data
**Cons:** More complex, can invalidate too aggressively

### Hybrid (Recommended)

```typescript
// 30s TTL + invalidation on mutations
cache.set(key, data, 30000);

// On mutation
cache.invalidate({ query: 'GetFeed' });
```

**Balance:** Fresh data for mutations, caching for reads

## Real-World Scenarios

### Scenario 1: Role Change

**Problem:** Alice is promoted from `user` to `admin`

**Solution:**
```typescript
async function updateUserRole(userId: string, newRole: string) {
  await db.users.update(userId, { role: newRole });
  
  // Invalidate all cache entries for this user
  cache.invalidate({ userId });
  
  // User's next request will generate fresh cache with new permissions
}
```

### Scenario 2: Data Update

**Problem:** Admin updates a post, all users should see new content

**Solution:**
```typescript
Mutation: {
  updatePost: async (_, { id, content }) => {
    await db.posts.update(id, content);
    
    // Invalidate feed for ALL roles
    cache.invalidate({ query: 'GetFeed' });
    cache.invalidate({ query: 'GetPost' });
    
    // Next request for any user will fetch fresh data
  }
}
```

### Scenario 3: Permission Check Change

**Problem:** Analytics permission logic changes (now requires `premium` flag)

**Solution:**
```typescript
// Old resolver
Post: {
  analytics: async (parent, _, { user }) => {
    if (user?.role !== 'admin') return null;
    // ...
  }
}

// New resolver
Post: {
  analytics: async (parent, _, { user }) => {
    if (user?.role !== 'admin' && !user?.premium) return null;
    // Cache key now includes premium flag
    const cacheKey = {
      query: 'PostAnalytics',
      variables: { postId: parent.id },
      userId: user.id,
      role: user.role,
      permissions: user.premium ? ['premium'] : [],
    };
    // ...
  }
}

// Clear all analytics caches during deployment
cache.invalidate({ query: 'PostAnalytics' });
```

## Edge Cases & Mitigations

### Edge Case: Permission Check in Middle of Resolver Chain

**Problem:**
```typescript
Query: {
  posts: async () => {
    return await db.posts.find(); // Fetches all posts
  }
}

Post: {
  analytics: async (parent, _, { user }) => {
    if (user?.role !== 'admin') return null; // Permission check HERE
    return fetchAnalytics(parent.id);
  }
}
```

If we cache at `Query.posts`, admin and user caches would be identical!

**Solution:** Cache at the field level where permission check occurs:
```typescript
Post: {
  analytics: async (parent, _, { user, cache }) => {
    if (user?.role !== 'admin') return null;
    
    const cacheKey = {
      query: 'PostAnalytics',
      variables: { postId: parent.id },
      role: user.role,
    };
    
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    
    const analytics = await fetchAnalytics(parent.id);
    cache.set(cacheKey, analytics);
    return analytics;
  }
}
```

### Edge Case: Dynamic Permissions

**Problem:** User has permission `["posts:read:own"]` - can only read their own posts

**Solution:** Include ownership in cache key:
```typescript
const cacheKey = {
  query: 'GetPosts',
  variables,
  userId: user.id, // Include user ID
  permissions: user.permissions,
};
```

Result: Each user gets own cache entry, no data leakage

### Edge Case: Memory Leak from User Churn

**Problem:** 10,000 users log in once, cache grows unbounded

**Solution:** Enforce `maxSize` with LRU eviction:
```typescript
class PermissionAwareCache {
  private maxSize = 1000;

  set(key, data) {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey); // Evict oldest
    }
    this.cache.set(key, data);
  }
}
```

## Monitoring & Observability

### Key Metrics

```typescript
interface CacheMetrics {
  totalSize: number;          // Current cache entry count
  hitRate: number;           // Percentage of cache hits
  hitsByRole: Map<string, number>;  // Cache hits per role
  missedByRole: Map<string, number>; // Cache misses per role
  avgTTL: number;            // Average entry age
  evictionCount: number;     // Times max size was hit
}
```

### Logging

```typescript
cache.get(key) {
  if (cached) {
    console.log(`[Cache HIT] ${key.query} for role=${key.role}`);
  } else {
    console.log(`[Cache MISS] ${key.query} for role=${key.role}`);
  }
}

cache.invalidate(pattern) {
  console.log(`[Cache INVALIDATE] ${deletedCount} entries`, pattern);
}
```


## More Information

- [Social-Feed Demo Application](https://github.com/jason-t-hankins/Social-Feed/)
- [Apollo Server: Field-Level Authorization](https://www.apollographql.com/docs/apollo-server/security/authentication/#authorization-in-resolvers)
- [Redis: Caching Best Practices](https://redis.io/docs/manual/patterns/caching/)
- [NPM: LRU Cache Implementation](https://www.npmjs.com/package/lru-cache)