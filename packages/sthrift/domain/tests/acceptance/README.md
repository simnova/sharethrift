# Acceptance Testing with Cucumber

This directory contains BDD-style acceptance tests using Cucumber.

## Running Tests

```bash
# Run acceptance tests
pnpm run test:serenity

# Open HTML report
pnpm run test:serenity:open
```

## Current Implementation

The tests currently use **standard Cucumber** with:
- Feature files describing user scenarios
- Step definitions implementing test logic
- JSON and HTML reports for test results

## Future Serenity.js Integration

This PR establishes the foundation for acceptance testing. Full Serenity.js Screenplay pattern integration is planned for a future PR, which will include:

- **Actors**: Representing users interacting with the system
- **Abilities**: Capabilities that actors have (e.g., CreateListingAbility, VerifyListingAbility)
- **Tasks**: High-level business actions (e.g., CreateListing, VerifyListingState)
- **Interactions**: Low-level actions that make up tasks
- **Questions**: Queries about the system state
- **Serenity BDD Reports**: Rich HTML reports with timelines and screenshots

### Why Not Now?

The Serenity.js Screenplay pattern requires:
1. Implementing proper actor setup with abilities
2. Converting step definitions to use Serenity APIs (`actorCalled()`, `Task.where()`, `Ensure.that()`)
3. Setting up test infrastructure (MongoDB memory server for domain testing)
4. Wiring up the Serenity.js event system to generate detailed JSON artifacts

This work is better suited for a follow-up PR after the basic acceptance testing framework is validated in CI.

## Test Structure

```
tests/acceptance/
├── features/           # Gherkin feature files
│   └── create-listing.feature
└── step-definitions/   # Step implementation
    └── create-listing.steps.ts
```

## Reports

Test reports are generated in `target/site/serenity/`:
- `cucumber-report.html` - Human-readable HTML report
- `cucumber-report.json` - Machine-readable JSON report

Reports are automatically excluded from linting via the `npm run prebuild` clean step.
