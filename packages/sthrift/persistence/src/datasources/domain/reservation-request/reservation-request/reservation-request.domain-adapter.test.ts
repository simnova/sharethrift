import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { expect, vi } from 'vitest';
import { ReservationRequestDomainAdapter } from './reservation-request.domain-adapter.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/reservation-request.domain-adapter.feature'),
);

function makeReservationRequestDoc() {
	const listingId = new MongooseSeedwork.ObjectId();
	const listingDoc = {
		_id: listingId,
		get id() {
			return listingId.toString();
		},
		title: 'Test Listing',
		description: 'Test Description',
		category: 'electronics',
		state: 'ACTIVE',
		set: vi.fn(),
	} as unknown as Models.Listing.ItemListing;

	const reserverId = new MongooseSeedwork.ObjectId();
	const reserverDoc = {
		_id: reserverId,
		get id() {
			return reserverId.toString();
		},
		firstName: 'Test',
		lastName: 'User',
		state: 'ACTIVE',
		set: vi.fn(),
	} as unknown as Models.User.PersonalUser;

	const base = {
		_id: new MongooseSeedwork.ObjectId(),
		state: 'PENDING',
		listing: listingDoc,
		reserver: reserverDoc,
		reservationPeriodStart: new Date(),
		reservationPeriodEnd: new Date(),
		closeRequestedBySharer: false,
		closeRequestedByReserver: false,
		set(key: keyof Models.ReservationRequest.ReservationRequest, value: unknown) {
			(this as Models.ReservationRequest.ReservationRequest)[key] = value as never;
		},
	} as unknown as Models.ReservationRequest.ReservationRequest;
	return vi.mocked(base);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let doc: Models.ReservationRequest.ReservationRequest;
	let adapter: ReservationRequestDomainAdapter;

	BeforeEachScenario(() => {
		doc = makeReservationRequestDoc();
		adapter = new ReservationRequestDomainAdapter(doc);
	});

	Background(({ Given, And }) => {
		Given('a ReservationRequest document from the database', () => {
			// Document created in BeforeEachScenario
		});
		And('a ReservationRequestDomainAdapter wrapping the document', () => {
			// Adapter created in BeforeEachScenario
		});
	});

	Scenario('Accessing reservation request properties', ({ Then, And }) => {
		Then('the domain adapter should have a state property', () => {
			expect(adapter.state).toBeDefined();
		});

		And('the domain adapter should have a listing property', () => {
			expect(adapter.listing).toBeDefined();
		});

		And('the domain adapter should have a reserver property', () => {
			expect(adapter.reserver).toBeDefined();
		});

		And('the domain adapter should have a reservationPeriodStart property', () => {
			expect(adapter.reservationPeriodStart).toBeDefined();
		});

		And('the domain adapter should have a reservationPeriodEnd property', () => {
			expect(adapter.reservationPeriodEnd).toBeDefined();
		});
	});

	Scenario('Getting reservation request listing reference', ({ When, Then }) => {
		let listing: unknown;

		When('I access the listing property', () => {
			listing = adapter.listing;
		});

		Then('I should receive a Listing reference with an id', () => {
			expect(listing).toBeDefined();
			expect((listing as { id: string }).id).toBeDefined();
		});
	});

	Scenario('Getting reservation request reserver reference', ({ When, Then }) => {
		let reserver: unknown;

		When('I access the reserver property', () => {
			reserver = adapter.reserver;
		});

		Then('I should receive a User reference with an id', () => {
			expect(reserver).toBeDefined();
			expect((reserver as { id: string }).id).toBeDefined();
		});
	});

	Scenario('Modifying reservation request state', ({ When, Then }) => {
		When('I set the state to "ACCEPTED"', () => {
			adapter.state = 'ACCEPTED';
		});

		Then('the state should be "ACCEPTED"', () => {
			expect(adapter.state).toBe('ACCEPTED');
		});
	});
});
