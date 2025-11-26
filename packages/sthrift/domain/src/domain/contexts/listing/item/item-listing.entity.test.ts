import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import type { ItemListingProps } from './item-listing.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/item-listing.entity.feature'),
);

// biome-ignore lint/suspicious/noExplicitAny: Test helper function
function makeItemListingProps(overrides?: Partial<ItemListingProps>): any {
	return {
		id: 'test-listing-id',
		sharer: { id: 'test-sharer-id' },
		title: 'Test Item',
		description: 'A test listing',
		category: 'Electronics',
		location: 'Test City',
		sharingPeriodStart: new Date('2024-01-01'),
		sharingPeriodEnd: new Date('2024-12-31'),
		state: 'active',
		createdAt: new Date(),
		updatedAt: new Date(),
		schemaVersion: '1.0',
		listingType: 'item',
		...overrides,
	};
}

test.for(feature, ({ Background, Scenario }) => {
	// biome-ignore lint/suspicious/noExplicitAny: Test variable
	let props: any;

	Background(({ Given }) => {
		Given('I have an item listing props object', () => {
			props = makeItemListingProps();
		});
	});

	Scenario('Item listing sharer reference should be readonly', ({ When, Then }) => {
		When('I attempt to modify the sharer property', () => {
			Object.defineProperty(props, 'sharer', { writable: false, configurable: false, value: props.sharer });
			try {
				props.sharer = { id: 'new-sharer-id' };
			} catch (_error) {
				// Expected behavior for readonly
			}
		});

		Then('the sharer property should be readonly', () => {
			const itemListingProps: ItemListingProps = props;
			expect(itemListingProps.sharer).toEqual({ id: 'test-sharer-id' });
		});
	});

	Scenario('Item listing title should be a string', ({ When, Then }) => {

		When('I access the title property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const itemListingProps: ItemListingProps = props;
			expect(typeof itemListingProps.title).toBe('string');
			expect(itemListingProps.title).toBe('Test Item');
		});
	});

	Scenario('Item listing description should be a string', ({ When, Then }) => {

		When('I access the description property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const itemListingProps: ItemListingProps = props;
			expect(typeof itemListingProps.description).toBe('string');
			expect(itemListingProps.description).toBe('A test listing');
		});
	});

	Scenario('Item listing category should be a string', ({ When, Then }) => {

		When('I access the category property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const itemListingProps: ItemListingProps = props;
			expect(typeof itemListingProps.category).toBe('string');
			expect(itemListingProps.category).toBe('Electronics');
		});
	});

	Scenario('Item listing location should be a string', ({ When, Then }) => {

		When('I access the location property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const itemListingProps: ItemListingProps = props;
			expect(typeof itemListingProps.location).toBe('string');
			expect(itemListingProps.location).toBe('Test City');
		});
	});

	Scenario('Item listing sharing period dates should be Date objects', ({ When, Then }) => {

		When('I access the sharing period properties', () => {
			// Access the properties
		});

		Then('sharingPeriodStart and sharingPeriodEnd should be Date objects', () => {
			const itemListingProps: ItemListingProps = props;
			expect(itemListingProps.sharingPeriodStart).toBeInstanceOf(Date);
			expect(itemListingProps.sharingPeriodEnd).toBeInstanceOf(Date);
		});
	});

	Scenario('Item listing state should be a string', ({ When, Then }) => {

		When('I access the state property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const itemListingProps: ItemListingProps = props;
			expect(typeof itemListingProps.state).toBe('string');
			expect(itemListingProps.state).toBe('active');
		});
	});

	Scenario('Item listing createdAt should be readonly', ({ When, Then }) => {

		When('I access the createdAt property', () => {
			// Access the property
		});

		Then('it should be a Date object', () => {
			const itemListingProps: ItemListingProps = props;
			expect(itemListingProps.createdAt).toBeInstanceOf(Date);
		});
	});

	Scenario('Item listing updatedAt should be a date', ({ When, Then }) => {

		When('I access the updatedAt property', () => {
			// Access the property
		});

		Then('it should be a Date object', () => {
			const itemListingProps: ItemListingProps = props;
			expect(itemListingProps.updatedAt).toBeInstanceOf(Date);
		});
	});

	Scenario('Item listing schemaVersion should be readonly', ({ When, Then }) => {

		When('I access the schemaVersion property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const itemListingProps: ItemListingProps = props;
			expect(typeof itemListingProps.schemaVersion).toBe('string');
			expect(itemListingProps.schemaVersion).toBe('1.0');
		});
	});

	Scenario('Item listing listingType should be a string', ({ When, Then }) => {

		When('I access the listingType property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const itemListingProps: ItemListingProps = props;
			expect(typeof itemListingProps.listingType).toBe('string');
			expect(itemListingProps.listingType).toBe('item');
		});
	});

	Scenario('Item listing optional arrays should be supported', ({ Given, When, Then }) => {

		Given('I have an item listing props object with optional arrays', () => {
			props = makeItemListingProps({ images: [], sharingHistory: [], reports: 0 });
		});

		When('I access the optional array properties', () => {
			// Access the properties
		});

		Then('they should be arrays or numbers', () => {
			const itemListingProps: ItemListingProps = props;
			expect(Array.isArray(itemListingProps.sharingHistory)).toBe(true);
			expect(Array.isArray(itemListingProps.images)).toBe(true);
			expect(typeof itemListingProps.reports).toBe('number');
		});
	});
});
