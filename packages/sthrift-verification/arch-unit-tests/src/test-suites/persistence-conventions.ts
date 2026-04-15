import { describe, expect, it } from 'vitest';
import { checkShareThriftPersistenceFactoryExports } from '../checks/persistence-conventions.js';

export interface PersistenceConventionTestsConfig
{
	persistenceDomainGlob: string;
	persistenceReadonlyGlob: string;
	persistenceAllGlob: string;
}

export function describePersistenceConventionTests(
	config: PersistenceConventionTestsConfig,
): void {
	describe('ShareThrift Persistence Conventions', () => {
		it('entity indexes must export the expected persistence factories', async () => {
			const violations = await checkShareThriftPersistenceFactoryExports({
				persistenceDomainGlob: config.persistenceDomainGlob,
				persistenceReadonlyGlob: config.persistenceReadonlyGlob,
			});
			expect(violations).toStrictEqual([]);
		}, 30000);
	});
}
