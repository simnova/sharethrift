# @sthrift-verification/arch-unit-tests

This package provides ShareThrift-specific architectural enforcements that sit alongside the shared Cellix arch-unit test suites.

Usage

- Import the ShareThrift suites from the matching subpath, next to the Cellix suite you already run. Example:

  import {
    describeApplicationServicesConventionTests as describeShareThriftApplicationServicesConventionTests,
    type ApplicationServicesConventionTestsConfig,
  } from '@sthrift-verification/arch-unit-tests/application-services';

  const config: ApplicationServicesConventionTestsConfig = {
    applicationServicesGlob: '../application-services/src/contexts/**',
    applicationServicesAllGlob: '../application-services/src/**',
  };

  describeShareThriftApplicationServicesConventionTests(config);

How to add new rules

- This package follows the same subpath pattern as `@cellix/arch-unit-tests`. To add ShareThrift-specific enforcements:
  1. Add new helper/check functions in a new module under src (e.g. src/checks/*).
  2. Create a test-suite wrapper (e.g. src/test-suites/*) that composes the Cellix test suites and your new checks.
  3. Export the new check and test suite from the appropriate subpath module.
  4. Update package.json exports if you add new subpaths.

Running the tests

- From the repo root you can run the package tests via pnpm:

  pnpm --filter @sthrift-verification/arch-unit-tests test

CI

- Add a CI job/step to run the package tests if you want them executed standalone. Example:

  - script: pnpm --filter @sthrift-verification/arch-unit-tests test
    displayName: Run ShareThrift arch-unit-tests
