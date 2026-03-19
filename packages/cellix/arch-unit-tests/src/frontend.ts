// Frontend-specific checks and test suites
export {
	checkFrontendArchitecture,
	type FrontendArchitectureConfig,
} from './checks/frontend-architecture.js';

export {
	describeFrontendArchitectureTests,
	type FrontendArchitectureTestsConfig,
} from './test-suites/frontend-architecture.js';

// Naming conventions (frontend-specific: .container.graphql naming)
export {
	checkGraphqlFileNaming,
	type NamingConventionsConfig,
} from './checks/naming-conventions.js';

export { describeNamingConventionTests } from './test-suites/naming-conventions.js';

// File system utilities used by frontend checks
export { getAllFiles, getDirectories, directoryExists, fileExists, isKebabCase } from './utils/frontend-helpers.js';
