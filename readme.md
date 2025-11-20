

VSCode Extensions Required:

Azurite - used for storage emulation


Ideas:

VSCode Sorter Plugin
https://marketplace.visualstudio.com/items?itemName=aljazsim.tsco

Decisions:

Use [TSConfig Bases](https://github.com/tsconfig/bases) for TS Configuration


Begin

nvm install v20
nvm install-latest-npm

nvm use v20
npm run clean
npm install
npm run build

Startup:

nvm use v20
npm run start

## Scripts

Available npm scripts for development and CI/CD:

### Development
- `pnpm run dev` - Full local development environment (builds, starts emulators, and runs the app)
- `pnpm run build` - Build all packages in the monorepo
- `pnpm run test` - Run all tests
- `pnpm run lint` - Lint all packages
- `pnpm run format` - Format all code using Biome

### Code Quality & Analysis
- `pnpm run analyze` - Run e18e CLI analysis across all packages to audit configuration and identify non-performant dependencies
  - Checks package.json exports, module types, and dependency performance
  - **Non-blocking** - builds will not fail if issues are reported
  - Issues should be reviewed and resolved by developers as part of ongoing code quality improvements

### Testing
- `pnpm run test:coverage` - Run tests with coverage reporting
- `pnpm run test:coverage:merge` - Run tests and merge coverage reports
- `pnpm run test:integration` - Run integration tests
- `pnpm run test:serenity` - Run Serenity.js acceptance tests
- `pnpm run test:unit` - Run unit tests
- `pnpm run test:watch` - Run tests in watch mode

### Starting Applications
- `pnpm run start:api` - Start the API (Azure Functions)
- `pnpm run start:ui-sharethrift` - Start the UI frontend

### Emulators
- `pnpm run start-emulator:mongo-memory-server` - Start MongoDB in-memory replica set
- `pnpm run start-emulator:auth-server` - Start OAuth2/OIDC mock server
- `pnpm run start-emulator:payment-server` - Start payment mock server
- `pnpm run start-emulator:messaging-server` - Start messaging mock server

### CI/CD
- `pnpm run verify` - Run full CI pipeline locally (test coverage, SonarCloud scan, quality gate)
- `pnpm run sonar` - Run SonarCloud analysis
- `pnpm run sonar:pr` - Run SonarCloud analysis for pull requests



Recipe:

npm i -D concurrently

# Note: These are historical examples - current structure uses apps/ and packages/
# Current apps structure:
# - apps/api/ (Azure Functions API)
# - apps/ui-sharethrift/ (React frontend)  
# - apps/docs/ (Documentation site)

# Historical package examples (now moved to apps/ or reorganized under packages/sthrift/ and packages/cellix/):
# npm init -w ./packages/sthrift/graphql
# npm install @as-integrations/azure-functions @apollo/server graphql @azure/functions -w api-graphql

# npm init -w ./packages/sthrift/event-handler

# npm init -w ./packages/sthrift/api-services
# npm init -w ./packages/sthrift/rest
# npm install @azure/functions -w api-rest

# npm init -w ./packages/sthrift/api-data-sources-domain

# npm init -w ./packages/sthrift/service-otel
# npm install @azure/monitor-opentelemetry -w service-otel

# npm init -w ./packages/sthrift/persistence

# npm init -w ./packages/cellix/event-bus-seedwork-node



npm install --save-dev @tsconfig/node20
npm install --save-dev @tsconfig/node-ts
npm install --save-dev vitest @vitest/coverage-v8

## Your feedback matters!

Do you find Sharethrift useful? [Give it a ⭐ star on GitHub](https://github.com/simnova/sharethrift)!

[![GitHub stars](https://img.shields.io/github/stars/simnova/sharethrift)](https://github.com/simnova/sharethrift)

Found a bug? Need a feature? Raise [an issue](https://github.com/simnova/sharethrift/issues?state=open)
or submit a pull request.

Have feedback? Leave a comment in [ShareThrift discussions on GitHub](https://github.com/simnova/sharethrift/discussions)

## Project Status

[![Build Status](https://dev.azure.com/simnova/ShareThrift/_apis/build/status%2FShareThrift?branchName=refs%2Fpull%2F120%2Fmerge)](https://dev.azure.com/simnova/ShareThrift/_build/latest?definitionId=13&branchName=refs%2Fpull%2F120%2Fmerge)


## Thanks to all our contributors

[![sharethrift contributors](https://contrib.rocks/image?repo=simnova/sharethrift)](https://github.com/simnova/sharethrift/graphs/contributors)

[⬆ Back to Top](#table-of-contents)
