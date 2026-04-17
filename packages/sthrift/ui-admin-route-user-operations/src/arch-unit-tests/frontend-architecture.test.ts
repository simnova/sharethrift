import {
	describeFrontendArchitectureTests,
	type FrontendArchitectureTestsConfig,
} from '@cellix/arch-unit-tests/frontend';
import {
	describeFrontendArchitectureTests as describeShareThriftFrontendArchitectureTests,
	type FrontendArchitectureTestsConfig as ShareThriftFrontendArchitectureTestsConfig,
} from '@sthrift-verification/arch-unit-tests/frontend';

const cellixConfig: FrontendArchitectureTestsConfig = {
	uiSourcePath: './src',
	testName: 'UI Admin Route User Operations',
};

const shareThriftConfig: ShareThriftFrontendArchitectureTestsConfig = {
	uiSourcePath: './src',
	testName: 'UI Admin Route User Operations',
};

describeFrontendArchitectureTests(cellixConfig);
describeShareThriftFrontendArchitectureTests(shareThriftConfig);
