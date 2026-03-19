---
applyTo: "**/*.{ts,tsx}"
description: "React performance optimization rules from Vercel best practices"
---

# React Performance Best Practices

Based on Vercel's comprehensive React optimization guide. Full documentation: `.agents/skills/vercel-react-best-practices/AGENTS.md`

## Critical Rules

### Eliminate Waterfalls
- Use `Promise.all()` for independent async operations
- Defer `await` until actually needed
- Start independent operations immediately in API routes
- Use `better-all` for operations with partial dependencies

### Bundle Size
- **Avoid barrel file imports** - Import directly from source files
  ```ts
  // ❌ Bad - loads entire library
  import { Check } from 'lucide-react'
  
  // ✅ Good - loads only needed icon
  import Check from 'lucide-react/dist/esm/icons/check'
  ```
- Use `next/dynamic` for heavy components (Monaco, charts, etc.)
- Lazy load third-party analytics after hydration

### Server-Side Performance
- Always authenticate Server Actions (treat like API routes)
- Use `React.cache()` for per-request deduplication
- Use `after()` for non-blocking operations (logging, analytics)
- Minimize data serialization at RSC boundaries

## High-Impact Rules

### Re-render Optimization
- Calculate derived state during rendering (don't store in useEffect)
- Use functional setState updates to avoid stale closures
- Use `useRef` for transient values (mouse tracking, timers)
- Use transitions for non-urgent updates

### Rendering Performance
- Animate SVG wrappers, not SVG elements (hardware acceleration)
- Use `content-visibility: auto` for long lists
- Hoist static JSX outside components

## Medium-Impact Rules

### Client-Side Data Fetching
- Use SWR for automatic deduplication
- Use passive event listeners for scroll/touch handlers
- Version and minimize localStorage data

### JavaScript Performance
- Build index maps for repeated lookups (`Map`/`Set`)
- Cache repeated function calls
- Early return from functions
- Use `Array.prototype.toSorted()` for immutability

For complete details and code examples, see: `.agents/skills/vercel-react-best-practices/AGENTS.md`
