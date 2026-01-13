---
sidebar_position: 3
sidebar_label: Localhost Subdomain Setup
description: Guide to setting up HTTPS-enabled localhost subdomains for local development
---

# Localhost Subdomain Development Setup

Sharethrift uses a subdomain-based architecture in local development that mirrors our production environment. This approach uses `*.sharethrift.localhost` domains with HTTPS to create a realistic development experience and support seamless transitions between local, containerized, and cloud deployments.

## Overview

Local development uses the following subdomain structure:

### Application Subdomains

- **Frontend UI**: `https://sharethrift.localhost:3000`
- **Backend API (via HTTPS proxy)**: `https://data-access.sharethrift.localhost:7072`
- **Backend API (Azure Functions HTTP)**: `http://localhost:7071`
- **Documentation**: `https://docs.sharethrift.localhost:3002`

### Mock Service Subdomains

- **Payment Service**: `https://mock-payment.sharethrift.localhost:3001`
- **Messaging Service**: `https://mock-messaging.sharethrift.localhost:10000`
- **Auth Service**: `https://mock-auth.sharethrift.localhost:4000`
- **MongoDB**: `mongodb://mongodb.sharethrift.localhost:50000`

## Why Localhost Subdomains?

Using subdomains in local development provides several benefits:

- **Production Parity**: Local environment closely mimics production domain structure
- **Cookie Management**: Proper cross-subdomain cookie sharing and security attributes
- **CORS Testing**: Realistic cross-origin scenarios during development
- **OAuth/OIDC**: Accurate redirect URIs matching real-world authentication flows
- **Container Readiness**: Smooth transition to containerized deployments
- **Service Isolation**: Clear boundaries between application components

## Architecture: HTTPS Proxy for Azure Functions

The ShareThrift local development setup uses a **custom Node.js HTTPS proxy** to provide HTTPS access to Azure Functions instead of Azure Functions' built-in `--useHttps` flag.

### Why Not Use Azure Functions `--cert` Flag?

Azure Functions Core Tools v4.2.2 has a **broken `--cert` flag** that ignores custom PFX certificates:

```bash
# This doesn't work - Azure Functions ignores the cert and generates its own
func start --typescript --useHttps --cert ./path/to/cert.pfx --password "password"
```

Even when providing a valid wildcard certificate for `*.sharethrift.localhost`, Azure Functions generates its own self-signed certificate for `CN=localhost`, breaking subdomain support and certificate trust.

### Custom HTTPS Proxy Solution

Instead, we use a lightweight Node.js HTTPS proxy that:

1. **Azure Functions runs HTTP-only** on port 7071 (default, safe for production)
2. **Proxy provides HTTPS** on port 7072 with mkcert wildcard certificate
3. **Routes subdomain** `https://data-access.sharethrift.localhost:7072` → `http://localhost:7071`

**Benefits:**
- ✅ Works reliably with trusted mkcert certificates
- ✅ No dependency on buggy Azure Functions `--cert` flag
- ✅ Azure Functions uses default settings (production-safe)
- ✅ Clean separation: proxy handles TLS, Functions handles logic
- ✅ Simple ~40 lines of Node.js code we control

The proxy code can be found in the repository root: `local-https-proxy.js`

## Prerequisites

Before setting up localhost subdomains, ensure you have:

