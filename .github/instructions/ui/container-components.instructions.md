applyTo: "apps/ui-sharethrift/src/components/**/*.container.tsx"
---
# Copilot Instructions: Container Components

## Overview

Container components handle **data fetching**, **state**, and **business logic**, separating concerns from UI rendering. They wrap and supply props to corresponding presentational components.

## Principles

- **Container/Presentational Pattern**: Container components (`*.container.tsx`) derive props from state, context, or API, and pass them to presentational components.
- **Colocation**: Place containers next to their UI counterparts and related `.graphql` files for clarity and maintainability.

## Data & State

- Use **Apollo Client** hooks (`useQuery`, `useMutation`, etc.) for GraphQL operations.
- Use **React hooks** (`useState`, `useEffect`, `useContext`) for local and shared state when necessary.
- Use `ComponentQueryLoader` for standardized loading, error, and empty states.

## Code Conventions

- Use functional components and strict TypeScript typing (`{ComponentName}ContainerProps`).
- Match file name and component name (PascalCase).
- Use `Container` suffix (e.g., `ProfileViewContainer`).
- Follow kebab-case for file and directory names.
- Provide handler props for actions (e.g., `handleClick`, `handleSubmit`).

## Error Handling

- Use `ComponentQueryLoader` with `errorComponent` and `noDataComponent` props for graceful fallbacks.
- Ensure accessibility for loading/error states.

## File Structure

- Co-locate:
  - Container and presentational components (e.g., `profile-view.container.tsx` + `profile-view.tsx`)
  - Related `.graphql` files in the same directory.

## References

- [Container/Presentational Pattern](https://www.patterns.dev/react/presentational-container-pattern/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [Ant Design](https://ant.design/docs/react/introduce)