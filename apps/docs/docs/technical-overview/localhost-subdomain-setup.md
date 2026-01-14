---
sidebar_position: 3
sidebar_label: Localhost Subdomain Setup
description: Guide to setting up HTTPS-enabled localhost subdomains for local development
---

# Localhost Subdomain Development Setup

Sharethrift uses a subdomain-based architecture in local development with `*.sharethrift.localhost` domains and HTTPS to mirror production and support OAuth, cookie sharing, and CORS testing.

## Local Development Subdomains

### Application Services
- **Frontend UI**: `https://sharethrift.localhost:3000`
- **Backend API (HTTPS proxy)**: `https://data-access.sharethrift.localhost:7072`
- **Backend API (HTTP direct)**: `http://localhost:7071`
- **Documentation**: `https://docs.sharethrift.localhost:3002`

### Mock Services
- **Payment**: `https://mock-payment.sharethrift.localhost:3001`
- **Messaging**: `https://mock-messaging.sharethrift.localhost:10000`
- **Auth**: `https://mock-auth.sharethrift.localhost:4000`
- **MongoDB**: `mongodb://mongodb.sharethrift.localhost:50000`

## HTTPS Proxy Architecture

Azure Functions Core Tools v4.2.2 has a broken `--cert` flag that ignores custom certificates. Instead, we use a custom Node.js HTTPS proxy:

1. Azure Functions runs HTTP-only on port 7071
2. HTTPS proxy on port 7072 with mkcert wildcard certificate
3. Routes `https://data-access.sharethrift.localhost:7072` → `http://localhost:7071`

See `local-https-proxy.js` in the repository root.

## Quick Setup

### Install mkcert

**macOS**:
```bash
brew install mkcert nss
```

**Windows**:
```bash
choco install mkcert
```

**Linux**:
```bash
sudo apt install libnss3-tools
curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
chmod +x mkcert-v*-linux-amd64
sudo mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert
```

### Generate Certificates

```bash
mkcert -install
mkdir -p .certs && cd .certs
mkcert "*.sharethrift.localhost" "sharethrift.localhost" localhost 127.0.0.1 ::1
```

Certificates are stored in `/.certs` (gitignored).


## Cookie and CORS Configuration

### Cross-Subdomain Cookies

```typescript
res.cookie('session', token, {
  domain: '.sharethrift.localhost',  // Leading dot for subdomain sharing
  secure: true,                       // HTTPS only
  httpOnly: true,
  sameSite: 'lax',
});
```

### CORS Setup

```typescript
const corsOptions = {
  origin: [
    'https://sharethrift.localhost',
    'https://data-access.sharethrift.localhost',
    'https://docs.sharethrift.localhost',
  ],
  credentials: true,
};
```

## CI/CD Compatibility

The subdomain setup is **local development only**. All services gracefully fall back to HTTP when certificates don't exist:

- Certificate files are gitignored
- Services detect missing certs with `fs.existsSync()`
- CI/CD pipelines skip cert generation
- No environment variables needed

**Local**:
```bash
pnpm run dev  # → HTTPS with certs
```

**CI/CD**:
```bash
pnpm test  # → HTTP fallback (no certs)
```

## Troubleshooting

### Certificate Not Trusted
```bash
mkcert -install  # Reinstall CA
# Restart browser
```

### Port Already in Use
```bash
sudo lsof -i :7072
sudo kill -9 <PID>
```

### CORS Errors
Add subdomain to CORS `origin` array and ensure `credentials: true`.

## Additional Resources

- [mkcert](https://github.com/FiloSottile/mkcert) - Local certificate authority
- [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local) - Local runtime
