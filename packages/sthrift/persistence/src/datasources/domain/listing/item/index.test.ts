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

	Scenario('Creating Item Listing Persistence', ({ When, Then, And }) => {
		let result: ReturnType<typeof ItemListingIndex.ItemListingPersistence>;

		When('I call ItemListingPersistence with models and passport', () => {
			result = ItemListingIndex.ItemListingPersistence(mockModels, mockPassport);
		});

		Then('I should receive an object with ItemListingUnitOfWork property', () => {
			expect(result).toBeDefined();
			expect(result.ItemListingUnitOfWork).toBeDefined();
		});

		And('the ItemListingUnitOfWork should be properly initialized', () => {
			expect(result.ItemListingUnitOfWork).toBeDefined();
		});
	});

	Scenario('ItemListingPersistence exports', ({ Then, And }) => {
		Then('ItemListingPersistence should be exported from index', () => {
			expect(ItemListingIndex.ItemListingPersistence).toBeDefined();
		});

		And('ItemListingPersistence should be a function', () => {
			expect(typeof ItemListingIndex.ItemListingPersistence).toBe('function');
		});
	});
});
