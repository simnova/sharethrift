import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as AdminUserIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Scenario }) => {
	Scenario('Exports from admin user readonly index', ({ Then, And }) => {
		Then('the getAdminUserReadRepository function should be exported', () => {
			expect(AdminUserIndex.AdminUserReadRepositoryImpl).toBeDefined();
		});

		And('getAdminUserReadRepository should be a function', () => {
			expect(typeof AdminUserIndex.AdminUserReadRepositoryImpl).toBe('function');
		});
	});
});
