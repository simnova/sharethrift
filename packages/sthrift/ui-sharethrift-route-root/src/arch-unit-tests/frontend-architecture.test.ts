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
	testName: 'UI ShareThrift Route Root',
};

const shareThriftConfig: ShareThriftFrontendArchitectureTestsConfig = {
	uiSourcePath: './src',
	testName: 'UI ShareThrift Route Root',
};

describeFrontendArchitectureTests(cellixConfig);
describeShareThriftFrontendArchitectureTests(shareThriftConfig);
