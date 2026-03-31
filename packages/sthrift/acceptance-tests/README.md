# ShareThrift Acceptance Tests

Cucumber Screenplay pattern acceptance tests for the ShareThrift domain, implementing a multi-level testing strategy.

## Architecture

This package implements the **Cucumber Screenplay Pattern** following **industry best practices** from Aslak Hellesøy's assembly approach:

### Test Levels

| Level | What It Tests | Speed | Stack |
|-------|---------------|-------|-------|
| **Domain** | Pure business logic | ⚡ Milliseconds | In-memory aggregates |
| **Session** | API contracts (GraphQL/MongoDB) | 🏃 Sub-second | Apollo TestServer + MongoMemoryServer |
| **E2E** | Full user experience | 🐢 Seconds | Playwright → Vite UI → GraphQL → MongoDB |

### Key Concept: Cumulative Assemblies

**Each assembly includes the layers below it**. The same `.feature` files execute through different system assemblies:

```
Domain Assembly:     [Domain]
Session Assembly:    [GraphQL/MongoDB] → [Domain]
E2E Assembly:        [Playwright] → [Vite UI] → [GraphQL] → [MongoDB] → [Domain]
```

This allows you to:
- Get fast feedback during development (Domain assembly)
- Test API contracts without UI (Session assembly)
- Verify full user experience through a real browser (E2E assembly)
- Build features incrementally, adding layers as you go
- Use faster layers for test setup even in slower assemblies

## Project Structure

```
acceptance-tests/
├── features/                    # Gherkin scenarios (written once)
│   ├── listing/
│   │   ├── create-listing.feature
│   │   └── search-listings.feature
│   └── reservation/
│       └── book-listing.feature
├── src/
│   ├── abilities/              # Actor capabilities (shared across levels)
│   │   ├── BrowseTheWeb.ts     # Playwright Page wrapper (E2E)
│   │   └── CallAnApi.ts
│   ├── questions/              # Assertions/queries (shared across levels)
│   │   ├── ListingStatus.ts
│   │   └── ReservationDetails.ts
│   ├── tasks/                  # Level-specific implementations
│   │   ├── domain/            # Direct domain calls
│   │   │   ├── CreateListing.ts
│   │   │   └── SearchListings.ts
│   │   ├── session/           # GraphQL mutations/queries
│   │   │   ├── CreateListing.ts
│   │   │   └── SearchListings.ts
│   │   └── e2e/               # Playwright browser interactions
│   │       ├── CreateListing.ts
│   │       └── SearchListings.ts
│   ├── step-definitions/       # Map Gherkin to tasks (shared)
│   │   ├── listing.steps.ts
│   │   └── reservation.steps.ts
│   └── support/                # Test infrastructure
│       ├── hooks.ts
│       ├── world.ts
│       └── servers/
│           ├── test-graphql-server.ts
│           ├── test-oauth2-server.ts
│           └── test-vite-server.ts
└── reports/                    # Test results and HTML reports
```

## Running Tests

### Quick Tests (Recommended for Development)

```bash
# Run all acceptance tests
pnpm test

# Or individually:
pnpm test:domain           # Pure business logic (milliseconds)
pnpm test:session:graphql  # Session + GraphQL backend (sub-second)
```

### E2E Tests (Full Stack Verification)

```bash
# Full end-to-end with Playwright browser
pnpm test:e2e
```

E2E tests start the following infrastructure automatically:
- **MongoMemoryServer** for persistence
- **Apollo TestServer** for GraphQL
- **Mock OAuth2 server** for authentication (auto-approves, issues real JWTs)
- **Vite dev server** serving the UI application
- **Chromium browser** via Playwright

### Development Workflow

```bash
# During development: run fast tests constantly
pnpm test:domain

# Run specific feature with domain tasks (fastest)
cucumber-js features/listing/create-listing.feature --world-parameters '{"tasks":"domain"}'

# Run with session tasks (GraphQL)
cucumber-js features/listing/create-listing.feature --world-parameters '{"tasks":"session","session":"graphql"}'

# Run with E2E tasks (full browser)
cucumber-js features/listing/create-listing.feature --world-parameters '{"tasks":"e2e"}'

# Run with specific tag
cucumber-js --tags @wip --world-parameters '{"tasks":"domain"}'
```