- [Node.js](https://nodejs.org/) version 22.0 or above
- [pnpm](https://pnpm.io/) package manager
- [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local) v4.0 or above
- [mkcert](https://github.com/FiloSottile/mkcert) for frontend HTTPS certificates (optional for subdomain routing)
- A reverse proxy (nginx, Caddy, or Traefik) - optional, only needed for true subdomain routing

## Setting Up HTTPS Certificates with mkcert

### Installation

**macOS (Homebrew)**:
```bash
brew install mkcert
brew install nss # For Firefox support
```

**Windows (Chocolatey)**:
```bash
choco install mkcert
```

**Windows (Scoop)**:
```bash
scoop install mkcert
```

**Linux**:
```bash
# Ubuntu/Debian
sudo apt install libnss3-tools
curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
chmod +x mkcert-v*-linux-amd64
sudo mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert

# Arch Linux
sudo pacman -S mkcert
```

### Generate Wildcard Certificates

1. Install the local Certificate Authority:
```bash
mkcert -install
```

2. Create a certificates directory in the project root:
```bash
mkdir -p certs
cd certs
```

3. Generate wildcard certificate for `*.sharethrift.localhost`:
```bash
mkcert "*.sharethrift.localhost" "sharethrift.localhost" localhost 127.0.0.1 ::1
```

This creates two files:
- `_wildcard.sharethrift.localhost+4.pem` (certificate)
- `_wildcard.sharethrift.localhost+4-key.pem` (private key)

4. Rename for convenience (optional):
```bash
mv _wildcard.sharethrift.localhost+4.pem sharethrift-localhost.pem
mv _wildcard.sharethrift.localhost+4-key.pem sharethrift-localhost-key.pem
```

### Certificate Location

Store certificates in the project root `/.certs` directory. Add `/.certs` to `.gitignore` to avoid committing private keys:

```gitignore
# Local HTTPS certificates
/.certs/*.pem
/.certs/*.key
```

## Frontend Configuration

### Frontend Proxy Configuration (Vite)

For the frontend UI to connect to the HTTPS-proxied backend, configure Vite's dev server proxy.

Update `vite.config.ts` in your frontend package:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://data-access.sharethrift.localhost:7072',
        changeOrigin: true,
        secure: false, // Accept self-signed certificates
        ws: true, // Enable WebSocket proxying
      },
      '/graphql': {
        target: 'https://data-access.sharethrift.localhost:7072',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  }
});
```

## Reverse Proxy for Multiple Subdomains (Optional)

If you need true subdomain routing (e.g., `https://data-access.sharethrift.localhost`), you can set up a reverse proxy. This is optional since direct port access works for most development scenarios.

### Option 1: Nginx

1. **Install Nginx**:

**macOS**:
```bash
brew install nginx
```

**Ubuntu/Debian**:
```bash
sudo apt install nginx
```

**Windows (via WSL2)**:
```bash
sudo apt install nginx
```

2. **Create Nginx Configuration**:

Create `local-proxy.conf` in the project root:

```nginx
# Sharethrift Local Development Proxy Configuration

# Frontend UI
server {
    listen 443 ssl;
    server_name sharethrift.localhost;

    ssl_certificate /path/to/project/certs/sharethrift-localhost.pem;
    ssl_certificate_key /path/to/project/certs/sharethrift-localhost-key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 443 ssl;
    server_name data-access.sharethrift.localhost;

    ssl_certificate /path/to/project/certs/sharethrift-localhost.pem;
    ssl_certificate_key /path/to/project/certs/sharethrift-localhost-key.pem;

    location / {
        proxy_pass http://localhost:7071;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Documentation
server {
    listen 443 ssl;
    server_name docs.sharethrift.localhost;

    ssl_certificate /path/to/project/certs/sharethrift-localhost.pem;
    ssl_certificate_key /path/to/project/certs/sharethrift-localhost-key.pem;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Mock Payment Service
server {
    listen 443 ssl;
    server_name mock-payment.sharethrift.localhost;

    ssl_certificate /path/to/project/certs/sharethrift-localhost.pem;
    ssl_certificate_key /path/to/project/certs/sharethrift-localhost-key.pem;

    location / {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Mock Messaging Service
server {
    listen 443 ssl;
    server_name mock-messaging.sharethrift.localhost;

    ssl_certificate /path/to/project/certs/sharethrift-localhost.pem;
    ssl_certificate_key /path/to/project/certs/sharethrift-localhost-key.pem;

    location / {
        proxy_pass http://localhost:8002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Mock Auth Service
server {
    listen 443 ssl;
    server_name mock-auth.sharethrift.localhost;

    ssl_certificate /path/to/project/certs/sharethrift-localhost.pem;
    ssl_certificate_key /path/to/project/certs/sharethrift-localhost-key.pem;

    location / {
        proxy_pass http://localhost:8003;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. **Update Certificate Paths**:

Replace `/path/to/project` with your actual project root path in the configuration above.

4. **Load Configuration**:

**macOS**:
```bash
# Copy config to nginx directory
sudo cp local-proxy.conf /usr/local/etc/nginx/servers/

# Test configuration
nginx -t

# Start/reload nginx
brew services restart nginx
```

**Linux/WSL2**:
```bash
# Link config to sites-available
sudo ln -s /path/to/project/local-proxy.conf /etc/nginx/sites-available/sharethrift-local

