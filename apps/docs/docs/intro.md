---
sidebar_position: 1
---

# Introduction 👋

Let's discover **Sharethrift in less than 5 minutes**.

## Getting Started

Get started by **exploring the Sharethrift platform**.

Sharethrift is a Domain-Driven Design (DDD) monorepo built on Azure Functions, implementing a modular architecture with strict separation of concerns.

### What you'll need

- [Node.js](https://nodejs.org/en/download/) version 22.0 or above:
  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.
- [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local) for local development
- [MongoDB](https://www.mongodb.com/try/download/community) or access to a MongoDB instance

## Clone and Setup

Clone the Sharethrift repository and set up the development environment:

```bash
git clone https://github.com/Sharethrift/sharethrift.git
cd sharethrift
```i

Install dependencies and build the project:

```bash
# Use Node.js v22
nvm use v22

# Clean, install dependencies, and build
npm run clean && npm install && npm run build
```

## Start Development

Run the development environment:

```bash
npm run dev
```

This command will:
- Build all workspace packages
- Start mock emulator services (Azurite for Azure Storage)
- Launch the backend Azure Functions runtime
- Start the frontend React UI

The development server will be available at:
- **API**: http://localhost:7071 (Azure Functions)
- **GraphQL Playground**: http://localhost:7071/api/graphql
- **Frontend**: http://localhost:3000 (if using the UI packages)

## Architecture Overview

Sharethrift follows these core patterns:

- **Domain Layer**: Core business logic in `packages/sthrift/domain/src/domain/contexts/`
- **Application Services**: Orchestration layer for business operations
- **Infrastructure**: Data persistence via Mongoose, OpenTelemetry observability  
- **API Layer**: GraphQL and REST endpoints via Azure Functions

Open any file in the `packages/` directory and start exploring: the project uses hot reloading for rapid development!

## Local EdgeScan Setup

EdgeScan is a Dynamic Application Security Testing (DAST) platform that scans live running applications to identify runtime vulnerabilities and security weaknesses. Unlike static analysis tools like Snyk or SonarCloud that scan source code, EdgeScan tests the actual deployed application behavior.

### How to use

- Use `pnpm run edgescan:dev` to run local security validation scans.
- **DO NOT** use `edgescan:agent` locally; it is strictly reserved for the GitHub Copilot AI Coding Agent and CI/CD automation.

### Prerequisites

#### 1. Apple Native Containers

One-time setup for macOS developers:

1. Download the signed installer package from Apple's container releases page.
2. Run the installer.
3. Start the container system with:
   ```bash
   container system start
   ```
   Input 'Y' when prompted.
4. Confirm it is working with:
   ```bash
   container system status
   ```
   Expected output:
   ```
   container system status
   apiserver is running
   ```

#### 2. EdgeScan API Token

1. Log in to https://intealth.edgescan.com
2. Go to Profile Settings and generate an API token
3. Export it in the terminal (optionally add to ~/.zshrc or ~/.bashrc for persistence):
   ```bash
   export ES_API_TOKEN="your token here"
   ```

#### 3. EdgeScan Asset ID

This is the asset you want to scan (provided by the EdgeScan team or available from the EdgeScan UI). Export it:

```bash
export ES_ASSET_ID="your asset id here"
```
