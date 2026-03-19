import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as ListingIndex from './index.ts';
import type { ModelsContext } from '../../../models-context.ts';
import type { Domain } from '@sthrift/domain';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Scenario }) => {
	Scenario('Exports from listing context index', ({ Then, And }) => {
		Then('the ListingContextPersistence function should be exported', () => {
			expect(ListingIndex.ListingContextPersistence).toBeDefined();
		});

		And('ListingContextPersistence should be a function', () => {
			expect(typeof ListingIndex.ListingContextPersistence).toBe('function');
		});
	});

	Scenario('Creating Listing Context Persistence', ({ Given, And, When, Then }) => {
		let mockModels: ModelsContext;
		let mockPassport: Domain.Passport;
		let result: ReturnType<typeof ListingIndex.ListingContextPersistence>;

		Given('a mock ModelsContext with Listing models', () => {
			mockModels = {
				Listing: {
					ItemListingModel: {} as unknown,
				},
			} as ModelsContext;
		});

		And('a mock Passport', () => {
			mockPassport = {} as Domain.Passport;
		});

		When('I call ListingContextPersistence with models and passport', () => {
			result = ListingIndex.ListingContextPersistence(mockModels, mockPassport);
		});

		Then('it should return an object with ItemListing property', () => {
			expect(result.ItemListing).toBeDefined();
		});
	});
});
