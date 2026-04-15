import { describe, expect, it } from 'vitest';
import { checkShareThriftContainerGraphqlPairing } from '../checks/frontend-architecture.js';

export interface NamingConventionsConfig {
	uiSourcePath?: string;
}

export function describeNamingConventionTests(
	config?: NamingConventionsConfig,
): void {
	describe('ShareThrift Naming Conventions', () => {
		it('container graphql files must have sibling container components', async () => {
			const violations = await checkShareThriftContainerGraphqlPairing(config);
			expect(violations).toStrictEqual([]);
		}, 30000);
	});
}
