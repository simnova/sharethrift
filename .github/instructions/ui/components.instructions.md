applyTo: "apps/ui-sharethrift/src/components/**/*"
---
# Copilot Instructions: UI Components

## Overview

This directory contains reusable UI components for the applicant-facing web UI, built with **React**, **TypeScript**, **Ant Design**, and **Tailwind CSS**.

## Principles

- **Component-driven & Typed**: Use functional React components with strict TypeScript typing.
- **Styling**: Prefer Ant Design components and theming; use Tailwind CSS or CSS Modules for custom styles.
- **Accessibility**: Ensure ARIA support, keyboard navigation, and semantic HTML.
- **Testing**: Every component must include a unit test and a Storybook story.

## Structure & Naming

- Use the [Container Pattern](https://www.patterns.dev/react/presentational-container-pattern/):
  - Suffix container components with `Container` (e.g., `ProfileViewContainer`).
- Component file must:
  - Export a single PascalCase-named component.
  - Include a `{ComponentName}Props` type.
- Use kebab-case for file and folder names.

## State & Logic

- Use `useState`, `useEffect`, and other React hooks for local state.
- Use React Context or state libraries only when shared/global state is needed.
- Avoid prop drilling and trivial state solutions.

## Code Conventions

- Prefer composition over inheritance.
- Memoize expensive computations (`useMemo`, `React.memo`).
- Avoid unnecessary re-renders.
- Make components composable and reusable—avoid hardcoded values.

## UX & Error Handling

- Handle loading (`<Skeleton />`), empty states (`<Empty />`), and errors (`message`) gracefully.

## Organization

- Use `shared/` for common components.
- Use `layouts/` for layout-specific components.

## References

- [React](https://react.dev/)
- [Ant Design](https://ant.design/docs/react/introduce)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Storybook](https://storybook.js.org/docs/react/get-started/introduction)
- [TypeScript](https://www.typescriptlang.org/docs/)
