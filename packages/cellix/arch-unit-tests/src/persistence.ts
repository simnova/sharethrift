// Persistence-specific checks and test suites
export {
	checkPersistenceRepositoryConventions,
	checkPersistenceDomainAdapterConventions,
	checkPersistenceUnitOfWorkConventions,
	checkPersistenceReadonlyDataConventions,
	checkPersistenceDependencyBoundaries,
	checkPersistenceAbstractionDependencies,
	type PersistenceConventionsConfig,
} from './checks/persistence-conventions.js';

export {
	describePersistenceConventionTests,
	type PersistenceConventionTestsConfig,
} from './test-suites/persistence-conventions.js';
