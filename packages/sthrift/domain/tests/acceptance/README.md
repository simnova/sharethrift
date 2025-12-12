# Serenity BDD Acceptance Tests

This directory contains BDD-style acceptance tests using Serenity-JS and Cucumber.

## Running Tests

### Run All Serenity Tests
```bash
npm run test:serenity
```

This will:
- Execute all Cucumber scenarios
- Generate Cucumber JSON and HTML reports in `test-results/`
- Display scenario execution in the console

### Generate Serenity HTML Reports
```bash
npm run test:serenity:report
```

This command:
- Processes the Cucumber JSON report
- Generates comprehensive Serenity BDD HTML reports
- Outputs reports to `test-results/serenity-html/`
- Creates an `index.html` with test results dashboard

### Complete Flow
```bash
npm run test:serenity && npm run test:serenity:report
```

## Report Outputs

### Cucumber Reports (`test-results/`)
- `cucumber-report.json` - Machine-readable test results
- `cucumber-report.html` - Basic HTML test report

### Serenity HTML Reports (`test-results/serenity-html/`)
- `index.html` - Main dashboard with test results and metrics
- `capabilities.html` - Test coverage by feature
- `build-info.html` - Build and environment information
- Various assets (CSS, JS, icons)

## CI/CD Integration

For CI/CD pipelines, run both commands in sequence:

```yaml
- script: npm run test:serenity
  displayName: 'Run Serenity BDD Tests'
  
- script: npm run test:serenity:report
  displayName: 'Generate Serenity HTML Reports'
  
- task: PublishTestResults@2
  inputs:
    testResultsFormat: 'JUnit'
    testResultsFiles: 'test-results/cucumber-report.json'
    
- task: PublishPipelineArtifact@1
  inputs:
    targetPath: 'test-results/serenity-html'
    artifact: 'serenity-reports'
```

## Future: Docusaurus Integration

The Serenity HTML reports in `test-results/serenity-html/` are being prepared for eventual integration with the Docusaurus documentation site. This will allow stakeholders to view living documentation of test scenarios directly from the docs site.

## Directory Structure

```
tests/acceptance/
├── features/          # Gherkin feature files
├── step-definitions/  # Step definition implementations
├── screenplay/        # Serenity screenplay pattern (abilities, tasks)
└── support/          # Test configuration and hooks
    └── serenity.config.ts  # Serenity-JS configuration
```

## Tech Stack

- **Cucumber-JS** 11.3.0 - BDD test runner
- **Serenity-JS** 3.32.3 - Enhanced reporting and screenplay pattern
- **Serenity BDD CLI** 3.35.2 - HTML report generation
- **@amiceli/vitest-cucumber** - Inline BDD test support

## Notes

- The Serenity BDD CLI may show warnings about requirements loading - these can be safely ignored
- Reports are generated from Cucumber JSON, not Serenity-JS internal events
- All test artifacts in `test-results/` are gitignored
