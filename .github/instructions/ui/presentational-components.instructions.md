# Copilot Instructions: Presentational Components

Presentational components (`*.tsx` excluding `.container.tsx`) render UI based on props and manage only local UI state. They do not handle data fetching, side effects, or business logic.

## Purpose

- Render UI using props passed from container components.
- Remain stateless or handle only local UI state.
- Accept data and callbacks via props; do not fetch data or manage global state.

## Architecture & Patterns

- Follows the **Container/Presentational** pattern.
- Co-locate with their `.container.tsx` and `.graphql` counterparts.
- Use strict prop typing (`{ComponentName}Props`).

## Conventions

- Functional components only; use React hooks for local state.
- File/component name must match, in **PascalCase**.
- Use **kebab-case** for file and folder names.
- Define and export a `{ComponentName}Props` type.
- Use handler props (e.g., `onClick`, `onChange`, `onSubmit`) for all user actions.
- No side effects, API calls, or global state logic.

## Styling

- Use Ant Design components and theming for consistency.
- Use Tailwind CSS for custom styles when needed.
- Prefer CSS modules or scoped styles when Tailwind isn’t sufficient.

## Accessibility

- Ensure accessible markup: ARIA, keyboard support, semantic HTML.
- Use accessible Ant Design components when possible.

## Testing

- Write unit tests focused on rendering and UI interaction.
- Every presentational component must have a Storybook story.

## Organization

- Co-locate with containers and related GraphQL files.
- Align file names (e.g., `profile-view.tsx` and `profile-view.container.tsx`).

## References

- [React Container/Presentational Pattern](https://www.patterns.dev/react/presentational-container-pattern/)
- [Ant Design Docs](https://ant.design/docs/react/introduce)
