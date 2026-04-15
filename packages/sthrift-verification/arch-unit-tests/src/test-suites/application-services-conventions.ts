import { describe, expect, it } from 'vitest';
import { checkShareThriftApplicationServicesFactoryExports } from '../checks/application-services-conventions.js';

export interface ApplicationServicesConventionTestsConfig
{
	applicationServicesGlob: string;
	applicationServicesAllGlob: string;
}

export function describeApplicationServicesConventionTests(
	config: ApplicationServicesConventionTestsConfig,
): void {
	describe('ShareThrift Application Services Conventions', () => {
		it('entity indexes must export a factory named after the entity folder', async () => {
			const violations = await checkShareThriftApplicationServicesFactoryExports({
				applicationServicesGlob: config.applicationServicesGlob,
			});
			expect(violations).toStrictEqual([]);
		}, 30000);
	});
}
