# ShareThrift Acceptance UI Tests

Cucumber Screenplay acceptance tests for the ShareThrift UI component path.

## Scope

- jsdom-rendered UI components
- shared page objects from `test-support`
- domain-backed in-memory validation/assertion helpers

## Running Tests

```bash
pnpm run test
pnpm run test:coverage
```

## From monorepo root

```bash
pnpm run test:acceptance:ui
pnpm run test:coverage:acceptance:ui
```
