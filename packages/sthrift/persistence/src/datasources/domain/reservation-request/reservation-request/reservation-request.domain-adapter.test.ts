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
		userType: 'personal-user',
		isBlocked: false,
		hasCompletedOnboarding: true,
		firstName: 'Test',
		lastName: 'User',
		state: 'ACTIVE',
		account: {
			accountType: 'non-verified-personal',
			email: 'test@example.com',
			username: 'testuser',
			profile: {
				aboutMe: '',
				firstName: 'Test',
				lastName: 'User',
				location: {},
				billing: {
					cybersourceCustomerId: 'cust-123',
					subscription: null,
					transactions: { items: [] },
				},
				media: { items: [] },
				avatar: null,
			},
		},
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
		vi.spyOn(doc, 'set');
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

	Scenario('Getting and setting closeRequestedBySharer', ({ When, Then }) => {
		let value: boolean;

		When('I get the closeRequestedBySharer property', () => {
			value = adapter.closeRequestedBySharer;
		});

		Then('it should return a boolean value', () => {
			expect(typeof value).toBe('boolean');
		});

		When('I set closeRequestedBySharer to true', () => {
			adapter.closeRequestedBySharer = true;
		});

		Then('closeRequestedBySharer should be true', () => {
			expect(adapter.closeRequestedBySharer).toBe(true);
		});
	});

	Scenario('Getting and setting closeRequestedByReserver', ({ When, Then }) => {
		let value: boolean;

		When('I get the closeRequestedByReserver property', () => {
			value = adapter.closeRequestedByReserver;
		});

		Then('it should return a boolean value', () => {
			expect(typeof value).toBe('boolean');
		});

		When('I set closeRequestedByReserver to true', () => {
			adapter.closeRequestedByReserver = true;
		});

		Then('closeRequestedByReserver should be true', () => {
			expect(adapter.closeRequestedByReserver).toBe(true);
		});
	});

	Scenario('Setting reservationPeriodStart', ({ Given, When, Then }) => {
		let newDate: Date;

		Given('a new start date', () => {
			newDate = new Date('2025-01-01');
		});

		When('I set reservationPeriodStart to the new date', () => {
			adapter.reservationPeriodStart = newDate;
		});

		Then('reservationPeriodStart should match the new date', () => {
			expect(adapter.reservationPeriodStart).toEqual(newDate);
		});
	});

	Scenario('Setting reservationPeriodEnd', ({ Given, When, Then }) => {
		let newDate: Date;

		Given('a new end date', () => {
			newDate = new Date('2025-12-31');
		});

		When('I set reservationPeriodEnd to the new date', () => {
			adapter.reservationPeriodEnd = newDate;
		});

		Then('reservationPeriodEnd should match the new date', () => {
			expect(adapter.reservationPeriodEnd).toEqual(newDate);
		});
	});

	Scenario('Setting listing reference', ({ Given, When, Then }) => {
		let listingRef: { id: string };

		Given('a valid listing reference with id', () => {
			listingRef = { id: '507f1f77bcf86cd799439011' };
		});

		When('I set the listing property', () => {
			adapter.listing = listingRef as never;
		});

		Then('the document should be updated with the listing id', () => {
			expect(doc.set).toHaveBeenCalledWith('listing', expect.any(MongooseSeedwork.ObjectId));
		});
	});

	Scenario('Setting reserver reference', ({ Given, When, Then }) => {
		let userRef: { id: string };

		Given('a valid user reference with id', () => {
			userRef = { id: '507f1f77bcf86cd799439012' };
		});

		When('I set the reserver property', () => {
			adapter.reserver = userRef as never;
		});

		Then('the document should be updated with the reserver id', () => {
			expect(doc.set).toHaveBeenCalledWith('reserver', expect.any(MongooseSeedwork.ObjectId));
		});
	});

	Scenario('Setting listing property with missing id throws error', ({ When, Then }) => {
		When('I set the listing property to a reference missing id', () => {
			// Test happens in Then block
		});
		Then('an error should be thrown indicating listing reference is missing id', () => {
			expect(() => {
				adapter.listing = {} as never;
			}).toThrow('listing reference is missing id');
		});
	});

	Scenario('Setting reserver property with missing id throws error', ({ When, Then }) => {
		When('I set the reserver property to a reference missing id', () => {
			// Test happens in Then block
		});
		Then('an error should be thrown indicating user reference is missing id', () => {
			expect(() => {
				adapter.reserver = {} as never;
			}).toThrow('user reference is missing id');
		});
	});

	Scenario('Loading listing when it is an ObjectId', ({ When, Then }) => {
		When('I call loadListing on an adapter with listing as ObjectId', async () => {
			const oid = new MongooseSeedwork.ObjectId();
			doc = makeReservationRequestDoc();
			doc.listing = oid as unknown as Models.Listing.ItemListing;
			doc.populate = vi.fn().mockResolvedValue({
				...doc,
				listing: { id: oid.toString(), title: 'Test' },
			});
			adapter = new ReservationRequestDomainAdapter(doc);
			await adapter.loadListing();
		});
		Then('it should populate and return an ItemListingDomainAdapter', () => {
			expect(doc.populate).toHaveBeenCalledWith('listing');
		});
	});

	Scenario('Loading reserver when it is an ObjectId', ({ When, Then }) => {
		When('I call loadReserver on an adapter with reserver as ObjectId', async () => {
			const oid = new MongooseSeedwork.ObjectId();
			doc = makeReservationRequestDoc();
			doc.reserver = oid as unknown as Models.User.PersonalUser;
			const populatedReserver = {
				id: oid.toString(),
				firstName: 'Test',
				userType: 'personal-user',
				isBlocked: false,
				hasCompletedOnboarding: true,
				account: {
					accountType: 'non-verified-personal',
					email: 'test@example.com',
					username: 'testuser',
					profile: {
						aboutMe: '',
						firstName: 'Test',
						lastName: 'User',
						location: {},
						billing: {
							cybersourceCustomerId: 'cust-123',
							subscription: null,
							transactions: { items: [] },
						},
						media: { items: [] },
						avatar: null,
					},
				},
				set: vi.fn(),
			};
			doc.populate = vi.fn().mockImplementation(() => {
				doc.reserver = populatedReserver as unknown as Models.User.PersonalUser;
				return Promise.resolve(doc);
			});
			adapter = new ReservationRequestDomainAdapter(doc);
			await adapter.loadReserver();
		});
		Then('it should populate and return a PersonalUserDomainAdapter', () => {
			expect(doc.populate).toHaveBeenCalledWith('reserver');
		});
	});
});