# Enable site
sudo ln -s /etc/nginx/sites-available/sharethrift-local /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### Option 2: Caddy

Caddy provides automatic HTTPS with a simpler configuration format.

1. **Install Caddy**:

**macOS**:
```bash
brew install caddy
```

**Linux**:
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

2. **Create Caddyfile**:

Create `Caddyfile` in the project root:

```caddy
{
    local_certs
}

sharethrift.localhost {
    tls /path/to/project/certs/sharethrift-localhost.pem /path/to/project/certs/sharethrift-localhost-key.pem
    reverse_proxy localhost:3000
}

data-access.sharethrift.localhost {
    tls /path/to/project/certs/sharethrift-localhost.pem /path/to/project/certs/sharethrift-localhost-key.pem
    reverse_proxy localhost:7071
}

docs.sharethrift.localhost {
    tls /path/to/project/certs/sharethrift-localhost.pem /path/to/project/certs/sharethrift-localhost-key.pem
    reverse_proxy localhost:3002
}

mock-payment.sharethrift.localhost {
    tls /path/to/project/certs/sharethrift-localhost.pem /path/to/project/certs/sharethrift-localhost-key.pem
    reverse_proxy localhost:8001
}

mock-messaging.sharethrift.localhost {
    tls /path/to/project/certs/sharethrift-localhost.pem /path/to/project/certs/sharethrift-localhost-key.pem
    reverse_proxy localhost:8002
}

mock-auth.sharethrift.localhost {
    tls /path/to/project/certs/sharethrift-localhost.pem /path/to/project/certs/sharethrift-localhost-key.pem
    reverse_proxy localhost:8003
}
```

3. **Run Caddy**:
```bash
caddy run
```

Or run in background:
```bash
caddy start
```

### Option 3: Traefik

Traefik is ideal for containerized environments and can be configured via Docker Compose.

Create `docker-compose.proxy.yml`:

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--entrypoints.websecure.address=:443"
    ports:
      - "443:443"
      - "8080:8080"  # Traefik dashboard
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./certs:/certs:ro
      - ./traefik.yml:/etc/traefik/traefik.yml:ro
```

## Single Dev Command

The development workflow requires just one command:

```bash
pnpm run dev
```

This single command:
- Builds all workspace packages
- Starts mock services (Azurite, MongoDB)
- Launches Azure Functions backend on HTTP port 7071
- Starts the custom HTTPS proxy on port 7072
- Starts the Vite development server with proxy configuration
- All services become accessible via HTTPS

### What `pnpm run dev` Does

The dev command orchestrates:

1. **Package builds**: Compiles TypeScript across all workspaces
2. **Certificate setup**: Generates mkcert certificates if needed
3. **HTTPS Proxy**: Starts background daemon on port 7072
4. **Service startup**: Azurite for blob/queue/table storage
5. **Backend**: Azure Functions runtime with HTTP on port 7071 (proxied to HTTPS)
6. **Frontend**: Vite dev server with HTTPS proxy configuration
7. **Docs**: Docusaurus on port 3002 (if enabled)
8. **Mocks**: Mock services with HTTPS on their respective ports

Services are accessible at:
- Backend API (HTTPS proxy): `https://data-access.sharethrift.localhost:7072`
- Backend API (HTTP direct): `http://localhost:7071`
- Frontend UI: `https://sharethrift.localhost:3000`
- GraphQL Playground: `https://data-access.sharethrift.localhost:7072/api/graphql`

## Authentication & Cookies

### Cookie Configuration

Ensure cookies work across subdomains by setting the `domain` attribute correctly:

```typescript
// Set cookies for all *.sharethrift.localhost subdomains
res.cookie('session', token, {
  domain: '.sharethrift.localhost',  // Leading dot for subdomain sharing
  secure: true,                       // HTTPS only
  httpOnly: true,                     // Prevent XSS
  sameSite: 'lax',                   // CSRF protection
  maxAge: 3600000                     // 1 hour
});
```

### OAuth/OIDC Redirect URIs

Update OAuth provider configurations to include localhost subdomain redirect URIs:

```
https://sharethrift.localhost/auth/callback
https://data-access.sharethrift.localhost/api/auth/callback
```

### CORS Configuration

Configure allowed origins to include all subdomains:

