import { describeDependencyRulesTests } from './index';

describeDependencyRulesTests({
  packagesGlob: '../{cellix}/**',
  uiCoreFolder: '../cellix/ui-core',
  uiComponentsFolder: '../sthrift/ui-components',
  appUiFolder: '../../apps/ui-sharethrift',
});
