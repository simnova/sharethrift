# ShareThrift Acceptance Tests

Cucumber Screenplay pattern acceptance tests for the ShareThrift domain, implementing multi-level testing strategy.

## Architecture

This package implements the **Cucumber Screenplay Pattern** following **industry best practices** from Facebook, Google, and Aslak Hellesøy:

### Industry Standard Approach (Facebook/Google)

We use **two test levels** that align with **React Testing Library** philosophy:

| Level | What It Tests | Speed | Industry Equivalent |
|-------|---------------|-------|---------------------|
| **Domain** | Pure business logic | ⚡ Milliseconds | Unit tests |
| **Session** | API contracts (mocked) | 🏃 Sub-second | Component/Integration tests |

**Key Insight**: Industry leaders (Facebook, Google, Netflix) use **component testing**, NOT full browser E2E for most UI tests.

### Why No E2E/DOM Tests?

Following **Kent C. Dodds** (React Testing Library creator):

> "The more your tests resemble the way your software is used, the more confidence they can give you."

**But also**:

❌ **Full E2E with browser** (Playwright/Cypress) = Slow, flaky, expensive
✅ **Component tests** (React Testing Library) = Fast, reliable, maintainable
✅ **Session/API tests** (Our approach) = Even faster, no DOM needed

For UI testing, use React Testing Library in the UI package, not Screenplay E2E tests.

### Key Concept: Cumulative Assemblies

**Each assembly includes the layers below it**. The same `.feature` files execute through different system assemblies:

```
Domain Assembly:     [Domain]
GraphQL Assembly:    [GraphQL] → [Domain]
DOM Assembly:        [DOM] → [GraphQL] → [Domain]
```

This allows you to:
- Get fast feedback during development (Domain assembly)
- Test API contracts without UI (GraphQL assembly)  
- Verify full user experience (DOM assembly)
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
│   │   ├── CreateListingAbility.ts
│   │   ├── BrowseTheWeb.ts
│   │   └── CallAnApi.ts
│   ├── questions/              # Assertions/queries (shared across levels)
│   │   ├── ListingStatus.ts
│   │   └── ReservationDetails.ts
│   ├── tasks/                  # Level-specific implementations
│   │   ├── domain/            # Direct domain calls
│   │   │   ├── CreateListing.ts
│   │   │   └── SearchListings.ts
│   │   ├── graphql/           # GraphQL mutations/queries
│   │   │   ├── CreateListing.ts
│   │   │   └── SearchListings.ts
│   │   └── dom/               # Browser interactions
│   │       ├── CreateListing.ts
│   │       └── SearchListings.ts
│   ├── step-definitions/       # Map Gherkin to tasks (shared)
│   │   ├── listing.steps.ts
│   │   └── reservation.steps.ts
│   └── support/                # Test infrastructure
│       ├── serenity.config.ts
│       └── world.ts
└── reports/                    # Test results and HTML reports
```

## Running Tests

### Fast Tests (Recommended - Industry Standard)

```bash
# Run all acceptance tests (domain + session)
pnpm test          # ~0.6 seconds total

# Or individually:
pnpm test:domain   # Pure business logic (0.3s)
pnpm test:session  # API contracts with mocked backend (0.3s)
```

**These are the ONLY tests you need for acceptance testing!** ✅

### UI Component Tests (Use React Testing Library Instead)

For UI testing, follow industry standards:

```bash
# In the UI package (not here):
cd apps/ui-sharethrift
pnpm test  # Uses React Testing Library
```

**Why?**
- ✅ Industry standard (Facebook, Google, Airbnb all use this)
- ✅ Fast (milliseconds per test)
- ✅ No browser overhead
- ✅ Tests components like users interact with them
- ✅ Maintained by Kent C. Dodds & team

**Why NOT full E2E here?**
- ❌ Slow (seconds per test)
- ❌ Flaky (browser issues, timing problems)
- ❌ Expensive (requires infrastructure)
- ❌ Not what industry leaders do for most tests

### When To Use E2E

Only for **critical user flows** in CI/CD (outside this package):
- Login flow
- Checkout/payment
- Core business transactions

Use tools like **Playwright** or **Cypress** sparingly, in a separate E2E test suite.

### Development Workflow

```bash
# During development: run fast tests constantly
pnpm test:fast

# Run specific feature with domain tasks (fastest)
cucumber-js features/listing/create-listing.feature --world-parameters '{"tasks":"domain"}'

# Run with session tasks (mocked GraphQL)
cucumber-js features/listing/create-listing.feature --world-parameters '{"tasks":"graphql"}'

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

### 3. Implement Tasks (Three Times - One Per Level)

**src/tasks/domain/CreateListing.ts** (Fast)
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

**src/tasks/graphql/CreateListing.ts** (Medium)
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

