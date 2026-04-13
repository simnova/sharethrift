import {
	describeFrontendArchitectureTests,
	type FrontendArchitectureTestsConfig,
} from '@cellix/arch-unit-tests/frontend';

const config: FrontendArchitectureTestsConfig = {
	uiSourcePath: './src',
	testName: 'UI Admin Route Root',
};

describeFrontendArchitectureTests(config);
