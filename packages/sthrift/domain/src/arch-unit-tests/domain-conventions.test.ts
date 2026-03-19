import {
	describeDomainConventionTests,
	type DomainConventionTestsConfig,
} from '@cellix/arch-unit-tests/domain';

const config: DomainConventionTestsConfig = {
	domainContextsGlob: '../domain/src/domain/contexts/**',
};

describeDomainConventionTests(config);
