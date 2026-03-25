# ShareThrift Codebase Context

## 🎯 Project Overview

**ShareThrift** is a modern, community-driven peer-to-peer sharing platform designed to reduce waste and enable the sharing of items, services, and classes. It empowers individuals and organizations to participate in the circular economy.


### Core Purpose
- Reduce consumer waste by extending item lifecycles
- Enable cost-efficient access to tools, equipment, and skills
- Support individuals, small businesses, and partners with flexible sharing models
- Explore modern technology and product design patterns through an MVP implementation
- Built using **Domain-Driven Design (DDD)**, event-driven communication, and modular application boundaries

## 🏗️ Architecture Overview

ShareThrift implements a **layered Domain-Driven Design** architecture:

### Architectural Layers
1. **Domain Layer**: Aggregates, entities, value objects, domain events (core business logic)
2. **Application Layer**: Orchestration and services (future explicit service modules)
3. **Infrastructure Layer**: Persistence (Mongoose), telemetry, messaging adapters
4. **Interface Layer**: Azure Functions entrypoints (GraphQL + planned REST)

### Key DDD Patterns Used
- **Aggregates**: Consistency boundaries with aggregate roots (`*.aggregate.ts`)
- **Value Objects**: Immutable domain concepts with constraints (`*.value-objects.ts`)
- **Unit of Work**: Atomic change set coordination (`*.uow.ts`)
- **Domain Events**: Event-driven strategy for behavioral change (evolving via ADRs)
- **Bounded Contexts**: Modular boundaries between domain concerns
- **Repositories**: Data persistence abstractions
- **Passport/Visa System**: Permission-based domain access control

### Service Registry Pattern
The `Cellix` class orchestrates dependency injection across the application:
```typescript
Cellix.initializeServices<ApiContextSpec>((serviceRegistry) => {
  serviceRegistry.registerService(new ServiceMongoose(...));
})
.setContext((serviceRegistry) => ({
  domainDataSource: contextBuilder(serviceRegistry.getService(ServiceMongoose))
}))
```

## 📦 Monorepo Structure

This is a **pnpm monorepo** using **Turborepo** for optimized builds.

```
sharethrift/
├── apps/
│   ├── api/                 # Azure Functions host (GraphQL + future REST)
│   ├── ui-sharethrift/      # Front-end application (Vite + React + TypeScript)
│   ├── docs/                # Docusaurus documentation site
│   └── server-*-mock/       # Mock servers for local development
├── packages/
│   ├── sthrift/             # ShareThrift domain + adapters
│   │   ├── domain/          # Core business logic (DDD contexts)
│   │   ├── graphql/         # GraphQL schema and resolvers
│   │   ├── rest/            # REST API adapters
│   │   ├── persistence/     # MongoDB persistence layer
│   │   ├── application-services/  # Orchestration services
│   │   ├── ui-components/   # Shared React components
│   │   └── acceptance-tests/     # BDD acceptance tests (Serenity.js)
│   └── cellix/              # Seedwork abstractions (shared across projects)
│       ├── domain-seedwork/           # DDD base classes
│       ├── event-bus-seedwork-node/   # Event bus abstractions
│       ├── mongoose-seedwork/         # MongoDB base patterns
│       ├── service-*-*/               # Service implementations
│       ├── server-*-seedwork/         # Mock server logic
│       └── arch-unit-tests/           # Architecture validation tests
├── iac/                     # Bicep infrastructure as code
├── documents/               # BRD, SRD, ADRs, architecture diagrams
└── build-pipeline/          # Build and deployment scripts
```

### Package Naming Conventions

#### Service Packages (`@cellix/service-*`)
```
@cellix/service-[category]-[specific-type]-[variant]?
```
- **Base** (`-base`): Interface or abstract class that implementations follow
- **Mock** (`-mock`): Local development/testing implementation
- **Specific** (`-twilio`, `-cybersource`): Production implementations

Example: `@cellix/service-messaging-mock`, `@cellix/service-payment-base`

#### Server Packages
- **Seedwork** (`@cellix/server-*-seedwork`): Core business logic
- **Apps** (`@apps/server-*-mock`): Launcher applications for local development

Example: `@cellix/server-messaging-seedwork` → `@apps/server-messaging-mock`

### Key Packages

**Frontend**:
- `@app/ui-sharethrift` - Main UI application
- `@sthrift/ui-components` - Shared component library

