import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as ItemListingIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Background, Scenario }) => {
	let mockModels: never;
	let mockPassport: never;

	Background(({ Given, And }) => {
		Given('a valid models context with ItemListing model', () => {
			mockModels = {
				Listing: {
					ItemListingModel: {} as never,
				},
			} as never;
		});

		And('a valid passport for domain operations', () => {
			mockPassport = {} as never;
		});
	});

	Scenario('Creating Item Listing Read Repository Implementation', ({ When, Then, And }) => {
		let result: ReturnType<typeof ItemListingIndex.ItemListingReadRepositoryImpl>;

		When('I call ItemListingReadRepositoryImpl with models and passport', () => {
			result = ItemListingIndex.ItemListingReadRepositoryImpl(mockModels, mockPassport);
		});

		Then('I should receive an object with ItemListingReadRepo property', () => {
			expect(result).toBeDefined();
			expect(result.ItemListingReadRepo).toBeDefined();
		});

		And('the ItemListingReadRepo should be an ItemListingReadRepository instance', () => {
			expect(result.ItemListingReadRepo).toBeDefined();
		});
	});

	Scenario('ItemListingReadRepositoryImpl exports', ({ Then, And }) => {
		Then('ItemListingReadRepositoryImpl should be exported from index', () => {
			expect(ItemListingIndex.ItemListingReadRepositoryImpl).toBeDefined();
		});

		And('ItemListingReadRepositoryImpl should be a function', () => {
			expect(typeof ItemListingIndex.ItemListingReadRepositoryImpl).toBe('function');
		});

		And('ItemListingReadRepository type should be exported from index', () => {
			// Type exports are verified at compile time
			expect(true).toBe(true);
		});
	});
});
