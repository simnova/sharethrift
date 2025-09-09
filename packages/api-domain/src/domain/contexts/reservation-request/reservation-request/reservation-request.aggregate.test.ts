import { describe, it, expect } from 'vitest';
import {
	ReservationRequest,
	type ReservationRequestProps,
} from './reservation-request.ts';
import type { ItemListingEntityReference } from '../../listing/item/item-listing.ts';
import type { PersonalUserEntityReference } from '../../user/personal-user/personal-user.ts';
// ...existing code...
import {
	ReservationRequestStates,
	ReservationRequestStateValue,
} from './reservation-request.value-objects.ts';
import type { Passport } from '../../passport.ts';
import type { PersonalUserRoleEntityReference } from '../../role/personal-user-role/personal-user-role.ts';
import { PersonalUserRolePermissions } from '../../role/personal-user-role/personal-user-role-permissions.ts';
// Minimal test-only mocks for missing domain value objects
class PersonalUserAccountProfileLocation {
	readonly address1: string;
	readonly city: string;
	readonly state: string;
	readonly country: string;
	readonly zipCode: string;
	constructor(props: {
		address1: string;
		city: string;
		state: string;
		country: string;
		zipCode: string;
	}) {
		this.address1 = props.address1;
		this.city = props.city;
		this.state = props.state;
		this.country = props.country;
		this.zipCode = props.zipCode;
	}
}

class PersonalUserAccountProfileBilling {
	readonly subscriptionId: string;
	readonly cybersourceCustomerId: string;
	constructor(props: {
		subscriptionId: string;
		cybersourceCustomerId: string;
	}) {
		this.subscriptionId = props.subscriptionId;
		this.cybersourceCustomerId = props.cybersourceCustomerId;
	}
}

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
			};
		},
	} as Passport;

	// Helper functions for creating mock entity references
	// ...existing code...
	const createMockListing = (id = 'listing-1'): ItemListingEntityReference => ({
		id,
		sharer: createMockReserver('sharer-1'),
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
	});

	const mockRole: Readonly<PersonalUserRoleEntityReference> = {
		id: 'role-1',
		roleName: 'mock-role',
		isDefault: false,
		permissions: new PersonalUserRolePermissions({
			listingPermissions: {
				canCreateItemListing: true,
				canUpdateItemListing: true,
				canDeleteItemListing: true,
				canViewItemListing: true,
				canPublishItemListing: true,
				canUnpublishItemListing: true,
			},
			conversationPermissions: {
				canCreateConversation: true,
				canManageConversation: true,
				canViewConversation: true,
			},
			reservationRequestPermissions: {
				canCreateReservationRequest: true,
				canManageReservationRequest: true,
				canViewReservationRequest: true,
			},
		}),
		roleType: 'mock-type',
		createdAt: new Date(),
		updatedAt: new Date(),
		schemaVersion: '1',
	};

	const createMockReserver = (id = 'user-1'): PersonalUserEntityReference => {
		return {
			id,
			userType: 'personal',
			isBlocked: false,
			schemaVersion: '1',
			account: {
				accountType: 'standard',
				email: 'mock@example.com',
				username: 'mockuser',
				profile: {
					firstName: 'Mock',
					lastName: 'User',
					location: new PersonalUserAccountProfileLocation({
						address1: '123 Main St',
						city: 'Springfield',
						state: 'IL',
						country: 'USA',
						zipCode: '62704',
					}),
					billing: new PersonalUserAccountProfileBilling({
						subscriptionId: 'sub-123',
						cybersourceCustomerId: 'cyber-456',
					}),
				},
			},
			createdAt: new Date(),
			updatedAt: new Date(),
			role: mockRole,
			loadRole: async () => mockRole,
		};
	};

	// Helper function to create full props for testing
	const createMockProps = (
		overrides: Partial<ReservationRequestProps> = {},
	) => {
		const listing = overrides.listing || createMockListing();
		const reserver = overrides.reserver || createMockReserver();
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
			const reserver = createMockReserver();
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
				if (endDate <= startDate)
					throw new Error('Reservation start date must be before end date');
			}).toThrow('Reservation start date must be before end date');
		});
	});

	describe('accept', () => {
		it('should change state from REQUESTED to ACCEPTED', () => {
			const { startDate, endDate } = getFutureDates();
			const listing = createMockListing();
			const reserver = createMockReserver();
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
			const reserver = createMockReserver();
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
			const reserver = createMockReserver();
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
			const reserver = createMockReserver();
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
			const reserver = createMockReserver();
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
			const reserver = createMockReserver();
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
			const reserver = createMockReserver();
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
			const reserver = createMockReserver();
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
			const reserver = createMockReserver();
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