**Backend**:
- `@app/api` - Azure Functions host
- `@sthrift/domain` - Domain models and business logic
- `@sthrift/graphql` - GraphQL schema and resolvers
- `@sthrift/persistence` - MongoDB persistence layer
- `@sthrift/application-services` - Service orchestration
- `@cellix/domain-seedwork` - DDD base classes
- `@cellix/mongoose-seedwork` - MongoDB patterns

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js (v22, see `mise.toml`) |
| **Language** | TypeScript (strict config) |
| **Version Manager** | [mise](https://mise.jdx.dev/) (Node.js + Python) |
| **Package Manager** | pnpm@10.18.2 |
| **Monorepo Tool** | Turborepo 2.8.16 |
| **API** | Apollo GraphQL |
| **Frontend Framework** | React (Vite) |
| **Persistence** | MongoDB (Mongoose 8.x) |
| **Infrastructure** | Azure Functions v4 |
| **IaC** | Bicep modules |
| **Testing** | Vitest, Serenity.js, Playwright |
| **Code Quality** | Biome 2.0 (linting + formatting), Sourcery (local review) |
| **CI/CD** | Azure Pipelines |
| **Code Analysis** | SonarCloud |
| **Vulnerability Scanning** | Snyk |
| **Observability** | OpenTelemetry + Azure Monitor |
| **Local Emulation** | Azurite (blob/queue) |

## 🔧 Development Workflow

### Prerequisites

**1. Install mise (version manager)**
```bash
# On macOS with Homebrew
brew install mise

# On other systems, see https://mise.jdx.dev/getting-started.html
```

**2. Activate mise in your shell** (already added to `~/.zshrc`)
```bash
eval "$(mise activate zsh)"
```

**3. Install tools and dependencies**
```bash
mise install              # Installs Node.js and Python per mise.toml + requirements.txt
source .venv/bin/activate # Activate Python virtual environment (optional but recommended)
```

This will:
- Install Node.js v22.20.0 (from `mise.toml`)
- Install Python 3.13 (from `mise.toml`)
- Create `.venv/` Python virtual environment (auto-created)
- Install Python packages from `requirements.txt` (Sourcery, etc.)

### Initial Setup
```bash
# Install Node + Python dependencies
pnpm run install:all

# Build the project
pnpm run build
```

### Development Server
```bash
pnpm run dev
```
This:
1. Builds all packages
2. Stops and restarts the Portless proxy for HTTPS
3. Starts Azurite (local Azure storage)
4. Watches for changes in all packages

### Local Endpoints
| Portal | Endpoint |
|--------|----------|
| Frontend | http://localhost:3000 |
| Docs | http://localhost:3002 |
| GraphQL | http://localhost:7071/api/graphql |

### Build & Test Commands
```bash
# Build
pnpm run build            # All packages
turbo run build --filter=<package>  # Specific package

# Test
pnpm run test             # All packages
pnpm run test:watch       # Watch mode
pnpm run test:all         # Full test suite with coverage

# Acceptance Tests (Serenity.js)
pnpm run test:acceptance:domain          # Domain layer
pnpm run test:acceptance:session:graphql  # Session integration with GraphQL
pnpm run test:acceptance:dom:graphql     # DOM integration with GraphQL
pnpm run test:acceptance:all             # All acceptance tests

# Quality Checks
pnpm run lint             # Linting
pnpm run format           # Format with Biome
pnpm run test:arch        # Architecture unit tests
pnpm run sourcery:review       # Sourcery code review (changed files)
pnpm run sourcery:review:diff  # Sourcery diff-only review
pnpm run sourcery:review:fix   # Sourcery auto-fix suggestions
pnpm run verify           # Full verification (arch + coverage + knip + sourcery + snyk + sonar)
```

### Code Review with Sourcery

**Setup** (one-time):
```bash
sourcery login  # Sign up at https://sourcery.ai and authenticate
```

**Usage**:
```bash
# Review changed files in current branch
pnpm run sourcery:review

# Review only diff (against main)
pnpm run sourcery:review:diff

# Auto-fix suggestions
pnpm run sourcery:review:fix
```

See [`.sourcery.yaml`](.sourcery.yaml) for configuration (ignored paths, etc.).

## 📝 Code Conventions

### File Naming Conventions

**Domain Entities & Aggregates**:
- Aggregate root: `{entity-name}.aggregate.ts`
- Value objects: `{entity-name}.value-objects.ts`
- Unit of Work: `{entity-name}.uow.ts`
- Repository: `{entity-name}.repository.ts`

**Application Layer**:
- Services: `{service-name}.service.ts`
- DTOs: `{dto-name}.dto.ts`

**Infrastructure & Adapters**:
- Mongoose models: `{entity-name}.model.ts`
- Adapters: `{adapter-name}.adapter.ts`
- Azure Functions: `azure-functions.ts`

**General**:
- Kebab-case for files and directories
- PascalCase for classes and types
- camelCase for variables and functions

### Domain-Driven Design Conventions

#### 1. Domain Layer Structure
```
domain/contexts/{context-name}/
├── {entity}.aggregate.ts         # Aggregate root with factory
├── {entity}.value-objects.ts     # Immutable domain concepts
├── {entity}.uow.ts               # Unit of Work pattern
├── {entity}.repository.ts        # Persistence interface
├── iam/{entity}.{role}.passport.ts  # Permission definitions
└── README.md                     # Context documentation
```

#### 2. Aggregate Root Pattern
- Factory method: `static getNewInstance<T>(props, passport): AggregateType<T>`
- Private constructor to control creation
- Contains value objects and entities
- Enforces business rules and invariants
- Emits domain events

#### 3. Value Objects
- Immutable by design
- Enforce constraints in constructors
- Use `Object.freeze()` for runtime immutability
- Compare by value, not reference

#### 4. Passport/Visa System (Permissions)
- Domain operations require a `Passport` for authorization
- Each role has specific capabilities: `{entity}.{role}.passport.ts`
- Example: `listing.admin.passport.ts`, `listing.guest.passport.ts`
- Prevents unauthorized domain operations

#### 5. Repository Pattern
- Interface defined in domain: `{entity}.repository.ts`
- Implementation in persistence layer
- Abstract data storage details
- Return domain aggregates, not database models

### TypeScript Strictness

All packages use **strict TypeScript configuration**:
- `strict: true`
- No implicit `any`
- Full type safety required
- Use `Record<string, unknown>` for unknown object shapes
- Use nullish coalescing (`??`) for optional chaining

### Import & Export Best Practices
- **Barrel exports**: Use `index.ts` files for cleaner imports
- **Avoid wildcard imports**: Be explicit about what you import
- **Domain-first**: Import domain abstractions, not implementations
- **No infrastructure leaks**: Domain code never imports infrastructure

## 🧪 Testing Strategy

### Test Levels (Pyramid)

1. **Unit Tests** (Base)
   - File: `{component}.spec.ts` or `{component}.test.ts`
   - Framework: Vitest
   - Scope: Individual functions, classes, domain logic
   - Location: Colocated with source files

2. **Integration Tests** (Middle)
   - Test aggregate + repository behavior
   - Use in-memory MongoDB (mongodb-memory-server)
   - Verify Unit of Work coordination
   - File: `{feature}.integration.spec.ts`

3. **Acceptance Tests / BDD** (Top)
   - Framework: Serenity.js + Cucumber (Gherkin)
   - Location: `packages/sthrift/acceptance-tests/`
   - Test levels:
     - **domain**: Direct domain layer testing
     - **session**: In-process session management
     - **dom**: DOM/UI integration
   - Backends:
     - **Domain**: Pure domain aggregates
     - **GraphQL**: GraphQL resolver layer
     - **MongoDB**: Full persistence stack

   Example test matrix:
   ```
   Domain (domain) → Domain backend
   Session + Domain (session:domain) → Domain backend
   Session + GraphQL (session:graphql) → GraphQL backend
   DOM + Domain (dom:domain) → Domain backend
   DOM + GraphQL (dom:graphql) → GraphQL backend
   ```

### Acceptance Test Pattern (Serenity.js)

**File Structure**:
```
acceptance-tests/
├── src/
│   ├── step-definitions/     # Gherkin step implementations
│   ├── support/              # Hooks, configuration, world setup
│   ├── abilities/            # Serenity abilities (what actors can do)
│   ├── tasks/                # Serenity tasks (actor actions)
│   ├── questions/            # Serenity questions (assertions/reads)
│   ├── contexts/             # Test context setup
│   │   ├── listing/          # Listing context (abilities, tasks, sessions)
│   │   └── reservation-request/
│   └── features/             # Gherkin feature files (.feature)
└── test:* scripts run scenarios
```

**Key Patterns**:
- **Abilities**: Actor capabilities registered in Cast
- **Tasks**: Actions the actor takes (calls domain/API)
- **Questions**: Assertions and state reads
- **Actors**: Serenity agents (system, guest, user)
- **World**: Per-scenario context with DI container

### Coverage Requirements
- **Target**: 80%+ overall coverage
- **Domain**: 90%+ (business logic critical)
- **Persistence**: 80%+ (data access layer)
- **UI Components**: 70%+ (visual testing separate)

## 🏛️ Architectural Decisions

Key ADRs document critical decisions:
- **0002-open-telemetry.md**: Observability strategy
- **0003-domain-driven-design.md**: DDD patterns and bounded contexts
- **0007-serenityjs.md**: BDD acceptance testing framework
- **0011-bicep.md**: Infrastructure as Code approach
- **0012-linter.md**: Biome for linting and formatting
- **0013-test-suite.md**: Multi-level testing strategy

Located in: `apps/docs/docs/decisions/`

## 📋 Quality Standards

### Pre-Commit
- **Linting**: Biome (auto-format on save recommended)
- **Type Checking**: `tsc --build`
- **Tests**: Relevant test suite must pass

### Pull Request Checks
- ✅ `pnpm run build` succeeds
- ✅ `pnpm run test` passes (coverage maintained)
- ✅ `pnpm run lint` passes
- ✅ No TypeScript errors in affected packages
- ✅ Acceptance tests pass (if domain changes)
- ✅ ADR updated (if architectural change)

### Reviewer Checks (Code Review)
- Domain invariants upheld
- No infrastructure leakage into domain layer
- Proper file naming and barrel exports
- Adequate test coverage with meaningful assertions
- No unexplained new dependencies
- Business language used in domain code
- Serenity pattern compliance (if acceptance tests)

### Turbo Cache
- Outputs cached in `.turbo/` directory
- Cache invalidated on source or config changes
- `turbo run build --no-cache` to skip

## 🚀 Common Tasks

### Adding a New Domain Context

1. **Create context structure** in `packages/sthrift/domain/src/domain/contexts/{context-name}/`
2. **Define aggregate root** with factory method
3. **Define value objects** for domain concepts
4. **Create repository interface** (abstraction)
5. **Implement UnitOfWork** for consistency coordination
6. **Define permissions** (`{entity}.{role}.passport.ts`)
7. **Create acceptance tests** in `acceptance-tests/src/contexts/{context-name}/`
8. **Add to Cast** in acceptance test world setup
9. **Implement GraphQL resolver** in `packages/sthrift/graphql/`
10. **Implement MongoDB adapter** in `packages/sthrift/persistence/`

### Adding a New GraphQL Mutation

1. **Define in domain** first (aggregate method, domain event if needed)
2. **Create resolver** in `packages/sthrift/graphql/src/schema/{context}/`
3. **Add to schema** in `.graphql` files
4. **Write acceptance test** (gherkin + step definition)
5. **Implement domain persistence** in MongoDB adapter
6. **Add type safety** with generated TypeScript types (GraphQL codegen)

### Adding a New Acceptance Test

1. **Write feature file** (Gherkin) in `acceptance-tests/src/features/`
2. **Implement step definitions** in `acceptance-tests/src/step-definitions/`
3. **Create abilities/tasks** if needed
4. **Set up world context** in hooks
5. **Run tests**: `pnpm run test:acceptance:domain` (or appropriate level)

### Running Acceptance Tests

```bash
# All tests across all 5-tier matrix
pnpm run test:acceptance:all

# Specific level + backend
pnpm run test:acceptance:domain          # Pure domain
pnpm run test:acceptance:session:graphql # Session + GraphQL
pnpm run test:acceptance:dom:graphql     # DOM + GraphQL
```

## 🎯 Key Principles

### Simplicity First
- Avoid premature generalization
- Keep functions small and intention-revealing
- Use clear, business-aligned names
- Only add what's needed for the current task

### Domain-Driven
- Explicit domain terminology > generic names
- Domain logic lives in aggregates, not in services
- Infrastructure concerns stay in adapters
- Business invariants enforced in domain layer

### Testability
- Design for testing (dependency injection via DI container)
- Test behavior, not implementation
- Use meaningful test names that describe the scenario
- Acceptance tests verify business capabilities

### No Over-Engineering
- Don't create abstractions for hypothetical scenarios
- One-time operations don't need utilities
- Three similar lines of code is fine; premature abstraction is worse
- Match complexity to actual requirements

## 📚 Documentation

- **README.md**: Project overview and setup
- **CONTRIBUTING.md**: Contribution guidelines, DDD conventions
- **TURBOREPO.md**: Monorepo build optimization details
- **apps/docs/**: Docusaurus site with technical decisions and guides
- **CLAUDE.md**: This file (codebase context for AI assistants)

## 🔗 Important Files

- `package.json` (root): Workspace scripts and versions
- `turbo.json`: Turborepo task configuration
- `tsconfig.base.json`: Base TypeScript configuration
- `biome.json`: Linter and formatter configuration
- `sonar-project.properties`: SonarCloud analysis config
- `mise.toml`: Tool version management (Node.js v22.20.0, Python 3.13)
- `pnpm-workspace.yaml`: Workspace root declaration
- `.sourcery.yaml`: Sourcery review configuration

## 🤝 Collaboration Notes

- **Branch naming**: `feature/task-name`, `fix/bug-name`, `docs/topic`
- **Commit messages**: Clear, descriptive, reference issues if applicable
- **PR descriptions**: Problem statement, solution summary, affected domains
- **Task/PR alignment**: Keep task state synchronized with PR status (Draft ↔ In Progress, Ready ↔ In Review)
- **Reviews**: Prompt feedback expected; explain trade-offs when declining suggestions
