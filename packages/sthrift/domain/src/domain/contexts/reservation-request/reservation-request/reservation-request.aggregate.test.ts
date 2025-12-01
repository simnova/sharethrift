import { describe, it, expect } from 'vitest';
import { ReservationRequest } from './reservation-request.ts';
import type { ReservationRequestProps } from './reservation-request.entity.ts';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.entity.ts';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.entity.ts';
import {
	ReservationRequestStates,
	ReservationRequestStateValue,
} from './reservation-request.value-objects.ts';
import type { Passport } from '../../passport.ts';
// Minimal test-only mocks for missing domain value objects

describe('ReservationRequest', () => {
	const mockPassport: Passport = {
		get reservationRequest() {
			return {
				forReservationRequest: () => ({
					determineIf: () => true,
				}),
			};
		},
		get listing() {
			return {
				forItemListing: () => ({
					determineIf: () => true,
				}),
			};
		},
		get appealRequest() {
			return {
				forListingAppealRequest: () => ({
					determineIf: () => true,
				}),
				forUserAppealRequest: () => ({
					determineIf: () => true,
				}),
			};
		},
		get conversation() {
			return {
				forConversation: () => ({
					determineIf: () => true,
				}),
			};
		},
		get user() {
			return {
				forUser: () => ({
					determineIf: () => true,
				}),
				forPersonalUser: () => ({
					determineIf: () => true,
				}),
				forAdminUser: () => ({
					determineIf: () => true,
				}),
			};
		},

		get accountPlan() {
			return {
				forAccountPlan: () => ({
					determineIf: () => true,
				}),
			};
		},
	} as Passport;

	const createMockPersonalUser = (
		id = 'user-1',
	): PersonalUserEntityReference => {
		return {
			id,
			userType: 'personal',
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
		};
	};

	// Helper functions for creating mock entity references
	// ...existing code...
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
		state: 'Published',
		createdAt: new Date(),
		updatedAt: new Date(),
		schemaVersion: '1',
		listingType: 'item-listing',
		loadSharer: async () => sharer,
	});

	// Helper function to create full props for testing
	const createMockProps = (
		overrides: Partial<ReservationRequestProps> = {},
	) => {
		const listing = overrides.listing || createMockListing();
		const reserver = overrides.reserver || createMockPersonalUser();
		const now = new Date();
		const startDate =
			overrides.reservationPeriodStart ||
			new Date(now.getTime() + 24 * 60 * 60 * 1000);
		const endDate =
			overrides.reservationPeriodEnd ||
			new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
		return {
			id: 'test-id',
			createdAt: new Date(),
			updatedAt: new Date(),
			schemaVersion: '1',
			state: new ReservationRequestStateValue(
				ReservationRequestStates.REQUESTED,
			).valueOf(),
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

	// Use future dates for testing
	const getFutureDates = () => {
		const now = new Date();
		const startDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // tomorrow
		const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // next week
		return { startDate, endDate };
	};

	describe('getNewInstance', () => {
		it('should create a new reservation request with REQUESTED state', () => {
			const { startDate, endDate } = getFutureDates();
			const listing = createMockListing();
			const reserver = createMockPersonalUser();
			const state = new ReservationRequestStateValue(
				ReservationRequestStates.REQUESTED,
			).valueOf();
			const reservationPeriodStart = startDate;
			const reservationPeriodEnd = endDate;

			const props = createMockProps({
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
				closeRequestedBySharer: false,
				closeRequestedByReserver: false,
			});

			const reservation = ReservationRequest.getNewInstance(
				props,
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
				mockPassport,
			);

			expect(reservation.state.valueOf()).toBe(
				new ReservationRequestStateValue(
					ReservationRequestStates.REQUESTED,
				).valueOf(),
			);
			expect(reservation.listing.id).toBe('listing-1');
			expect(reservation.reserver.id).toBe('user-1');
			expect(reservation.closeRequestedBySharer).toBe(false);
			expect(reservation.closeRequestedByReserver).toBe(false);
			expect(reservation.schemaVersion).toBe('1');
		});

		it('should throw error if start date is after end date', () => {
			const { startDate, endDate } = getFutureDates();
			expect(() => {
				ReservationRequest.getNewInstance(
					createMockProps({
						reservationPeriodStart: endDate,
						reservationPeriodEnd: startDate,
					}),
					ReservationRequestStates.REQUESTED,
					createMockListing(),
					createMockPersonalUser(),
					endDate,
					startDate,
					mockPassport,
				);
			}).toThrow('Reservation start date must be before end date');
		});
	});

	describe('accept', () => {
		it('should change state from REQUESTED to ACCEPTED', () => {
			const { startDate, endDate } = getFutureDates();
			const listing = createMockListing();
			const reserver = createMockPersonalUser();
			const state = new ReservationRequestStateValue(
				ReservationRequestStates.REQUESTED,
			).valueOf();
			const reservationPeriodStart = startDate;
			const reservationPeriodEnd = endDate;

			const props = createMockProps({
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
			});

			const reservation = ReservationRequest.getNewInstance(
				props,
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
				mockPassport,
			);

			reservation.state = ReservationRequestStates.ACCEPTED;

			expect(reservation.state.valueOf()).toBe(
				new ReservationRequestStateValue(
					ReservationRequestStates.ACCEPTED,
				).valueOf(),
			);
		});

		it('should throw error if not in REQUESTED state', () => {
			const { startDate, endDate } = getFutureDates();
			const listing = createMockListing();
			const reserver = createMockPersonalUser();
			const state = new ReservationRequestStateValue(
				ReservationRequestStates.REQUESTED,
			).valueOf();
			const reservationPeriodStart = startDate;
			const reservationPeriodEnd = endDate;

			const props = createMockProps({
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
			});

			const reservation = ReservationRequest.getNewInstance(
				props,
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
				mockPassport,
			);

			reservation.state = ReservationRequestStates.ACCEPTED;

			expect(() => {
				reservation.state = ReservationRequestStates.ACCEPTED;
			}).toThrow('Can only accept requested reservations');
		});
	});

	describe('cancel', () => {
		it('should cancel a REQUESTED reservation', () => {
			const { startDate, endDate } = getFutureDates();
			const listing = createMockListing();
			const reserver = createMockPersonalUser();
			const state = new ReservationRequestStateValue(
				ReservationRequestStates.REQUESTED,
			).valueOf();
			const reservationPeriodStart = startDate;
			const reservationPeriodEnd = endDate;

			const props = createMockProps({
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
			});

			const reservation = ReservationRequest.getNewInstance(
				props,
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
				mockPassport,
			);

			reservation.state = ReservationRequestStates.CANCELLED;

			expect(reservation.state.valueOf()).toBe(
				new ReservationRequestStateValue(
					ReservationRequestStates.CANCELLED,
				).valueOf(),
			);
		});

		it('should cancel a REJECTED reservation', () => {
			const { startDate, endDate } = getFutureDates();
			const listing = createMockListing();
			const reserver = createMockPersonalUser();
			const state = new ReservationRequestStateValue(
				ReservationRequestStates.REQUESTED,
			).valueOf();
			const reservationPeriodStart = startDate;
			const reservationPeriodEnd = endDate;

			const props = createMockProps({
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
			});

			const reservation = ReservationRequest.getNewInstance(
				props,
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
				mockPassport,
			);

			reservation.state = ReservationRequestStates.REJECTED;
			reservation.state = ReservationRequestStates.CANCELLED;

			expect(reservation.state.valueOf()).toBe(
				new ReservationRequestStateValue(
					ReservationRequestStates.CANCELLED,
				).valueOf(),
			);
		});
	});

	describe('close', () => {
		it('should close an ACCEPTED reservation if closeRequestedBySharer is true', () => {
			const { startDate, endDate } = getFutureDates();
			const listing = createMockListing();
			const reserver = createMockPersonalUser();
			const state = new ReservationRequestStateValue(
				ReservationRequestStates.REQUESTED,
			).valueOf();
			const reservationPeriodStart = startDate;
			const reservationPeriodEnd = endDate;

			const props = createMockProps({
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
				closeRequestedBySharer: false,
				closeRequestedByReserver: false,
			});

			const reservation = ReservationRequest.getNewInstance(
				props,
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
				mockPassport,
			);

			reservation.state = ReservationRequestStates.ACCEPTED;
			reservation.closeRequestedBySharer = true;
			reservation.state = ReservationRequestStates.CLOSED;

			expect(reservation.state.valueOf()).toBe(
				new ReservationRequestStateValue(
					ReservationRequestStates.CLOSED,
				).valueOf(),
			);
		});

		it('should close an ACCEPTED reservation if closeRequestedByReserver is true', () => {
			const { startDate, endDate } = getFutureDates();
			const listing = createMockListing();
			const reserver = createMockPersonalUser();
			const state = new ReservationRequestStateValue(
				ReservationRequestStates.REQUESTED,
			).valueOf();
			const reservationPeriodStart = startDate;
			const reservationPeriodEnd = endDate;

			const props = createMockProps({
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
				closeRequestedBySharer: false,
				closeRequestedByReserver: false,
			});

			const reservation = ReservationRequest.getNewInstance(
				props,
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
				mockPassport,
			);

			reservation.state = ReservationRequestStates.ACCEPTED;
			reservation.closeRequestedByReserver = true;
			reservation.state = ReservationRequestStates.CLOSED;

			expect(reservation.state.valueOf()).toBe(
				new ReservationRequestStateValue(
					ReservationRequestStates.CLOSED,
				).valueOf(),
			);
		});

		it('should throw error if not in ACCEPTED state', () => {
			const { startDate, endDate } = getFutureDates();
			const listing = createMockListing();
			const reserver = createMockPersonalUser();
			const state = new ReservationRequestStateValue(
				ReservationRequestStates.REQUESTED,
			).valueOf();
			const reservationPeriodStart = startDate;
			const reservationPeriodEnd = endDate;

			const props = createMockProps({
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
				closeRequestedBySharer: false,
				closeRequestedByReserver: false,
			});

			const reservation = ReservationRequest.getNewInstance(
				props,
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
				mockPassport,
			);

			expect(() => {
				reservation.state = ReservationRequestStates.CLOSED;
			}).toThrow('Can only close accepted reservations');
		});

		it('should throw error if neither closeRequestedBySharer nor closeRequestedByReserver is true', () => {
			const { startDate, endDate } = getFutureDates();
			const listing = createMockListing();
			const reserver = createMockPersonalUser();
			const state = new ReservationRequestStateValue(
				ReservationRequestStates.REQUESTED,
			).valueOf();
			const reservationPeriodStart = startDate;
			const reservationPeriodEnd = endDate;

			const props = createMockProps({
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
				closeRequestedBySharer: false,
				closeRequestedByReserver: false,
			});

			const reservation = ReservationRequest.getNewInstance(
				props,
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
				mockPassport,
			);

			reservation.state = ReservationRequestStates.ACCEPTED;
			expect(() => {
				reservation.state = ReservationRequestStates.CLOSED;
			}).toThrow(
				'Can only close reservation requests if at least one user requested it',
			);
		});
	});

	describe('requestClose', () => {
		it('should set closeRequestedByReserver to true for ACCEPTED reservation', () => {
			const { startDate, endDate } = getFutureDates();
			const listing = createMockListing();
			const reserver = createMockPersonalUser();
			const state = new ReservationRequestStateValue(
				ReservationRequestStates.REQUESTED,
			).valueOf();
			const reservationPeriodStart = startDate;
			const reservationPeriodEnd = endDate;

			const props = createMockProps({
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
				closeRequestedBySharer: false,
				closeRequestedByReserver: false,
			});

			const reservation = ReservationRequest.getNewInstance(
				props,
				state,
				listing,
				reserver,
				reservationPeriodStart,
				reservationPeriodEnd,
				mockPassport,
			);

			reservation.state = ReservationRequestStates.ACCEPTED;
			reservation.closeRequestedByReserver = true;

			expect(reservation.closeRequestedByReserver).toBe(true);
		});
	});
});
