---
applyTo: "packages/sthrift/graphql/**/*.ts"
---
# Copilot Instructions: @sthrift/graphql

## Summary
Provides GraphQL API endpoints for Sharethrift (DDD) using Apollo Server v4 and Azure Functions. Acts as an API gateway bridging domain services via the Cellix service registry.

## Architecture
- **Apollo Server v4** + custom **Azure Functions v4 adapter**
- **DDD**: Resolvers access aggregates via Unit of Work
- **Context Injection**: Domain data/services passed via GraphQL context
- **Type Safety**: Fully typed schemas, resolvers, and context using TypeScript

## Components
- **Schemas**: SDL defined via `#graphql` literals in `schema/types`
- **Resolvers**: Map fields to domain services in `schema/resolvers`
- **Context**: Defined in `context.ts`, includes `apiContext`, auth, etc.
- **Adapter**: `azure-functions.ts` connects Apollo Server to Azure Functions

## Coding Conventions
- Use TypeScript interfaces extending `BaseContext`
- Resolvers follow `(parent, args, context, info)` signature
- Access services via `context.apiContext`
- Errors should conform to GraphQL/Apollo error structures
- Follow Apollo Server v4 best practices

## File Structure
```
src/
├── index.ts            # GraphQL handler factory
├── azure-functions.ts  # Azure adapter for Apollo Server
├── context.ts          # Context types and builders
├── schema/
│   ├── types/          # GraphQL SDL definitions
│   └── resolvers/      # Resolver implementations
└── middleware/         # Middleware for auth, validation, etc.
```

## Integration with CellixJS
Registered using `graphHandlerCreator`, consuming `ApiContextSpec` to access domain services via unit of work. Follows standard Cellix error handling and logging patterns.

## GraphQL Context Example
```ts
interface GraphContext extends BaseContext {
  apiContext: ApiContextSpec;
  // Add authentication, user context, etc.
}
```

## Azure Functions Integration
Custom adapter in `azure-functions.ts` transforms HTTP requests/responses for Apollo. Supports GET/POST with content-type handling, error formatting, and HTTP status codes.

## Testing
- Unit tests for all resolvers using mocked domain services
- Integration tests run real GraphQL queries against schema
- Use Apollo Server testing tools for schema validation
- Test Azure integration with mocked HTTP requests/responses

## Performance
- Implement query complexity and depth limits
- Use DataLoader to prevent N+1 issues
- Add timeout handling and Apollo caching as needed

## Security
- Auth middleware added to context
- Use domain-level auth via passport/visa patterns
- Sanitize/validate inputs
- Apply rate limiting and query analysis

## Examples
- **New query**: Add to schema → implement resolver → connect to domain
- **Access domain data**: `context.apiContext.domainDataSource.{Context}.{Aggregate}.{UnitOfWork}`
- **Error handling**: Throw GraphQL errors or use Apollo error extensions
