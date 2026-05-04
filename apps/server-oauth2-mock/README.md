# @apps/server-oauth2-mock

Local OAuth2/OIDC mock server for dev/testing. Supports **multi-portal** configuration — each UI application (`apps/ui-*`) declares its own OIDC portal via a `mock-oidc.json` file, and the server auto-discovers them at startup.

## Usage

```bash
pnpm run dev          # Start with portless proxy + hot reload
pnpm run build && pnpm start  # Production-style start
pnpm run test         # Run tests
```

## How It Works

1. On startup the server scans `apps/ui-*/mock-oidc.json` for portal definitions.
2. Each portal is mounted at `/<portal-name>` (e.g. `/user-portal`, `/admin-portal`).
3. Full OIDC endpoints are available per portal:
   - `/<name>/.well-known/openid-configuration`
   - `/<name>/.well-known/jwks.json`
   - `/<name>/authorize`
   - `/<name>/token`
   - `/<name>/userinfo`
   - `/<name>/logout`

## Portal Configuration (`mock-oidc.json`)

Place a `mock-oidc.json` in each `apps/ui-*` directory:

```jsonc
{
  "name": "user-portal",           // URL-safe slug for the portal path
  "envVars": {
    "clientId": "VITE_B2C_CLIENTID",     // Env var name in the UI's .env
    "redirectUri": "VITE_B2C_REDIRECT_URI"
  },
  "claims": {                      // Token claims for this portal's user
    "sub": "00000000-0000-4000-8000-000000000001",
    "email": "dev@example.com",
    "given_name": "Dev",
    "family_name": "User",
    "tid": "test-tenant-id"
  }
}
```

### Local Overrides

Create a `mock-oidc.local.json` alongside `mock-oidc.json` to override `claims` locally without affecting the committed config. This file is git-ignored.

```jsonc
{
  "claims": {
    "email": "my-local@example.com",
    "given_name": "Local"
  }
}
```

## Environment Variables

The server's own `.env` (in this package) controls:

| Variable   | Default | Description |
|------------|---------|-------------|
| `PORT`     | `4000`  | Server listen port |
| `BASE_URL` | `https://mock-auth.sharethrift.localhost` | Base URL for OIDC issuer |

## Adding a New Portal

1. Create `apps/ui-<name>/mock-oidc.json` with the schema above.
2. Ensure the UI app's `.env` has the env vars referenced in `envVars`.
3. Set the UI's OIDC authority to `<BASE_URL>/<portal-name>`.
4. Update `apps/api/local.settings.json` with the portal's OIDC issuer and JWKS endpoint.
5. Restart the mock server — the portal is auto-discovered.
