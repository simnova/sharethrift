import {
	describeApplicationServicesConventionTests,
	type ApplicationServicesConventionTestsConfig,
} from '@cellix/arch-unit-tests/application-services';

import {
	describeApplicationServicesConventionTests as describeShareThriftApplicationServicesConventionTests,
	type ApplicationServicesConventionTestsConfig as ShareThriftApplicationServicesConventionTestsConfig,
} from '@sthrift-verification/arch-unit-tests/application-services';

const cellixConfig: ApplicationServicesConventionTestsConfig = {
	applicationServicesGlob: '../application-services/src/contexts/**',
	applicationServicesAllGlob: '../application-services/src/**',
};

const shareThriftConfig: ShareThriftApplicationServicesConventionTestsConfig = {
	applicationServicesGlob: '../application-services/src/contexts/**',
	applicationServicesAllGlob: '../application-services/src/**',
};

describeApplicationServicesConventionTests(cellixConfig);
describeShareThriftApplicationServicesConventionTests(shareThriftConfig);
