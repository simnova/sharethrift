// Domain-specific checks and test suites
export {
	checkRepositoryConventions,
	checkUnitOfWorkConventions,
	checkAggregateRootConventions,
	checkVisaConventions,
	type DomainConventionsConfig,
} from './checks/domain-conventions.js';

export {
	describeDomainConventionTests,
	type DomainConventionTestsConfig,
} from './test-suites/domain-conventions.js';
