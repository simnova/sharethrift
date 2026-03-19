---
applyTo: "apps/ui-sharethrift/src/components/ui/**/*"
---

# Copilot Instructions: UI Folder

## Purpose

- The `ui` folder implements the Atomic Design methodology to organize reusable UI components.
- It contains **molecules** (small, focused components) and **organisms** (composed, higher-order components).
- Components are shared across layouts and features within the package.

## Atomic Design Structure

- **Molecules**: Extend or customize Ant Design primitives. Examples: loaders, buttons, input fields.
- **Organisms**: Built from molecules and represent more complex UI compositions. Examples: headers, dropdowns, form sections.

## Architecture & Patterns

- Use React functional components with TypeScript.
- Prefer composition over inheritance.
- Use Ant Design as the base for all UI components.
- Use Tailwind CSS for utility styles; use CSS modules (`*.module.css`) for scoped component styles.
- Use the container pattern for components that handle logic or data-fetching (suffix with `Container`).

## Coding Conventions

- Component name must match file name in PascalCase.
- Use kebab-case for all file and directory names.
- Define a `{ComponentName}Props` interface or type for every component.
- Co-locate all related files: component (`index.tsx`), test (`index.test.tsx`), story (`index.stories.tsx`), styles (`index.module.css`), and README (`README.md`).

## Styling

- Use Ant Design theming for consistency.
- Use Tailwind CSS for custom utility styling.
- Use CSS modules for encapsulated, reusable styles.

## Reusability & Composition

- Design molecules to be reusable across features and layouts.
- Compose organisms from molecules and other organisms.
- Use props and context; avoid hardcoding values.

## Testing

- Every component must include a Storybook story and unit test.
- Use React Testing Library and Vitest for all tests.

## Performance

- Use `useMemo` or `React.memo` to avoid unnecessary re-renders.

## File/Folder Structure

```
ui/
  molecules/
    {component-name}/
      index.tsx
      index.test.tsx
      index.stories.tsx
      index.module.css
      README.md
  organisms/
    {component-name}/
      ...
  ui.instructions.md
```

- Each component gets its own folder if it includes multiple files.
- Co-locate component, test, story, styles, and docs in the same folder.

## References

- [Atomic Web Design](https://bradfrost.com/blog/post/atomic-web-design/)
- [Atomic Design - Chapter 2](https://atomicdesign.bradfrost.com/chapter-2/)
- [React Documentation](https://react.dev/)
- [Ant Design Documentation](https://ant.design/docs/react/introduce)
- [Storybook Documentation](https://storybook.js.org/docs/react/get-started/introduction)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
