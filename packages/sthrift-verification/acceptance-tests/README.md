# ShareThrift Acceptance Tests

Cucumber Screenplay pattern acceptance tests for the ShareThrift domain, implementing domain and session level testing.

## Test Levels

| Level | What It Tests | Speed | Stack |
|-------|---------------|-------|-------|
| **Domain** | Pure business logic | ⚡ Milliseconds | In-memory aggregates |
| **Session** | API contracts (GraphQL/MongoDB) | 🏃 Sub-second | Apollo TestServer + MongoMemoryServer |

## Running Tests

```bash
# Domain tests (fastest)
pnpm run test:domain

# Session tests with GraphQL backend
pnpm run test:session:graphql

# Session tests with MongoDB backend
pnpm run test:session:mongodb

# Fast suite (domain + session:graphql)
pnpm run test:fast

# All acceptance tests
pnpm run test:all
```

## From monorepo root

```bash
pnpm run test:acceptance:domain
pnpm run test:acceptance:session:graphql
pnpm run test:acceptance:session:mongodb
pnpm run test:acceptance:fast
```
