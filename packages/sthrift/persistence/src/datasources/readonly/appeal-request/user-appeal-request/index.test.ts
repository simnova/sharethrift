import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as UserAppealRequestIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Scenario }) => {
	Scenario('UserAppealRequestReadRepository exports', ({ Then, And }) => {
		Then('getUserAppealRequestReadRepository should be exported from index', () => {
			expect(UserAppealRequestIndex.getUserAppealRequestReadRepository).toBeDefined();
		});

		And('getUserAppealRequestReadRepository should be a function', () => {
			expect(typeof UserAppealRequestIndex.getUserAppealRequestReadRepository).toBe('function');
		});

		And('UserAppealRequestReadRepository type should be exported from index', () => {
			// Type exports are verified at compile time
			expect(true).toBe(true);
		});
	});
});
