---
sidebar_position: 25
sidebar_label: 0025 Portless Local HTTPS
description: "Decision record for replacing mkcert + manual HTTPS proxy with portless for local development."
status: 
date: 2026-02-26
deciders: 
---

# Local HTTPS Development: portless vs mkcert + manual proxy

## Context and Problem Statement

Local development benefits from HTTPS with named subdomains (e.g. `*.sharethrift.localhost`) to accurately mirror production behaviour: OAuth redirect URIs, CORS policies, cookies, and AI agents all depend on a consistent HTTPS origin. Without this, the local environment diverges from production in ways that are hard to detect until deployment.

The original solution used `mkcert` to generate a wildcard certificate stored in `.certs/`, combined with a hand-written `local-https-proxy.js` to front Azure Functions, necessary due to `func start`'s broken `--cert` flag in v4.2.2. Each service ran on its own numbered port, requiring developers to remember and configure many separate port assignments. A solution is needed that is easier to maintain and reduces the mental load for developers.

## Decision Drivers

- Developers should not need to manually manage TLS certificates
- All local services should be accessible via consistent, named HTTPS URLs
- The approach must not affect production builds or CI pipelines
- Multiple ports across services makes `.env` configuration error-prone
- AI Agents should be able to work on the subdomains

## Considered Options

- **portless** - globally installed reverse proxy daemon that maps subdomains to local ports with auto-trusted TLS certificates
- **mkcert + manual HTTPS proxy** - existing approach using a wildcard cert and a custom Node.js HTTPS proxy


### Consequences - portless

**Positive**

- No certificate management; TLS certs are auto-generated and auto-trusted
- Single port (`1355`) for all services: `.env` and `local.settings.json` are simpler
- Subdomain names in URLs (`data-access`, `mock-auth`, etc.) make it immediately obvious which service is being called
- `local-https-proxy.js` is deleted, now one less script to maintain
- Removes the need for compatibility issues with Azure Function's --cert flag

**Negative**

- Requires a one-time global install: `pnpm install -g portless`
- `func start` and Docusaurus do not respect the `PORT` environment variable injected by portless; thin `start-dev.mjs` wrapper scripts are required to read `process.env.PORT` and pass `--port` explicitly
- On macOS, bare `localhost` resolves to `::1` (IPv6), but portless connects via `127.0.0.1` (IPv4); Docusaurus must be started with `--host 127.0.0.1` to avoid a Bad Gateway error
- `portless proxy start --https` silently no-ops if the proxy is already running in HTTP mode; a `dev-cleanup.mjs` script is needed to run `portless proxy stop` and kill zombie processes before each dev session

### Consequences - mkcert

**Positive**

- No global tooling dependency and certificates live in the repo (gitignored)
- Works with any port assignment without daemon management

**Negative**

- Developers neeed to run `mkcert -install` and `mkcert` on each machine
- Certificate files require explicit exclusion from version control
- `local-https-proxy.js` must be kept in sync with Azure Functions behaviour
- CI required `fs.existsSync()` guards to skip HTTPS when certs are absent
- Many different port numbers to configure across `.env`, `local.settings.json`, and docs

## Decision Outcome

Chosen option: **portless**

`portless` eliminates the entire certificate lifecycle (generation, installation, `.gitignore` entries, CI detection guards) and replaces the custom `local-https-proxy.js` with a zero-config daemon. All services become reachable via `https://<name>.sharethrift.localhost:1355`, a single consistent pattern. The old multi-port layout is replaced by one port and named subdomains that will remain standard throughout the developer lifecycle.

## More Information

- [portless on npm](https://www.npmjs.com/package/portless)
- [portless docs](https://port1355.dev/)
- [mkcert repo](https://github.com/FiloSottile/mkcert)
- `scripts/dev-cleanup.mjs` — stops the proxy and kills known dev processes before each `pnpm run dev`
- `apps/api/start-dev.mjs`, `apps/docs/start-dev.mjs` — wrapper scripts that pass `PORT` to tools that require an explicit `--port` flag
