# Snyk Security Scanning

## Quick Start

### 1. Get Your Token
1. Sign up at [snyk.io](https://snyk.io) with GitHub
2. Go to **Account Settings** → **Auth Token**
3. Copy your API token

### 2. Authenticate Locally
```bash
export SNYK_TOKEN="your-token-here"
# OR
pnpm exec snyk auth
```

### 3. Run Scans
```bash
pnpm run snyk          # Full scan (dependencies + code)
pnpm run snyk:test     # Dependencies only
pnpm run snyk:code     # Source code only
pnpm run snyk:iac      # Infrastructure (Bicep files)
```

---

## Available Scripts

| Script | Purpose | When to Use |
|--------|---------|-------------|
| `snyk` | Runs `snyk:test` + `snyk:code` | PR builds, local checks |
| `snyk:report` | Runs `snyk:monitor` + `snyk:code:report` | Main branch builds |
| `snyk:test` | Scan npm dependencies | Check for vulnerable packages |
| `snyk:monitor` | Snapshot dependencies to Snyk dashboard | Track vulnerabilities over time |
| `snyk:code` | Static code analysis (SAST) | Find security issues in code |
| `snyk:code:report` | Code analysis + upload to dashboard | Main branch reporting |
| `snyk:iac` | Scan Bicep files | Check infrastructure configs |
| `snyk:iac:report` | IaC scan + upload to dashboard | Main branch reporting |

---

## CI/CD Integration

The Azure Pipeline automatically runs Snyk:
- **Pull Requests**: `pnpm run snyk` (test only)
- **Main Branch**: `pnpm run snyk:report` (test + upload results)

The `SNYK_TOKEN` is stored in the `snyk-credential-sharethrift` Azure DevOps variable group.

---

## Viewing Results

1. Go to [app.snyk.io](https://app.snyk.io)
2. Select **Simnova** organization
3. View projects, vulnerabilities, and remediation advice
