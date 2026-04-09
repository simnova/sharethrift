import { describeDependencyRulesTests } from './index';

describeDependencyRulesTests({
  packagesGlob: '../{cellix}/**',
  uiCoreFolder: '../cellix/ui-core',
  uiComponentsFolder: '../sthrift/ui-shared',
  appUiFolder: '../../apps/ui-sharethrift',
});
