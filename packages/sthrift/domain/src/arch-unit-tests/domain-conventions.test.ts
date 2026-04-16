import {
	describeDomainConventionTests,
	type DomainConventionTestsConfig,
} from '@cellix/arch-unit-tests/domain';

import {
	describeDomainConventionTests as describeShareThriftDomainConventionTests,
	type DomainConventionTestsConfig as ShareThriftDomainConventionTestsConfig,
} from '@sthrift-verification/arch-unit-tests/domain';

const cellixConfig: DomainConventionTestsConfig = {
	domainContextsGlob: '../domain/src/domain/contexts/**',
};

const shareThriftConfig: ShareThriftDomainConventionTestsConfig = {
	domainContextsGlob: '../domain/src/domain/contexts/**',
};

describeDomainConventionTests(cellixConfig);
describeShareThriftDomainConventionTests(shareThriftConfig);
