import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { expect, vi } from 'vitest';
import { ItemListingDomainAdapter } from './item-listing.domain-adapter.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/item-listing.domain-adapter.feature'),
);

function makeItemListingDoc() {
	const base = {
		_id: new MongooseSeedwork.ObjectId(),
		title: 'Test Listing',
		description: 'Test Description',
		category: 'Electronics',
		location: 'New York',
		state: 'Published',
		sharingPeriodStart: new Date(),
		sharingPeriodEnd: new Date(),
		sharer: new MongooseSeedwork.ObjectId(),
		set(key: keyof Models.Listing.ItemListing, value: unknown) {
			(this as Models.Listing.ItemListing)[key] = value as never;
		},
	} as unknown as Models.Listing.ItemListing;
	return vi.mocked(base);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let doc: Models.Listing.ItemListing;
	let adapter: ItemListingDomainAdapter;

	BeforeEachScenario(() => {
		doc = makeItemListingDoc();
		adapter = new ItemListingDomainAdapter(doc);
	});

	Background(({ Given, And }) => {
		Given('an ItemListing document from the database', () => {
			// Document created in BeforeEachScenario
		});
		And('an ItemListingDomainAdapter wrapping the document', () => {
			// Adapter created in BeforeEachScenario
		});
	});

	Scenario('Accessing item listing properties', ({ Then, And }) => {
		Then('the domain adapter should have a title property', () => {
			expect(adapter.title).toBeDefined();
		});

		And('the domain adapter should have a description property', () => {
			expect(adapter.description).toBeDefined();
		});

		And('the domain adapter should have a category property', () => {
			expect(adapter.category).toBeDefined();
		});

		And('the domain adapter should have a location property', () => {
			expect(adapter.location).toBeDefined();
		});

		And('the domain adapter should have a state property', () => {
			expect(adapter.state).toBeDefined();
		});

		And('the domain adapter should have a sharer property', () => {
			expect(adapter.sharer).toBeDefined();
		});
	});

	Scenario('Getting item listing sharer reference', ({ When, Then }) => {
		let sharer: unknown;

		When('I access the sharer property', () => {
			sharer = adapter.sharer;
		});

		Then('I should receive a User reference with an id', () => {
			expect(sharer).toBeDefined();
			expect((sharer as { id: string }).id).toBeDefined();
		});
	});

	Scenario('Modifying item listing title', ({ When, Then }) => {
		When('I set the title to "Updated Title"', () => {
			adapter.title = 'Updated Title';
		});

		Then('the title should be "Updated Title"', () => {
			expect(adapter.title).toBe('Updated Title');
		});
	});

	Scenario('Modifying item listing state', ({ When, Then }) => {
		When('I set the state to "Published"', () => {
			adapter.state = 'Published';
		});

		Then('the state should be "Published"', () => {
			expect(adapter.state).toBe('Published');
		});
	});
});
