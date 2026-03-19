# CellixJS Development Guide

## Architecture Overview

CellixJS is a Domain-Driven Design (DDD) monorepo built on Azure Functions, implementing a modular architecture with strict separation of concerns:

- **Domain Layer**: Core business logic in `packages/sthrift/domain/src/domain/contexts/`
- **Application Services**: Orchestration layer in `packages/cellix-api-services-spec/`
- **Infrastructure**: Data persistence via Mongoose, OpenTelemetry observability
- **API Layer**: GraphQL and REST endpoints via Azure Functions

## Core Patterns

### DDD Structure
Each bounded context follows this structure:
```
domain/contexts/{context-name}/
├── {entity}.ts              # Aggregate roots and entities
├── {entity}.value-objects.ts # Immutable value objects
├── {entity}.uow.ts          # Unit of Work pattern
└── README.md                # Domain structure documentation
```

### Service Registration Pattern
The `Cellix` class orchestrates dependency injection:
```typescript
Cellix.initializeServices<ApiContextSpec>((serviceRegistry) => {
  serviceRegistry.registerService(new ServiceMongoose(...));
})
.setContext((serviceRegistry) => ({ 
  domainDataSource: contextBuilder(serviceRegistry.getService(ServiceMongoose))
}))
```

### Azure Functions Integration
Functions are registered via the main application factory:
```typescript
cellix.registerAzureFunctionHandler('graphql', { route: 'graphql' }, graphHandlerCreator)
```

## Development Workflow

### Essential Commands
```bash
# Initial setup (Node v20 required)
nvm use v20 && npm run clean && npm install && npm run build

# Development startup
npm run start  # Builds all packages and starts Azure Functions

# Package-specific operations
npm run build --ws --if-present    # Build all workspaces
npm run lint --ws --if-present     # Lint all workspaces
```

### VS Code Tasks
Use VS Code tasks for development (preferred over manual commands):
- `func: host start` - Start Azure Functions runtime
- `npm watch (functions)` - Watch mode for API package
- `npm build (functions)` - Build API package

### Testing
- Coverage reports generated in `packages/*/coverage/`
- Run tests: `npm test`

## Code Quality & Standards

### Biome Configuration
- Linting and formatting via Biome (configured in `biome.json`)
- Strict TypeScript configuration (`tsconfig.base.json`)
- Tab indentation, strict type checking enabled

### Observability
- OpenTelemetry integration via `@azure/monitor-opentelemetry`
- Automatic instrumentation for MongoDB and Azure Functions
- GraphQL tracing built-in via Apollo Server

## Key Dependencies

### Workspace Structure
Monorepo uses npm workspaces with these core packages:
- `@apps/api` - Main Azure Functions application
- `@sthrift/domain` - Domain models and business logic
- `@sthrift/graphql` - GraphQL implementation
- `@cellix/service-mongoose` - MongoDB data layer
- `@cellix/*` - Shared seedwork libraries

### External Integrations
- **Azure Functions v4** for serverless hosting
- **MongoDB** via Mongoose for persistence
- **Apollo Server** for GraphQL with Azure Functions adapter
- **Azurite** for local Azure storage emulation

## Architecture Decisions

Key ADRs document critical decisions:
- **0003-domain-driven-design.md**: DDD patterns and bounded contexts
- **0002-open-telemetry.md**: Observability strategy
- **0011-bicep.md**: Infrastructure as Code approach

## File Naming Conventions

- `.entity.ts` for domain entities
- `.value-objects.ts` for value object collections
- `.uow.ts` for Unit of Work implementations
- `azure-functions.ts` for Azure Functions adapters
- Use kebab-case for directories and files

## Service and Server Package Naming Convention

CellixJS uses a consistent naming pattern for service and server packages across the monorepo to ensure clarity and maintainability.

### Service Packages (`@cellix/service-*`)

Services implement external integrations or cross-cutting concerns. Naming pattern:
```
@cellix/service-[category]-[specific-type]-[variant]?
```

**Categories & Examples:**
- **Messaging Services** (`@cellix/service-messaging-*`)
  - `@cellix/service-messaging-base` - Base interface/abstract class
  - `@cellix/service-messaging-twilio` - Twilio implementation
  - `@cellix/service-messaging-mock` - Mock implementation for local development

- **Payment Services** (`@cellix/service-payment-*`)
  - `@cellix/service-payment-base` - Base interface/abstract class
  - `@cellix/service-payment-cybersource` - CyberSource implementation
  - `@cellix/service-payment-mock` - Mock implementation for local development

**Variant Suffixes:**
- `-base`: Shared interface or abstract base class that all implementations follow
- `-mock`: Local development/testing implementation (no real credentials needed)
- `[specific-provider]`: Production implementation for a specific provider (e.g., `-twilio`, `-cybersource`)

### Server Packages

Servers are split into two types: seedwork (logic) and apps (launchers).

#### Server Seedwork (`@cellix/server-*-seedwork`)
Contains the core business logic and implementation for a mock server. Naming pattern:
```
@cellix/server-[name]-seedwork
```

**Examples:**
- `@cellix/server-messaging-seedwork` - Messaging server logic
- `@cellix/server-payment-seedwork` - Payment server logic
- `@cellix/server-oauth2-seedwork` - OAuth2 server logic
- `@cellix/server-mongodb-memory-seedwork` - MongoDB Memory Server logic

#### Server Apps (`@apps/server-*-mock`)
Launcher applications that start a mock server for local development. Naming pattern:
```
@apps/server-[name]-mock
```

**Examples:**
- `@apps/server-messaging-mock` - Messaging server launcher
- `@apps/server-payment-mock` - Payment server launcher
- `@apps/server-oauth2-mock` - OAuth2 server launcher
- `@apps/server-mongodb-memory-mock` - MongoDB Memory Server launcher

### Relationship Between Packages

```
@cellix/server-messaging-seedwork (logic)
                ↑
                └─── Used by ───→ @apps/server-messaging-mock (launcher)

@cellix/service-messaging-base (interface)
                ├─── Implemented by ───→ @cellix/service-messaging-twilio (production)
                └─── Implemented by ───→ @cellix/service-messaging-mock
                                                ↓
                                                └─── Calls ───→ @apps/server-messaging-mock
```

### Import Examples

```typescript
// Import service implementation
import { ServiceMessagingTwilio } from '@cellix/service-messaging-twilio';
import { ServiceMessagingMock } from '@cellix/service-messaging-mock';

// Import service interface
import { MessagingServiceInterface } from '@cellix/service-messaging-base';

// Import server logic
import { MessagingServer } from '@cellix/server-messaging-seedwork';
```
