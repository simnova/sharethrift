# Copilot Instructions: GraphQL Files

`.graphql` files define queries, mutations, and fragments used with **Apollo Client** in React components. They support **type-safe**, **modular**, and **maintainable** data access.

## Organization

- Co-locate `.graphql` files with related container and presentational components.
- Use consistent base filenames (e.g., `contact-details.container.graphql` for `contact-details.container.tsx`).
- Define all GraphQL operations used by a container in its corresponding `.graphql` file.

## Naming Conventions

- **Queries & Mutations**:  
  Format: `<Layout><Container><Operation>`  
  Example: `ApplicantContactDetailsContainerApplicantUser`

- **Fragments**:  
  Format: `<Layout><Container><Type>Fields`  
  Example: `ApplicantContactDetailsContainerUserFields`

## Coding Guidelines

- Use Apollo variables—avoid hardcoded IDs or params.
- Keep queries minimal; only fetch fields needed by the component.
- Prefer reusable **fragments** over inline fields.
- Always include `id` in fragments where applicable to support Apollo cache normalization.
- Reuse consistent fragments across queries and mutations for cache alignment.

## Integration

- Import `.graphql` files using codegen-generated types.
- Use Apollo hooks (`useQuery`, `useMutation`) in container components.
- Co-locate fragments with the components that consume them.

## Apollo Link Chain

Apollo Client is configured with a **custom link chain** to flexibly route GraphQL and REST operations:

- **Batching**: Use `BatchHttpLink` to group GraphQL operations into a single request.
- **Auth & Headers**: Use `ApolloLink` to inject headers and tokens.
- **REST Support**: Use `RestLink` for non-GraphQL APIs (e.g., Azure Blob Storage).
- **Dynamic Routing**: Route operations using a `linkMap` and `ApolloLink.split`.

### Example Link Chain Setup

```ts
import { ApolloClient, InMemoryCache, ApolloLink, from } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { RestLink } from 'apollo-link-rest';

const batchGraphqlLink = new BatchHttpLink({ uri: '/graphql', batchMax: 10, batchInterval: 20 });
const restApiLink = new RestLink({ uri: '/rest-api' });

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: 'Bearer <token>',
    }
  }));
  return forward(operation);
});

const linkMap = {
  CountryDetails: restApiLink,
  default: from([authLink, batchGraphqlLink]),
};

const dynamicLink = ApolloLink.split(
  op => op.operationName in linkMap,
  new ApolloLink((op, forward) => {
    const link = linkMap[op.operationName] || linkMap.default;
    return link.request(op, forward);
  }),
  linkMap.default
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: dynamicLink,
});
```

> You can extend this pattern to route based on context, auth state, or operation type.

## Testing

- Use Apollo mocking utilities to simulate queries/mutations in unit tests and Storybook stories.

## Example Structure

```
components/
  feature-x/
    my-component.container.graphql
    my-component.container.tsx
    my-component.stories.tsx
    my-component.tsx
```

## References

- [Apollo Client Docs](https://www.apollographql.com/docs/react/)
- [GraphQL Specification](https://spec.graphql.org/)