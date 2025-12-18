import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { ReservationRequest } from './reservation-request.ts';
import type { ReservationRequestProps } from './reservation-request.entity.ts';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.entity.ts';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.entity.ts';
import { ReservationRequestStates, ReservationRequestStateValue } from './reservation-request.value-objects.ts';
import type { Passport } from '../../passport.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/reservation-request.aggregate.feature'));
const test = { for: describeFeature };

test.for(feature, ({ Scenario, BeforeEachScenario }) => {
	let reservation: ReservationRequest<ReservationRequestProps>;
	let props: ReservationRequestProps;
	let error: unknown;
	let listing: ItemListingEntityReference;
	let reserver: PersonalUserEntityReference;
	let startDate: Date;
	let endDate: Date;

	BeforeEachScenario(() => {
		reservation = undefined as unknown as ReservationRequest<ReservationRequestProps>;
		props = undefined as unknown as ReservationRequestProps;
		error = undefined;
		listing = undefined as unknown as ItemListingEntityReference;
		reserver = undefined as unknown as PersonalUserEntityReference;
		startDate = undefined as unknown as Date;
		endDate = undefined as unknown as Date;
	});

	const mockPassport: Passport = {
		get reservationRequest() {
			return { forReservationRequest: () => ({ determineIf: () => true }) };
		},
		get listing() {
			return { forItemListing: () => ({ determineIf: () => true }) };
		},
		get appealRequest() {
			return {
				forListingAppealRequest: () => ({ determineIf: () => true }),
				forUserAppealRequest: () => ({ determineIf: () => true }),
			};
		},
		get conversation() {
			return { forConversation: () => ({ determineIf: () => true }) };
		},
		get user() {
			return {
				forUser: () => ({ determineIf: () => true }),
				forPersonalUser: () => ({ determineIf: () => true }),
				forAdminUser: () => ({ determineIf: () => true }),
			};
		},
		get accountPlan() {
			return { forAccountPlan: () => ({ determineIf: () => true }) };
		},
	} as Passport;

	const createMockPersonalUser = (id = 'user-1'): PersonalUserEntityReference => ({
		id,
		userType: 'personal-user',
		isBlocked: false,
		schemaVersion: '1',
		hasCompletedOnboarding: true,
		account: {
			accountType: 'standard',
			email: 'mock@example.com',
			username: 'mockuser',
			profile: {
				firstName: 'Mock',
				lastName: 'User',
				aboutMe: 'Hello',
				location: {
					address1: '123 Main St',
					address2: null,
					city: 'Springfield',
					state: 'IL',
					country: 'USA',
					zipCode: '62704',
				},
				billing: {
					cybersourceCustomerId: null,
					subscription: {
						planCode: 'basic',
						status: '',
						startDate: new Date('2020-01-01T00:00:00Z'),
						subscriptionId: 'sub_123',
					},
					transactions: [
						{
							id: '1',
							transactionId: 'txn_123',
							amount: 1000,
							referenceId: 'ref_123',
							status: 'completed',
							completedAt: new Date('2020-01-01T00:00:00Z'),
							errorMessage: null,
						},
					],
				},
			},
		},
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	const sharer = createMockPersonalUser('sharer-1');
	const createMockListing = (id = 'listing-1'): ItemListingEntityReference => ({
		id,
		sharer: sharer,
		title: 'Mock Listing',
		description: 'Mock listing description',
		category: 'Tools & Equipment',
		location: '123 Main St, Springfield',
		sharingPeriodStart: new Date(),
		sharingPeriodEnd: new Date(),
		state: 'Active',
		createdAt: new Date(),
		updatedAt: new Date(),
		schemaVersion: '1',
		listingType: 'item-listing',
		loadSharer: async () => sharer,
	});

	const createMockProps = (overrides: Partial<ReservationRequestProps> = {}): ReservationRequestProps => {
		const listing = overrides.listing || createMockListing();
		const reserver = overrides.reserver || createMockPersonalUser();
		const now = new Date();
		const startDate = overrides.reservationPeriodStart || new Date(now.getTime() + 24 * 60 * 60 * 1000);
		const endDate = overrides.reservationPeriodEnd || new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
		return {
			id: 'test-id',
			createdAt: new Date(),
			updatedAt: new Date(),
			schemaVersion: '1',
			state: new ReservationRequestStateValue(ReservationRequestStates.REQUESTED).valueOf(),
			listing,
			reserver,
			reservationPeriodStart: startDate,
			reservationPeriodEnd: endDate,
			closeRequestedBySharer: overrides.closeRequestedBySharer ?? false,
			closeRequestedByReserver: overrides.closeRequestedByReserver ?? false,
			loadListing: async () => listing,
			loadReserver: async () => reserver,
			...overrides,
		};
	};

	const getFutureDates = () => {
		const now = new Date();
		const startDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
		const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
		return { startDate, endDate };
	};

	Scenario('Create a new reservation request', ({ Given, When, Then, And }) => {
		Given('a valid item listing and a personal user', () => {
			listing = createMockListing();
			reserver = createMockPersonalUser();
			({ startDate, endDate } = getFutureDates());
		});
		When('a reservation request is created with valid dates', () => {
			props = createMockProps({ listing, reserver, reservationPeriodStart: startDate, reservationPeriodEnd: endDate });
			reservation = ReservationRequest.getNewInstance(
				props,
				props.state,
				listing,
				reserver,
				startDate,
				endDate,
				mockPassport,
			);
		});
		Then('the reservation request should be in the REQUESTED state', () => {
			expect(reservation.state.valueOf()).toBe(
				new ReservationRequestStateValue(ReservationRequestStates.REQUESTED).valueOf()
			);
		});
		And('the listing and reserver references should be set', () => {
			expect(reservation.listing?.id).toBeDefined();
			expect(reservation.reserver?.id).toBeDefined();
		});
	});

	Scenario('Reject reservation with invalid dates', ({ Given, When, Then }) => {
		Given('a valid item listing and a personal user', () => {
			listing = createMockListing();
			reserver = createMockPersonalUser();
			({ startDate, endDate } = getFutureDates());
		});
		When('a reservation request is created with the start date after the end date', () => {
			try {
				props = createMockProps({ listing, reserver, reservationPeriodStart: endDate, reservationPeriodEnd: startDate });
				reservation = ReservationRequest.getNewInstance(
					props,
					props.state,
					listing,
					reserver,
					endDate,
					startDate,
					mockPassport,
				);
			} catch (e) {
				error = e;
			}
		});
		Then('an error should be thrown', () => {
			expect(error).toBeDefined();
		});
	});

	Scenario('Accept a reservation request', ({ Given, When, Then, And }) => {
		Given('a reservation request in REQUESTED state', () => {
			listing = createMockListing();
			reserver = createMockPersonalUser();
			({ startDate, endDate } = getFutureDates());
			props = createMockProps({ listing, reserver, reservationPeriodStart: startDate, reservationPeriodEnd: endDate });
			reservation = ReservationRequest.getNewInstance(
				props,
				props.state,
				listing,
				reserver,
				startDate,
				endDate,
				mockPassport,
			);
		});
		When('the reservation is accepted', () => {
			reservation.state = ReservationRequestStates.ACCEPTED;
		});
		Then('the reservation request should be in the ACCEPTED state', () => {
			expect(reservation.state.valueOf()).toBe(
				new ReservationRequestStateValue(ReservationRequestStates.ACCEPTED).valueOf()
			);
		});
		And('the request remains associated to the same listing and reserver', () => {
			expect(reservation.listing?.id).toBe(listing.id);
			expect(reservation.reserver?.id).toBe(reserver.id);
		});
	});

	Scenario('Cancel a reservation request', ({ Given, When, Then, And }) => {
		Given('a reservation request in REQUESTED state', () => {
			listing = createMockListing();
			reserver = createMockPersonalUser();
			({ startDate, endDate } = getFutureDates());
			props = createMockProps({ listing, reserver, reservationPeriodStart: startDate, reservationPeriodEnd: endDate });
			reservation = ReservationRequest.getNewInstance(
				props,
				props.state,
				listing,
				reserver,
				startDate,
				endDate,
				mockPassport,
			);
		});
		When('the reservation is cancelled', () => {
			reservation.state = ReservationRequestStates.CANCELLED;
		});
		Then('the reservation request should be in the CANCELLED state', () => {
			expect(reservation.state.valueOf()).toBe(
				new ReservationRequestStateValue(ReservationRequestStates.CANCELLED).valueOf()
			);
		});
		And('close flags should remain false', () => {
			expect(reservation.closeRequestedByReserver).toBe(false);
			expect(reservation.closeRequestedBySharer).toBe(false);
		});
	});

	Scenario('Close a reservation request by sharer', ({ Given, When, Then, And }) => {
		Given('a reservation request in ACCEPTED state and close requested by sharer', () => {
			listing = createMockListing();
			reserver = createMockPersonalUser();
			({ startDate, endDate } = getFutureDates());
			props = createMockProps({ listing, reserver, reservationPeriodStart: startDate, reservationPeriodEnd: endDate, closeRequestedBySharer: true });
			reservation = ReservationRequest.getNewInstance(
				props,
				props.state,
				listing,
				reserver,
				startDate,
				endDate,
				mockPassport,
			);
			reservation.state = ReservationRequestStates.ACCEPTED;
		});
		When('the reservation is closed', () => {
			reservation.state = ReservationRequestStates.CLOSED;
		});
		Then('the reservation request should be in the CLOSED state', () => {
			expect(reservation.state.valueOf()).toBe(
				new ReservationRequestStateValue(ReservationRequestStates.CLOSED).valueOf()
			);
		});
		And('closeRequestedBySharer should be true', () => {
			expect(reservation.closeRequestedBySharer).toBe(true);
		});
	});

	Scenario('Close a reservation request by reserver', ({ Given, When, Then, And }) => {
		Given('a reservation request in ACCEPTED state and close requested by reserver', () => {
			listing = createMockListing();
			reserver = createMockPersonalUser();
			({ startDate, endDate } = getFutureDates());
			props = createMockProps({ listing, reserver, reservationPeriodStart: startDate, reservationPeriodEnd: endDate, closeRequestedByReserver: true });
			reservation = ReservationRequest.getNewInstance(
				props,
				props.state,
				listing,
				reserver,
				startDate,
				endDate,
				mockPassport,
			);
			reservation.state = ReservationRequestStates.ACCEPTED;
		});
		When('the reservation is closed', () => {
			reservation.state = ReservationRequestStates.CLOSED;
		});
		Then('the reservation request should be in the CLOSED state', () => {
			expect(reservation.state.valueOf()).toBe(
				new ReservationRequestStateValue(ReservationRequestStates.CLOSED).valueOf()
			);
		});
		And('closeRequestedByReserver should be true', () => {
			expect(reservation.closeRequestedByReserver).toBe(true);
		});
	});

	Scenario('Request close by reserver', ({ Given, When, Then }) => {
		Given('a reservation request in ACCEPTED state', () => {
			listing = createMockListing();
			reserver = createMockPersonalUser();
			({ startDate, endDate } = getFutureDates());
			props = createMockProps({ listing, reserver, reservationPeriodStart: startDate, reservationPeriodEnd: endDate });
			reservation = ReservationRequest.getNewInstance(
				props,
				props.state,
				listing,
				reserver,
				startDate,
				endDate,
				mockPassport,
			);
			reservation.state = ReservationRequestStates.ACCEPTED;
		});
		When('the reserver requests to close', () => {
			reservation.closeRequestedByReserver = true;
		});
		Then('closeRequestedByReserver should be true', () => {
			expect(reservation.closeRequestedByReserver).toBe(true);
		});
	});
});
