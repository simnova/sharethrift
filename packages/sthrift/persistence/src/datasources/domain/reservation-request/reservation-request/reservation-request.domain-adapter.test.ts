import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import { ReservationRequestDomainAdapter } from './reservation-request.domain-adapter.ts';
import { PersonalUserDomainAdapter } from '../../user/personal-user/personal-user.domain-adapter.ts';
import { ItemListingDomainAdapter } from '../../listing/item/item-listing.domain-adapter.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/reservation-request.domain-adapter.feature'),
);

function makeUserDoc(overrides: Partial<Models.User.PersonalUser> = {}) {
	return {
		id: new MongooseSeedwork.ObjectId(),
		...overrides,
	} as Models.User.PersonalUser;
}

function makeListingDoc(overrides: Partial<Models.Listing.ItemListing> = {}) {
	return { id: new MongooseSeedwork.ObjectId(), ...overrides } as Models.Listing.ItemListing;
}

function makeReservationRequestDoc(
	overrides: Partial<Models.ReservationRequest.ReservationRequest> = {},
) {
	const base = {
		state: 'REQUESTED',
		closeRequestedBySharer: false,
		closeRequestedByReserver: false,
		reservationPeriodStart: new Date(),
		reservationPeriodEnd: new Date(),
		reserver: undefined,
		listing: undefined,
		set(key: keyof Models.ReservationRequest.ReservationRequest, value: unknown) {
			(this as Models.ReservationRequest.ReservationRequest)[key] = value as never;
		},
		...overrides,
	} as Models.ReservationRequest.ReservationRequest;
	return vi.mocked(base);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let doc: Models.ReservationRequest.ReservationRequest;
	let adapter: ReservationRequestDomainAdapter;
	let reserverDoc: Models.User.PersonalUser;
	let listingDoc: Models.Listing.ItemListing;
	let result: unknown;

	BeforeEachScenario(() => {
		reserverDoc = makeUserDoc();
		listingDoc = makeListingDoc();
		doc = makeReservationRequestDoc({
			reserver: reserverDoc,
			listing: listingDoc,
		});
		adapter = new ReservationRequestDomainAdapter(doc);
		result = undefined;
	});

	Background(({ Given }) => {
		Given(
			'a valid ReservationRequest document with populated reserver and listing',
			() => {
				reserverDoc = makeUserDoc();
				listingDoc = makeListingDoc();
				doc = makeReservationRequestDoc({
					reserver: reserverDoc,
					listing: listingDoc,
				});
				adapter = new ReservationRequestDomainAdapter(doc);
			},
		);
	});

	Scenario('Getting the state property', ({ When, Then }) => {
		When('I get the state property', () => {
			result = adapter.state;
		});
		Then('it should return the correct value', () => {
			expect(result).toBe('REQUESTED');
		});
	});

	Scenario('Setting the state property', ({ When, Then }) => {
		When('I set the state property to "ACCEPTED"', () => {
			adapter.state = 'ACCEPTED';
		});
		Then('the document\'s state should be "ACCEPTED"', () => {
			expect(doc.state).toBe('ACCEPTED');
		});
	});

	Scenario('Getting the closeRequestedBySharer property', ({ When, Then }) => {
		When('I get the closeRequestedBySharer property', () => {
			result = adapter.closeRequestedBySharer;
		});
		Then('it should return the correct value', () => {
			expect(result).toBe(false);
		});
	});

	Scenario('Setting the closeRequestedBySharer property', ({ When, Then }) => {
		When('I set the closeRequestedBySharer property to true', () => {
			adapter.closeRequestedBySharer = true;
		});
		Then('the document\'s closeRequestedBySharer should be true', () => {
			expect(doc.closeRequestedBySharer).toBe(true);
		});
	});

	Scenario('Getting the closeRequestedByReserver property', ({ When, Then }) => {
		When('I get the closeRequestedByReserver property', () => {
			result = adapter.closeRequestedByReserver;
		});
		Then('it should return the correct value', () => {
			expect(result).toBe(false);
		});
	});

	Scenario('Setting the closeRequestedByReserver property', ({ When, Then }) => {
		When('I set the closeRequestedByReserver property to true', () => {
			adapter.closeRequestedByReserver = true;
		});
		Then('the document\'s closeRequestedByReserver should be true', () => {
			expect(doc.closeRequestedByReserver).toBe(true);
		});
	});

	Scenario('Getting the reservationPeriodStart property', ({ When, Then }) => {
		When('I get the reservationPeriodStart property', () => {
			result = adapter.reservationPeriodStart;
		});
		Then('it should return a Date', () => {
			expect(result).toBeInstanceOf(Date);
		});
	});

	Scenario('Setting the reservationPeriodStart property', ({ When, Then }) => {
		const newDate = new Date('2025-10-15T10:00:00Z');
		When('I set the reservationPeriodStart property to a new date', () => {
			adapter.reservationPeriodStart = newDate;
		});
		Then('the document\'s reservationPeriodStart should be updated', () => {
			expect(doc.reservationPeriodStart).toBe(newDate);
		});
	});

	Scenario('Getting the reservationPeriodEnd property', ({ When, Then }) => {
		When('I get the reservationPeriodEnd property', () => {
			result = adapter.reservationPeriodEnd;
		});
		Then('it should return a Date', () => {
			expect(result).toBeInstanceOf(Date);
		});
	});

	Scenario('Setting the reservationPeriodEnd property', ({ When, Then }) => {
		const newDate = new Date('2025-10-20T10:00:00Z');
		When('I set the reservationPeriodEnd property to a new date', () => {
			adapter.reservationPeriodEnd = newDate;
		});
		Then('the document\'s reservationPeriodEnd should be updated', () => {
			expect(doc.reservationPeriodEnd).toBe(newDate);
		});
	});

	Scenario('Getting the reserver property when populated', ({ When, Then }) => {
		When('I get the reserver property', () => {
			result = adapter.reserver;
		});
		Then(
			'it should return a PersonalUserDomainAdapter with the correct doc',
			() => {
				expect(result).toBeInstanceOf(PersonalUserDomainAdapter);
				expect((result as PersonalUserDomainAdapter).doc).toBe(reserverDoc);
			},
		);
	});

	Scenario(
		'Getting the reserver property when not populated',
		({ When, Then }) => {
			When('I get the reserver property on a doc with no reserver', () => {
				doc = makeReservationRequestDoc({ reserver: undefined });
				adapter = new ReservationRequestDomainAdapter(doc);
			});
			Then(
				'an error should be thrown indicating reserver is not populated',
				() => {
					expect(() => adapter.reserver).toThrow(/reserver is not populated/);
				},
			);
		},
	);

	Scenario(
		'Getting the reserver property when it is an ObjectId',
		({ When, Then }) => {
			When('I get the reserver property on a doc with reserver as ObjectId', () => {
				doc = makeReservationRequestDoc({ reserver: new MongooseSeedwork.ObjectId() });
				adapter = new ReservationRequestDomainAdapter(doc);
			});
			Then(
				'an error should be thrown indicating reserver is not populated or is not of the correct type',
				() => {
					expect(() => adapter.reserver).toThrow(
						/reserver is not populated or is not of the correct type/,
					);
				},
			);
		},
	);

	Scenario('Setting the reserver property', ({ When, Then }) => {
		let userAdapter: PersonalUserDomainAdapter;
		When(
			'I set the reserver property to a valid PersonalUserDomainAdapter',
			() => {
				userAdapter = new PersonalUserDomainAdapter(reserverDoc);
				adapter.reserver = userAdapter;
			},
		);
		Then("the document's reserver should be set to the user's ObjectId", () => {
			expect(doc.reserver).toBeInstanceOf(MongooseSeedwork.ObjectId);
		});
	});

	Scenario('Getting the listing property when populated', ({ When, Then }) => {
		When('I get the listing property', () => {
			result = adapter.listing;
		});
		Then(
			'it should return an ItemListingDomainAdapter with the correct doc',
			() => {
				expect(result).toBeInstanceOf(ItemListingDomainAdapter);
				expect((result as ItemListingDomainAdapter).doc).toBe(listingDoc);
			},
		);
	});

	Scenario(
		'Getting the listing property when not populated',
		({ When, Then }) => {
			When('I get the listing property on a doc with no listing', () => {
				doc = makeReservationRequestDoc({ listing: undefined });
				adapter = new ReservationRequestDomainAdapter(doc);
			});
			Then(
				'an error should be thrown indicating listing is not populated',
				() => {
					expect(() => adapter.listing).toThrow(/listing is not populated/);
				},
			);
		},
	);

	Scenario(
		'Getting the listing property when it is an ObjectId',
		({ When, Then }) => {
			When('I get the listing property on a doc with listing as ObjectId', () => {
				doc = makeReservationRequestDoc({ listing: new MongooseSeedwork.ObjectId() });
				adapter = new ReservationRequestDomainAdapter(doc);
			});
			Then(
				'an error should be thrown indicating listing is not populated or is not of the correct type',
				() => {
					expect(() => adapter.listing).toThrow(
						/listing is not populated or is not of the correct type/,
					);
				},
			);
		},
	);

	Scenario('Setting the listing property', ({ When, Then }) => {
		let listingAdapter: ItemListingDomainAdapter;
		When(
			'I set the listing property to a valid ItemListingDomainAdapter',
			() => {
				listingAdapter = new ItemListingDomainAdapter(listingDoc);
				adapter.listing = listingAdapter;
			},
		);
		Then("the document's listing should be set to the listing's ObjectId", () => {
			expect(doc.listing).toBeInstanceOf(MongooseSeedwork.ObjectId);
		});
	});
});
