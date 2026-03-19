import { describeDependencyRulesTests, type DependencyRulesTestsConfig } from '@cellix/arch-unit-tests/general';

const config: DependencyRulesTestsConfig = {
  appsGlob: '../../apps/**',
  packagesGlob: '../**',

  domainFolder: '../domain',
  persistenceFolder: '../persistence',
  applicationServicesFolder: '../application-services',
  graphqlFolder: '../graphql',
  restFolder: '../rest',
  infrastructurePattern: '../../cellix/service-*/**',
  restInfrastructurePattern: '../service-*/**',

  uiCoreFolder: '../../cellix/ui-core',
  uiComponentsFolder: '../ui-components',
  appUiFolder: '../../apps/ui-sharethrift',
};

describeDependencyRulesTests(config);
