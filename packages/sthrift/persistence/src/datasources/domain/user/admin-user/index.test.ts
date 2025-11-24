import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as AdminUserIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Scenario }) => {
	Scenario('Exports from admin user entity index', ({ Then, And }) => {
		Then('the AdminUserPersistence function should be exported', () => {
			expect(AdminUserIndex.AdminUserPersistence).toBeDefined();
		});

		And('AdminUserPersistence should be a function', () => {
			expect(typeof AdminUserIndex.AdminUserPersistence).toBe('function');
		});
	});
});
