# Copilot Instructions: Page Components

Page components in the `pages/` folder represent top-level routes within a layout. They compose UI from reusable components and containers and are mapped via the layout’s `index.tsx`.

## Purpose

- Define route-level views tied to a layout.
- Use components from the layout’s `components/` folder.
- Wrap content in `SubPageLayout` to ensure consistent headers/structure.

## Page Types

- **Single Page**:
  - A single view using `SubPageLayout`.
  - May include `VerticalTabs` for internal tabs.
  - Example:
    ```tsx
    <SubPageLayout header={<h1>Title</h1>}>
      <MyComponent />
    </SubPageLayout>
    ```

- **Page Group**:
  - Defines multiple sub-routes using nested `<Routes>`.
  - Used for multi-view flows (e.g. list/detail/create).
  - Example:
    ```tsx
    <Routes>
      <Route path="" element={<ListView />} />
      <Route path="create" element={<CreateView />} />
      <Route path=":id/*" element={<DetailView />} />
    </Routes>
    ```

## Conventions

- Use functional components and React hooks.
- Define a `{PageName}Props` type for each page.
- Use strict TypeScript types for props and local state.
- Use kebab-case for file names.
- Compose pages from containers and presentational components.

## Composition Patterns

- Wrap single pages in `SubPageLayout`.
- Use `VerticalTabs` for tabbed interfaces.
- Use nested `Routes` for multi-view page groups.

## Testing & Storybook

- Every page component must have a corresponding Storybook story.
- Write unit tests if logic or branching is non-trivial.

## References

- [React Docs](https://react.dev/)
- [Storybook Docs](https://storybook.js.org/docs/react/get-started/introduction)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
