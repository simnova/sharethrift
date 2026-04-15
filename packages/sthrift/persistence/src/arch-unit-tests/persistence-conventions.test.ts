import {
	describePersistenceConventionTests,
	type PersistenceConventionTestsConfig,
} from '@cellix/arch-unit-tests/persistence';

import {
	describePersistenceConventionTests as describeShareThriftPersistenceConventionTests,
	type PersistenceConventionTestsConfig as ShareThriftPersistenceConventionTestsConfig,
} from '@sthrift-verification/arch-unit-tests/persistence';

const cellixConfig: PersistenceConventionTestsConfig = {
	persistenceDomainGlob: '../persistence/src/datasources/domain/**',
	persistenceReadonlyGlob: '../persistence/src/datasources/readonly/**',
	persistenceAllGlob: '../persistence/src/**',
};

const shareThriftConfig: ShareThriftPersistenceConventionTestsConfig = {
	persistenceDomainGlob: '../persistence/src/datasources/domain/**',
	persistenceReadonlyGlob: '../persistence/src/datasources/readonly/**',
	persistenceAllGlob: '../persistence/src/**',
};

describePersistenceConventionTests(cellixConfig);
describeShareThriftPersistenceConventionTests(shareThriftConfig);
