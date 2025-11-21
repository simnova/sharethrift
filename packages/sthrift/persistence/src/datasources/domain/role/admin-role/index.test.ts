import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as AdminRoleIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Scenario }) => {
	Scenario('Exports from admin role index', ({ Then, And }) => {
		Then('the AdminRolePersistence function should be exported', () => {
			expect(AdminRoleIndex.AdminRolePersistence).toBeDefined();
		});

		And('AdminRolePersistence should be a function', () => {
			expect(typeof AdminRoleIndex.AdminRolePersistence).toBe('function');
		});
	});
});
