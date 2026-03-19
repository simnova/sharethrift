# Copilot Instructions: Layouts

The `layouts/` directory defines shared page scaffolding and route structures for the applicant-facing UI. Layouts wrap content in consistent structure (headers, sidebars, footers) and control top-level routing.

## Purpose

- Define reusable layout components for app sections.
- Encapsulate routing, navigation, and shared UI regions.
- Use for authenticated and unauthenticated flows (e.g., `root/` layout).

## Patterns & Structure

- **React + TypeScript**: Use functional components with strict typing.
- **Feature-Based Layouts**: Organize by domain (e.g., `applicant/`, `cases/`, `shared/`).
- **Composition over Inheritance**: Wrap child content using layout components.

## File Conventions

- Use **PascalCase** for component names and matching file names.
- Use **kebab-case** for file/folder paths.
- Suffix container components with `Container` (e.g., `SectionLayoutContainer`).
- Use absolute imports from `src/`.

## Routing & Navigation

- Each layout must include an `index.tsx` that defines all top-level routes.
- These routes:
  - Map to page components from `pages/`.
  - Drive the sidebar navigation menu.
  - Use the layout’s main component as the top-level wrapper (e.g., `SectionLayoutContainer`).
- Route config (`pageLayouts`) includes path, title, icon, ID, and optional `parent` key.

### Example Route Mapping

```tsx
<Route path="" element={<SectionLayoutContainer pageLayouts={pageLayouts} />}>
  <Route path="" element={<Home />} />
  <Route path="members/*" element={<Members />} />
</Route>
```

## Styling

- Use **Ant Design** for consistent components.
- Use **Tailwind CSS** for custom styles.
- Use scoped styles or CSS modules if Tailwind isn't sufficient.

## State & Data

- Use React hooks (`useState`, `useEffect`) for local state.
- Use context or external state libraries only when necessary.
- Use GraphQL via Apollo hooks in containers (if needed).

## Error Handling

- Handle loading and error states with `<Skeleton />`, `<Empty />`, `<Alert />`, etc.
- Provide fallback UI for blocked access or no data.

## Accessibility

- Ensure layouts and nav are accessible (ARIA, keyboard support, semantic HTML).
- Use accessible Ant Design components.

## Testing

- Each layout should have:
  - Unit tests
  - A Storybook story
  - Optional container tests if logic is non-trivial

## Performance

- Memoize layout components or logic-heavy sections (`useMemo`, `React.memo`).
- Avoid unnecessary re-renders.

## Folder Structure

```
layouts/
  root/
    index.tsx                    # Required: route config
    section-layout.tsx           # Required: shared layout wrapper
    sub-page-layout.tsx          # Optional
    components/                  # Supporting layout components
    pages/                       # Page components rendered by routes
  {layout-name}/
    index.tsx
    section-layout.tsx
    components/
    pages/
```

- `root/` is always required as the unauthenticated/global entry point.
- Each layout must include `section-layout.tsx` and `index.tsx`.
- Layouts may also include:
  - GraphQL queries/mutations (`*.container.graphql`)
  - Container components for layout-level logic
  - Presentational components
  - Storybook stories
  - Sub-page layouts for complex flows

## References

- [React Docs](https://react.dev/)
- [Ant Design](https://ant.design/docs/react/introduce)
- [Storybook Docs](https://storybook.js.org/docs/react/get-started/introduction)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
