import { describeFrontendArchitectureTests, type FrontendArchitectureTestsConfig } from '@cellix/arch-unit-tests';

const config: FrontendArchitectureTestsConfig = {
  uiSourcePath: '../../../apps/ui-sharethrift/src',
  testName: 'UI ShareThrift',
};

describeFrontendArchitectureTests(config);
