# ShareThrift Acceptance Tests

Cucumber Screenplay pattern acceptance tests for the ShareThrift domain, implementing multi-level testing strategy.

## Architecture

This package implements the **Cucumber Screenplay Pattern** with **three assembly configurations**:

- **Domain**: Domain layer only (fastest - ~100ms per scenario)
- **GraphQL**: GraphQL + Domain layers (medium - ~500ms per scenario)
- **DOM**: DOM + GraphQL + Domain layers (slowest - ~3s per scenario, full stack)

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

### By Level

```bash
# Domain layer (fastest - no I/O, ~100ms per scenario)
pnpm test:domain

# GraphQL layer (medium - HTTP calls, ~500ms per scenario)
pnpm test:graphql

# DOM layer (slowest - browser automation, ~3s per scenario)
pnpm test:dom
```

### All Levels

```bash
# Run all three levels sequentially
pnpm test:all

# Generate Serenity BDD report
pnpm test:serenity
```

### Development

```bash
# Run specific feature
cucumber-js features/listing/create-listing.feature --world-parameters '{"tasks":"domain"}'

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

### Code Reuse
- ✅ Gherkin scenarios: Written once
- ✅ Step definitions: Written once
- ✅ Questions: Written once
- ✅ Abilities: Written once
- 🔄 Tasks: Three implementations (same interface)

### Speed vs Coverage
- **Domain**: Run on every commit (~5 seconds for 50 scenarios)
- **GraphQL**: Run on PR (~30 seconds)
- **DOM**: Run nightly (~5 minutes)

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
- task: Npm@1
  displayName: 'Run Domain Tests'
  inputs:
    command: custom
    customCommand: 'run test:domain --filter @sthrift/acceptance-tests'

- task: Npm@1
  displayName: 'Run GraphQL Tests'
  inputs:
    command: custom
    customCommand: 'run test:graphql --filter @sthrift/acceptance-tests'
  condition: eq(variables['Build.Reason'], 'PullRequest')

- task: Npm@1
  displayName: 'Run DOM Tests'
  inputs:
    command: custom
    customCommand: 'run test:dom --filter @sthrift/acceptance-tests'
  condition: eq(variables['Build.SourceBranch'], 'refs/heads/main')
```

## References

- [Serenity/JS Documentation](https://serenity-js.org/)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Screenplay Pattern](https://serenity-js.org/handbook/design/screenplay-pattern/)
