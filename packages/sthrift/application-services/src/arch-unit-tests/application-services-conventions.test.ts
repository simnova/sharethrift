import {
	describeApplicationServicesConventionTests,
	type ApplicationServicesConventionTestsConfig,
} from '@cellix/arch-unit-tests/application-services';

const config: ApplicationServicesConventionTestsConfig = {
	applicationServicesGlob: '../application-services/src/contexts/**',
	applicationServicesAllGlob: '../application-services/src/**',
};

describeApplicationServicesConventionTests(config);