**src/tasks/dom/CreateListing.ts** (Slow)
```typescript
import { Task, Actor } from '@serenity-js/core';
import { BrowseTheWeb } from '../../abilities';
import { Click, Fill, Press } from '@serenity-js/web';

export class CreateListing implements Task {
  static with(details: ListingDetails) {
    return new CreateListing(details);
  }

  constructor(private details: ListingDetails) {}

  async performAs(actor: Actor): Promise<void> {
    await actor.attemptsTo(
      Click.on('#create-listing-button'),
      Fill.in('#title', this.details.title),
      Fill.in('#description', this.details.description),
      Fill.in('#category', this.details.category),
      Fill.in('#location', this.details.location),
      Press.submit()
    );
  }

  toString = () => `creates a listing via UI`;
}
```

## How Level Switching Works

The **ActorWorld** in `src/support/world.ts` dynamically loads tasks based on the `--world-parameters` flag:

```typescript
export class ActorWorld extends SerenityWorld {
  private tasksLevel: 'domain' | 'graphql' | 'dom';

  constructor(options: IWorldOptions<WorldParameters>) {
    super(options);
    this.tasksLevel = options.parameters?.tasks || 'domain';
  }

  async loadTask(taskName: string) {
    // Dynamically import from correct directory
    const module = await import(`../tasks/${this.tasksLevel}/${taskName}.ts`);
    return module[taskName];
  }
}
```

## Benefits

### Code Reuse (Aslak's Screenplay Pattern)
- ✅ Gherkin scenarios: Written once, describe **WHAT** users do
- ✅ Step definitions: Written once, map to tasks
- ✅ Questions: Written once, verify outcomes
- ✅ Abilities: Written once, actor capabilities
- 🔄 Tasks: **Two implementations** (session vs dom)
  - Both implement same interface
  - Swappable via `--world-parameters '{"tasks":"..."}'`

### Speed vs Coverage (Following Aslak's Assembly Approach)
- **Domain**: Pure business logic, milliseconds, run constantly
- **Session**: Mocked API layer, sub-second, run on every commit
- **DOM**: Real browser + UI, seconds, run before merge or nightly

### Incremental Development
- ✅ Build features **domain-first** (fastest feedback)
- ✅ Add session/GraphQL tasks when API stabilizes
- ✅ Add DOM tasks only for critical user journeys
- ✅ Same `.feature` files work across all assemblies

### Debugging
- Domain tests fail → Business logic bug
- GraphQL tests fail → API contract bug
- DOM tests fail → UI/UX bug

## Migration Path

1. **Week 1-2**: Implement domain tests for core workflows (Create Listing, Book Reservation)
2. **Week 3-4**: Add GraphQL layer tests
3. **Week 5-6**: Implement DOM tests for critical paths
4. **Week 7-8**: Gradually replace Storybook tests with Screenplay tests

## CI/CD Integration

```yaml
# azure-pipelines.yml

# Fast tests: Run on every commit (milliseconds)
- task: Npm@1
  displayName: 'Run Fast Tests (Domain + Session)'
  inputs:
    command: custom
    customCommand: 'run test:fast --filter @sharethrift/acceptance-tests'

# DOM tests: Run on PRs and main branch (requires UI app running)
- task: Npm@1
  displayName: 'Start UI Application'
  inputs:
    command: custom
    customCommand: 'run dev --filter @sharethrift/ui-sharethrift'
  condition: or(eq(variables['Build.Reason'], 'PullRequest'), eq(variables['Build.SourceBranch'], 'refs/heads/main'))

- task: Npm@1
  displayName: 'Run DOM Tests (Full E2E)'
  inputs:
    command: custom
    customCommand: 'run test:dom --filter @sharethrift/acceptance-tests'
  condition: or(eq(variables['Build.Reason'], 'PullRequest'), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  timeoutInMinutes: 10
```

**Strategy**:
- ✅ Every commit: Domain + Session tests (sub-second)
- ✅ Pull Requests: Add DOM tests (full stack verification)
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

A **Session** represents a user having an interactive session with your system. Your **production UI code** should use the same Session interface, preventing network implementation details from bleeding into UI code.

**Two Session implementations:**
- **HttpSession**: Real fetch/WebSocket/HTTP calls (used in production UI and some tests)
- **DomainSession**: Direct function calls to domain layer (used only in tests for speed)

### Why Two Implementations?

This creates **four assembly configurations** (we currently use three):

| Assembly | Tasks | Session | Our Implementation | Speed |
|----------|-------|---------|-------------------|-------|
| Domain | session | DomainSession | `domain/` tasks | ⚡ Milliseconds |
| HTTP-Domain | session | HttpSession | *(future)* | 🏃 Fast |
| DOM-Domain | dom | DomainSession | *(not recommended)* | 🐢 Slow |
| **DOM-HTTP** | **dom** | **HttpSession** | **`dom/` tasks** | **🐌 Slowest (E2E)** |

We simplified by:
- Using **MockGraphQL** as our DomainSession (mocked responses)
- Keeping DOM tests for real E2E only
- Skipping DOM-Domain (component testing) in favor of session tests

### Force Better Scenarios

The constraint of supporting both `session` and `dom` tasks **forces you to write better scenarios**:

❌ **Bad** (UI-specific): "Fill in the title field and click submit button"
✅ **Good** (user-centric): "Create a listing with title 'Vintage Camera'"

The good scenario works with both session (API) and dom (browser) tasks!
