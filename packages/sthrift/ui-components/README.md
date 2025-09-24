# @sthrift/ui-components

Reusable UI components for ShareThrift portals.

## Structure

- `src/molecules/` – Small, reusable UI building blocks (e.g., buttons, inputs)
- `src/organisms/` – Complex UI components composed of molecules (e.g., navbars, cards)
- `src/theme/` – Theme utilities, context, and shared styles

## Usage

Import components from this package in any ShareThrift portal:

```tsx
import { Button } from '@sthrift/ui-components';
```

## Development

- Add new components to the appropriate folder.
- Run `npm run build` to compile.
- Lint with `npm run lint`.
