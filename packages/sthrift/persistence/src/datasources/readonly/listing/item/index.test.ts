import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as ItemListingIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Scenario }) => {
	Scenario('Exports from item listing readonly index', ({ Then, And }) => {
		Then('the getItemListingReadRepository function should be exported', () => {
			expect(ItemListingIndex.ItemListingReadRepositoryImpl).toBeDefined();
		});

		And('getItemListingReadRepository should be a function', () => {
			expect(typeof ItemListingIndex.ItemListingReadRepositoryImpl).toBe('function');
		});
	});
});
