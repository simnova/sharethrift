# ShareThrift E2E Tests

Cucumber Screenplay pattern end-to-end tests for ShareThrift, using Playwright for browser automation.

## Test Level

| Level | What It Tests | Speed | Stack |
|-------|---------------|-------|-------|
| **E2E** | Full user experience | 🐢 Seconds | Playwright → Vite UI → GraphQL → MongoDB |

## Running Tests

```bash
# E2E tests (local)
pnpm run test:e2e

# E2E tests (deployed environment)
pnpm run test:e2e:deployed

# Install Playwright browsers
pnpm run playwright:install
```

## From monorepo root

```bash
pnpm run test:acceptance:e2e
pnpm run test:acceptance:e2e:deployed
```

## Environment Variables (Deployed E2E)

| Variable | Description |
|----------|-------------|
| `E2E_DEPLOYED` | Set to `true` for deployed environment |
| `E2E_API_URL` | API endpoint URL |
| `E2E_UI_URL` | UI base URL |
| `E2E_ACCESS_TOKEN` | Pre-authenticated access token |
| `E2E_IGNORE_HTTPS_ERRORS` | Set to `true` to skip HTTPS validation |
| `E2E_SKIP_UI_LOGIN` | Set to `true` to skip UI login flow |
