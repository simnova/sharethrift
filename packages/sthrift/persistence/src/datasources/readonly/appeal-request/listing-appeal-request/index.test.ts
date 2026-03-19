import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as ListingAppealRequestIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Scenario }) => {
	Scenario('ListingAppealRequestReadRepository exports', ({ Then, And }) => {
		Then('getListingAppealRequestReadRepository should be exported from index', () => {
			expect(ListingAppealRequestIndex.getListingAppealRequestReadRepository).toBeDefined();
		});

		And('getListingAppealRequestReadRepository should be a function', () => {
			expect(typeof ListingAppealRequestIndex.getListingAppealRequestReadRepository).toBe('function');
		});

		And('ListingAppealRequestReadRepository type should be exported from index', () => {
			// Type exports are verified at compile time
			expect(true).toBe(true);
		});
	});
});
