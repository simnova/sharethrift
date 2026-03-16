import { describeDependencyRulesTests } from '@cellix/arch-unit-tests';

describeDependencyRulesTests({
  // Circular Dependencies
  appsGlob: '../../apps/**',
  packagesGlob: '../**',

  // Layered Architecture
  domainFolder: '../domain',
  persistenceFolder: '../persistence',
  applicationServicesFolder: '../application-services',
  graphqlFolder: '../graphql',
  restFolder: '../rest',
  infrastructurePattern: '../../cellix/service-*/**',
  restInfrastructurePattern: '../service-*/**',

  // UI Isolation
  uiCoreFolder: '../../cellix/ui-core',
  uiComponentsFolder: '../ui-components',
  appUiFolder: '../../apps/ui-sharethrift',
});