## Writing Tests

### 1. Write Gherkin Scenario (Once)

**features/listing/create-listing.feature**
```gherkin
Feature: Create Listing

  Scenario: User creates a draft listing
    Given Alice is authenticated
    When she creates a listing with:
      | title       | Vintage Camera     |
      | description | Great condition    |
      | category    | Electronics        |
      | location    | Seattle, WA        |
    Then the listing should be in draft status
```

### 2. Create Step Definitions (Once)

**src/step-definitions/listing.steps.ts**
```typescript
import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { Actor } from '@serenity-js/core';
import { Ensure, equals } from '@serenity-js/assertions';
import { CreateListing } from '../tasks';
import { ListingStatus } from '../questions';

Given('{actor} is authenticated', async (actor: Actor) => {
  // Setup authentication
});

When('{actor} creates a listing with:', async (actor: Actor, data: DataTable) => {
  const details = data.rowsHash();
  await actor.attemptsTo(
    CreateListing.with(details)
  );
});

Then('the listing should be in draft status', async (actor: Actor) => {
  await actor.attemptsTo(
    Ensure.that(ListingStatus.of(actor), equals('draft'))
  );
});
```

### 3. Implement Tasks (Per Level)

**src/tasks/domain/CreateListing.ts** (Fast - direct domain calls)
```typescript
import { Task, Actor } from '@serenity-js/core';
import { CreateListingAbility } from '../../abilities';

export class CreateListing implements Task {
  static with(details: ListingDetails) {
    return new CreateListing(details);
  }

  constructor(private details: ListingDetails) {}

  async performAs(actor: Actor): Promise<void> {
    const ability = CreateListingAbility.as(actor);
    ability.createDraftListing(this.details);
  }

  toString = () => `creates a listing`;
}
```

**src/tasks/session/CreateListing.ts** (Medium - GraphQL mutations)
```typescript
import { Task, Actor } from '@serenity-js/core';
import { CallAnApi } from '../../abilities';
import { CREATE_LISTING_MUTATION } from '@sthrift/graphql';

export class CreateListing implements Task {
  static with(details: ListingDetails) {
    return new CreateListing(details);
  }

  constructor(private details: ListingDetails) {}

  async performAs(actor: Actor): Promise<void> {
    const api = CallAnApi.as(actor);
    await api.mutate({
      mutation: CREATE_LISTING_MUTATION,
      variables: this.details
    });
  }

  toString = () => `creates a listing via GraphQL`;
}
```

**src/tasks/e2e/CreateListing.ts** (Full - Playwright browser interactions)
```typescript
import { Task, Actor } from '@serenity-js/core';
import { BrowseTheWeb } from '../../abilities';

export class CreateListing implements Task {
  static with(details: ListingDetails) {
    return new CreateListing(details);
  }

  constructor(private details: ListingDetails) {}

  async performAs(actor: Actor): Promise<void> {
    const { page } = BrowseTheWeb.as(actor);
    await page.goto('/create-listing');
    await page.getByPlaceholder('Title').fill(this.details.title);
    await page.getByPlaceholder('Description').fill(this.details.description);
    // ... fill remaining fields
    await page.getByRole('button', { name: 'Publish Listing' }).click();
  }

  toString = () => `creates a listing via UI`;
}
```

## How Level Switching Works

The **World** in `src/support/world.ts` dynamically selects tasks based on the `--world-parameters` flag:

```typescript
type TaskLevel = 'domain' | 'session' | 'e2e';

// Step definitions switch on the task level:
function getCreateListingTask(taskLevel: TaskLevel) {
  switch (taskLevel) {
    case 'domain': return DomainCreateListing;
    case 'session': return SessionCreateListing;
    case 'e2e': return E2eCreateListing;
  }
}
```

For E2E tests, the World automatically:
1. Starts MongoMemoryServer + GraphQL server
2. Starts a mock OAuth2 server (auto-approves auth, issues real JWTs)
3. Starts a Vite dev server serving the UI
4. Launches a Chromium browser via Playwright
5. Creates a fresh browser context + page per scenario
6. Gives each actor the `BrowseTheWeb` ability