```typescript
const corsOptions = {
  origin: [
    'https://sharethrift.localhost',
    'https://data-access.sharethrift.localhost',
    'https://docs.sharethrift.localhost',
    // Add all subdomains
  ],
  credentials: true,  // Allow cookies
};
```

## WebSockets & Server-Sent Events

### WebSocket Proxy Configuration

WebSocket connections require proper upgrade headers. The nginx configuration above includes:

```nginx
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection 'upgrade';
proxy_cache_bypass $http_upgrade;
```

### Testing WebSockets

Test WebSocket connectivity:

```javascript
const ws = new WebSocket('wss://data-access.sharethrift.localhost/ws');

ws.onopen = () => console.log('WebSocket connected');
ws.onerror = (error) => console.error('WebSocket error:', error);
```

## GitHub Codespaces Support

When running in GitHub Codespaces, the subdomain approach requires additional configuration:

### Port Forwarding

Codespaces automatically forwards ports, but you need to:

1. Set port visibility to "Public" for ports 443, 3000, 3001, 7071, 8001-8003
2. Configure the reverse proxy to use Codespaces port forwarding URLs

### Codespaces-Specific Configuration

Detect Codespaces environment and adjust URLs:

```javascript
const isCodespaces = process.env.CODESPACES === 'true';
const baseUrl = isCodespaces 
  ? `https://${process.env.CODESPACE_NAME}-443.githubpreview.dev`
  : 'https://sharethrift.localhost';
```

### Limitations

- Custom subdomains may not work identically in Codespaces
- Use port-based forwarding as fallback: `https://[codespace]-7071.githubpreview.dev`
- Document Codespaces-specific setup in project README

## CI/CD Pipeline Support

### CI Environment Detection

CI pipelines may not support localhost subdomain routing. Detect CI and use alternative configuration:

```typescript
const isCI = process.env.CI === 'true';
const baseUrl = isCI
  ? 'http://localhost:3000'  // Direct port access in CI
  : 'https://sharethrift.localhost';
```

### Azure Pipelines

For Azure DevOps pipelines, use service containers or direct port mapping:

```yaml
steps:
  - script: pnpm install
  - script: pnpm run build
  - script: pnpm run test
    env:
      API_URL: http://localhost:7071
      # Direct ports instead of subdomains
```

## Troubleshooting

### Certificate Not Trusted

**Symptom**: Browser shows "Your connection is not private"

**Solution**:
1. Verify mkcert CA is installed: `mkcert -install`
2. Restart browser after installing CA
3. Check certificate location matches nginx/Caddy config

### Subdomain Not Resolving

**Symptom**: "This site can't be reached" error

**Solution**:
1. Verify `.localhost` domains resolve automatically (they should on modern browsers)
2. Check reverse proxy is running: `nginx -t` or `caddy validate`
3. Verify reverse proxy is listening on port 443: `lsof -i :443`
4. Check firewall isn't blocking port 443

### Port Already in Use

**Symptom**: "Address already in use" error

**Solution**:
```bash
# Find process using port 443
sudo lsof -i :443

# Kill the process
sudo kill -9 <PID>

# Or use a different port in proxy config
```

### WebSocket Connection Failed

**Symptom**: WebSocket connections fail or immediately disconnect

**Solution**:
1. Verify upgrade headers in proxy configuration
2. Check browser console for specific error messages
3. Test direct port connection: `ws://localhost:7071/ws`

### CORS Errors

**Symptom**: "Access-Control-Allow-Origin" errors in browser console

**Solution**:
1. Add subdomain to CORS allowed origins list
2. Ensure `credentials: true` is set if using cookies
3. Verify `X-Forwarded-*` headers are passed through proxy

### macOS VPN/Proxy Interference

**Symptom**: Subdomains work sometimes but not others

**Solution**:
1. Check VPN doesn't intercept `.localhost` domains
2. Disable corporate proxy for local development
3. Add exception in VPN/proxy config for `*.localhost`

### Windows WSL2 Networking

**Symptom**: Windows can't access WSL2 services

**Solution**:
1. Use WSL2 IP address instead of localhost in Windows browser
2. Configure Windows firewall to allow WSL2 connections
3. Use Windows-based reverse proxy (nginx via Chocolatey)

## Adding New Subdomains

To add a new service subdomain:

