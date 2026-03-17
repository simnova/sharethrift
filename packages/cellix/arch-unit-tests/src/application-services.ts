// Application services-specific checks and test suites
export {
	checkApplicationServicesFactoryPattern,
	checkApplicationServicesDependencyBoundaries,
	checkApplicationServicesIndexComposition,
	checkApplicationServicesTransactionUsage,
	checkApplicationServicesQueryPattern,
	type ApplicationServicesConventionsConfig,
} from './checks/application-services-conventions.js';

export {
	describeApplicationServicesConventionTests,
	type ApplicationServicesConventionTestsConfig,
} from './test-suites/application-services-conventions.js';