## Benefits

### Code Reuse (Aslak's Screenplay Pattern)
- ✅ Gherkin scenarios: Written once, describe **WHAT** users do
- ✅ Step definitions: Written once, map to tasks
- ✅ Questions: Written once, verify outcomes
- ✅ Abilities: Written once, actor capabilities
- 🔄 Tasks: **Three implementations** (domain, session, e2e)
  - All implement the same interface
  - Swappable via `--world-parameters '{"tasks":"..."}'`

### Speed vs Coverage (Following Aslak's Assembly Approach)
- **Domain**: Pure business logic, milliseconds, run constantly
- **Session**: GraphQL/MongoDB integration, sub-second, run on every commit
- **E2E**: Real browser + full stack, seconds, run before merge

### Incremental Development
- ✅ Build features **domain-first** (fastest feedback)
- ✅ Add session tasks when API stabilizes
- ✅ Add E2E tasks for critical user journeys
- ✅ Same `.feature` files work across all assemblies

### Debugging
- Domain tests fail → Business logic bug
- Session tests fail → API contract / persistence bug
- E2E tests fail → UI/UX or integration bug

## Migration Path

1. **Week 1-2**: Implement domain tests for core workflows (Create Listing, Book Reservation)
2. **Week 3-4**: Add session (GraphQL/MongoDB) layer tests
3. **Week 5-6**: Implement E2E tests for critical user paths via Playwright
4. **Week 7-8**: Expand E2E coverage to additional user journeys

## CI/CD Integration

```yaml
# azure-pipelines.yml

# Fast tests: Run on every commit (milliseconds)
- task: Npm@1
  displayName: 'Run Fast Tests (Domain + Session)'
  inputs:
    command: custom
    customCommand: 'run test --filter @sthrift/acceptance-tests'

# E2E tests: Run on PRs and main branch (full browser stack)
- task: Npm@1
  displayName: 'Run E2E Tests (Playwright)'
  inputs:
    command: custom
    customCommand: 'run test:e2e --filter @sthrift/acceptance-tests'
  condition: or(eq(variables['Build.Reason'], 'PullRequest'), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  timeoutInMinutes: 10
```

**Strategy**:
- ✅ Every commit: Domain + Session tests (sub-second)
- ✅ Pull Requests: Add E2E tests (full stack verification via Playwright)
- ✅ Main branch: Complete suite with reporting

## References

- [Cucumber Screenplay Pattern](https://github.com/cucumber/screenplay.js/) - Aslak Hellesøy's reference implementation
- [Serenity/JS Documentation](https://serenity-js.org/)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Screenplay Pattern](https://serenity-js.org/handbook/design/screenplay-pattern/)
- [Aslak's Assembly Diagrams](https://github.com/subsecondtdd/assembly-diagrams) - Visual explanation of the pattern

## Key Insights from Aslak Hellesøy

### The Session Pattern

From Aslak's design recommendations:

> "When you're working with `@cucumber/screenplay` and testing against multiple layers, we recommend you use only **two task implementations**:
> - `dom` for tasks that use the DOM
> - `session` for tasks that use a `Session`"

We extend this with three levels: **domain** (direct aggregate calls), **session** (GraphQL/MongoDB), and **e2e** (Playwright browser).

### Our Assembly Configuration

| Assembly | Tasks | Backend | Speed |
|----------|-------|---------|-------|
| Domain | domain | In-memory aggregates | ⚡ Milliseconds |
| Session (GraphQL) | session | Apollo TestServer | 🏃 Sub-second |
| Session (MongoDB) | session | MongoMemoryServer | 🏃 Sub-second |
| **E2E** | **e2e** | **Playwright → Vite → GraphQL → MongoDB** | **🐢 Seconds** |

### Force Better Scenarios

The constraint of supporting both `session` and `dom` tasks **forces you to write better scenarios**:

❌ **Bad** (UI-specific): "Fill in the title field and click submit button"
✅ **Good** (user-centric): "Create a listing with title 'Vintage Camera'"

The good scenario works with both session (API) and dom (browser) tasks!
