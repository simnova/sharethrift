import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { expect, vi } from 'vitest';
import { ListingAppealRequestDomainAdapter } from './listing-appeal-request.domain-adapter.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/listing-appeal-request.domain-adapter.feature'),
);

function makeAppealRequestDoc() {
	const base = {
		id: new MongooseSeedwork.ObjectId(),
		reason: 'Test reason',
		state: 'pending',
		type: 'inappropriate',
		user: new MongooseSeedwork.ObjectId(),
		listing: new MongooseSeedwork.ObjectId(),
		blocker: new MongooseSeedwork.ObjectId(),
		createdAt: new Date(),
		updatedAt: new Date(),
		set(key: keyof Models.AppealRequest.ListingAppealRequest, value: unknown) {
			(this as Models.AppealRequest.ListingAppealRequest)[key] = value as never;
		},
		populate: vi.fn(function (this: Models.AppealRequest.ListingAppealRequest) {
			return this;
		}),
	} as unknown as Models.AppealRequest.ListingAppealRequest;
	return vi.mocked(base);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let doc: Models.AppealRequest.ListingAppealRequest;
	let adapter: ListingAppealRequestDomainAdapter;

	BeforeEachScenario(() => {
		doc = makeAppealRequestDoc();
		adapter = new ListingAppealRequestDomainAdapter(doc);
	});

	Background(({ Given }) => {
		Given('a valid ListingAppealRequest document', () => {
			// Setup happens in BeforeEachScenario
		});
	});

	Scenario('Getting the userId property', ({ When, Then }) => {
		When('I get the userId property', () => {
			// Property access is tested in Then
		});

		Then('it should return the correct value', () => {
			expect(adapter.user).toBeDefined();
			expect(adapter.user.id).toBeDefined();
		});
	});

	Scenario('Getting the listingId property', ({ When, Then }) => {
		When('I get the listingId property', () => {
			// Property access is tested in Then
		});

		Then('it should return the correct value', () => {
			expect(adapter.listing).toBeDefined();
			expect(adapter.listing.id).toBeDefined();
		});
	});

	Scenario('Getting the reason property', ({ When, Then }) => {
		When('I get the reason property', () => {
			// Property access is tested in Then
		});

		Then('it should return the correct value', () => {
			expect(adapter.reason).toBe('Test reason');
		});
	});

	Scenario('Getting the blockerId property', ({ When, Then }) => {
		When('I get the blockerId property', () => {
			// Property access is tested in Then
		});

		Then('it should return the correct value', () => {
			expect(adapter.blocker).toBeDefined();
			expect(adapter.blocker.id).toBeDefined();
		});
	});
});
