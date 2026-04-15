import { describe, expect, it } from 'vitest';
import { checkShareThriftContainerPlacement } from '../checks/frontend-architecture.js';

export interface FrontendArchitectureTestsConfig
{
	uiSourcePath: string;
	testName?: string;
}

export function describeFrontendArchitectureTests(
	config: FrontendArchitectureTestsConfig,
): void {
	describe(`ShareThrift Frontend Architecture - ${config.testName || 'UI'}`, () => {
		it('container components must live inside components directories', async () => {
			const violations = await checkShareThriftContainerPlacement({
				uiSourcePath: config.uiSourcePath,
			});
			expect(violations).toStrictEqual([]);
		}, 30000);
	});
}
