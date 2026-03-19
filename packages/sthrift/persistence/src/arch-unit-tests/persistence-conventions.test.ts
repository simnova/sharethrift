import {
	describePersistenceConventionTests,
	type PersistenceConventionTestsConfig,
} from '@cellix/arch-unit-tests/persistence';

const config: PersistenceConventionTestsConfig = {
	persistenceDomainGlob: '../persistence/src/datasources/domain/**',
	persistenceReadonlyGlob: '../persistence/src/datasources/readonly/**',
	persistenceAllGlob: '../persistence/src/**',
};

describePersistenceConventionTests(config);
