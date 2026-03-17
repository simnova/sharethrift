import { describeDomainConventionTests, type DomainConventionTestsConfig } from '@cellix/arch-unit-tests';

const config: DomainConventionTestsConfig = {
  domainContextsGlob: '../domain/src/domain/contexts/**',
};

describeDomainConventionTests(config);
