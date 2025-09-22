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
```

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

- **Domain Layer**: Core business logic in `packages/domain/src/domain/contexts/`
- **Application Services**: Orchestration layer for business operations
- **Infrastructure**: Data persistence via Mongoose, OpenTelemetry observability  
- **API Layer**: GraphQL and REST endpoints via Azure Functions

Open any file in the `packages/` directory and start exploring: the project uses hot reloading for rapid development!
