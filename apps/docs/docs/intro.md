---
sidebar_position: 1
---

# Introduction 👋

Let's discover **Sharethrift in less than 5 minutes**.

## Getting Started

Get started by **exploring the Sharethrift platform**.

Sharethrift is a Domain-Driven Design (DDD) monorepo built on Azure Functions, implementing a modular architecture with strict separation of concerns.

### What you'll need

- [mise](https://mise.jdx.dev/) - manages Node.js v22 and Python (replaces nvm)
- [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local) for local development

## Clone and Setup

Clone the Sharethrift repository and set up the development environment:

```bash
git clone https://github.com/Sharethrift/sharethrift.git
cd sharethrift
```

Install tools and dependencies:

```bash
# Install tools (Node + Python)
mise install

# Install Node and Python packages in one command
pnpm run install:all

# Build
pnpm run build
```

## Start Development

Run the development environment:

```bash
pnpm run dev
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