1. **Start the service** on a unique local port (e.g., 8004)

2. **Add proxy configuration**:

For nginx (`local-proxy.conf`):
```nginx
server {
    listen 443 ssl;
    server_name my-new-service.sharethrift.localhost;

    ssl_certificate /path/to/project/certs/sharethrift-localhost.pem;
    ssl_certificate_key /path/to/project/certs/sharethrift-localhost-key.pem;

    location / {
        proxy_pass http://localhost:8004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

For Caddy (`Caddyfile`):
```caddy
my-new-service.sharethrift.localhost {
    tls /path/to/project/certs/sharethrift-localhost.pem /path/to/project/certs/sharethrift-localhost-key.pem
    reverse_proxy localhost:8004
}
```

3. **Reload proxy**:
```bash
# Nginx
sudo nginx -s reload

# Caddy
caddy reload
```

4. **Update CORS configuration** to include new subdomain

5. **Update documentation** with new subdomain details

## Health Check Script

Verify all subdomains are working:

```bash
#!/bin/bash
# health-check.sh

echo "🔍 Checking Sharethrift localhost subdomains..."

SUBDOMAINS=(
  "https://sharethrift.localhost"
  "https://data-access.sharethrift.localhost"
  "https://docs.sharethrift.localhost"
  "https://mock-payment.sharethrift.localhost"
  "https://mock-messaging.sharethrift.localhost"
  "https://mock-auth.sharethrift.localhost"
)

for url in "${SUBDOMAINS[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -k "$url")
  if [ "$STATUS" -eq 200 ] || [ "$STATUS" -eq 302 ]; then
    echo "✅ $url - OK ($STATUS)"
  else
    echo "❌ $url - FAILED ($STATUS)"
  fi
done

echo "✨ Health check complete!"
```

Make executable and run:
```bash
chmod +x health-check.sh
./health-check.sh
```

## Platform-Specific Notes

### macOS

- Use Homebrew for installing tools
- mkcert integrates seamlessly with macOS keychain
- nginx installed via Homebrew uses `/usr/local/etc/nginx/`

## CI/CD Compatibility

The subdomain setup is **local development only**. All certificate-dependent code gracefully falls back to HTTP when certificates don't exist:

### Automatic Fallbacks

- **Vite**: Falls back to `http://localhost:3000` when `.certs/` missing
- **Mock Servers**: Listen on HTTP `localhost` ports in CI/CD
- **Azure Functions**: Always runs HTTP (unaffected by local proxy)

### Why This Works

- Certificate files are `.gitignore`d and never committed
- `predev` script generates certs via mkcert before starting services
- CI/CD pipelines skip cert generation entirely
- All services detect missing certs with `fs.existsSync()` checks
- No environment variables needed to toggle behavior

### Pipeline Behavior

**Local Development:**
```bash
pnpm run dev
# → Generates certs → Starts HTTPS proxy → Services use HTTPS
```

**CI/CD Pipeline:**
```bash
pnpm test
# → No certs generated → Services fall back to HTTP → Tests pass
```

This ensures:
- ✅ Zero pipeline configuration changes needed
- ✅ Tests run identically on localhost and CI
- ✅ No developer friction switching between HTTP/HTTPS

### Windows with WSL2

- Install mkcert in both Windows AND WSL2 environments
- Copy certificates from WSL2 to Windows if accessing from Windows browsers
- Use WSL2 for running the reverse proxy
- Access services from Windows using `localhost` or WSL2 IP

### Linux

- May need `sudo` for installing tools and managing nginx/Caddy
- Use systemd to manage proxy service: `sudo systemctl enable nginx`
- mkcert requires `libnss3-tools` for browser integration

## Additional Resources

- [mkcert GitHub Repository](https://github.com/FiloSottile/mkcert)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Caddy Documentation](https://caddyserver.com/docs/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [MDN: Using HTTPS for Development](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL#localhost)

## Summary

The localhost subdomain approach:
- ✅ Provides production-like development environment
- ✅ Enables proper cookie and CORS testing
- ✅ Supports seamless OAuth/authentication flows
- ✅ Requires minimal setup (mkcert + reverse proxy)
- ✅ Works with single `pnpm run dev` command
- ✅ Compatible with containers and cloud deployments

This setup ensures your local development environment closely mirrors production, reducing deployment surprises and improving developer experience.
