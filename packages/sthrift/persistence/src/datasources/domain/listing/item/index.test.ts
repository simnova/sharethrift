import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as ItemListingIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Scenario }) => {
	Scenario('Exports from item listing index', ({ Then, And }) => {
		Then('the ItemListingPersistence function should be exported', () => {
			expect(ItemListingIndex.ItemListingPersistence).toBeDefined();
		});

		And('ItemListingPersistence should be a function', () => {
			expect(typeof ItemListingIndex.ItemListingPersistence).toBe('function');
		});
	});
});
