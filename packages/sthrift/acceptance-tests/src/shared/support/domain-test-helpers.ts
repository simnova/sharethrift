import type { Domain } from '@sthrift/domain';

export const ONE_DAY_MS = 86_400_000;
export const DEFAULT_SHARING_PERIOD_DAYS = 30;

type ItemListingProps = Domain.Contexts.Listing.ItemListing.ItemListingProps;
type ItemListingEntityReference = Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;
type ReservationRequestProps = Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestProps;
type UserEntityReference = Domain.Contexts.User.UserEntityReference;
type Passport = Domain.Passport;

export function makeTestPassport(): Passport {
	const alwaysAllow = { determineIf: (fn: (p: Record<string, boolean>) => boolean) => fn(new Proxy({}, { get: () => true })) };
	return {
		listing: { forItemListing: () => alwaysAllow },
		user: {
			forPersonalUser: () => alwaysAllow,
			forAdminUser: () => alwaysAllow,
			forAdminRole: () => alwaysAllow,
		},
		conversation: { forConversation: () => alwaysAllow },
		reservationRequest: { forReservationRequest: () => alwaysAllow },
		accountPlan: { forAccountPlan: () => alwaysAllow },
		appealRequest: { forAppealRequest: () => alwaysAllow },
	} as unknown as Passport;
}

export interface TestUserData {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
}

export function makeTestUserData(actorName: string, overrides?: Partial<TestUserData>): TestUserData {
	const defaultId = `test-user-${actorName.toLowerCase()}`;
	const defaultEmail = `${actorName.toLowerCase()}@test.com`;
	const defaultFirstName = actorName;
	const defaultLastName = 'Tester';

	return {
		id: overrides?.id ?? defaultId,
		email: overrides?.email ?? defaultEmail,
		firstName: overrides?.firstName ?? defaultFirstName,
		lastName: overrides?.lastName ?? defaultLastName,
	};
}

export function makeSharerUser(overrides: Partial<{ id: string; email: string; firstName: string; lastName: string }> = {}): UserEntityReference {
	return {
		id: overrides.id ?? 'test-sharer-1',
		userType: 'personal-user',
		isBlocked: false,
		hasCompletedOnboarding: true,
		account: {
			accountType: 'standard',
			email: overrides.email ?? 'sharer@test.com',
			username: overrides.firstName?.toLowerCase() ?? 'sharer',
			profile: {
				firstName: overrides.firstName ?? 'Sharer',
				lastName: overrides.lastName ?? 'User',
				aboutMe: '',
				location: {
					address1: '123 Test St',
					address2: null,
					city: 'Seattle',
					state: 'WA',
					country: 'US',
					zipCode: '98101',
				},
				billing: {
					cybersourceCustomerId: null,
					subscription: {
						status: 'inactive',
						planCode: 'free',
						startDate: new Date('2020-01-01'),
						subscriptionId: null,
					},
					transactions: {
						items: [],
						getNewItem: () => ({}),
						addItem: () => { /* no-op */ },
						removeItem: () => { /* no-op */ },
						removeAll: () => { /* no-op */ },
					},
				},
			},
		},
		schemaVersion: '1.0.0',
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01'),
	} as unknown as UserEntityReference;
}

export function makeItemListingProps(overrides: Partial<ItemListingProps> = {}): ItemListingProps {
	const sharer = makeSharerUser();
	return {
		id: overrides.id ?? `listing-${Date.now()}`,
		sharer,
		loadSharer: async () => sharer,
		title: 'Default Title',
		description: 'Default Description',
		category: 'Electronics',
		location: 'Seattle, WA',
		sharingPeriodStart: new Date(Date.now() + 86_400_000),
		sharingPeriodEnd: new Date(Date.now() + 86_400_000 * 30),
		state: 'Active',
		images: [],
		sharingHistory: [],
		reports: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
		schemaVersion: '1.0.0',
		listingType: 'item',
		...overrides,
	} as ItemListingProps;
}

export function makeListingReference(overrides: Partial<{ id: string; state: string }> = {}): ItemListingEntityReference {
	return {
		id: overrides.id ?? `listing-${Date.now()}`,
		sharer: makeSharerUser(),
		title: 'Test Listing',
		description: 'Test',
		category: 'Electronics',
		location: 'Seattle',
		sharingPeriodStart: new Date(Date.now() + 3_600_000),
		sharingPeriodEnd: new Date(Date.now() + 7_200_000),
		state: overrides.state ?? 'Active',
		createdAt: new Date('2024-01-01'),
		updatedAt: new Date('2024-01-01'),
		schemaVersion: '1',
		listingType: 'item',
	} as ItemListingEntityReference;
}

export function makeReservationRequestProps(overrides: Partial<ReservationRequestProps> = {}): ReservationRequestProps {
	const listing = makeListingReference();
	const reserver = makeSharerUser({ id: 'reserver-1' });
	const tomorrow = new Date(Date.now() + 86_400_000);
	const nextMonth = new Date(Date.now() + 86_400_000 * 30);
	return {
		id: overrides.id ?? `rr-${Date.now()}`,
		state: 'Requested',
		reservationPeriodStart: tomorrow,
		reservationPeriodEnd: nextMonth,
		createdAt: new Date(),
		updatedAt: new Date(),
		schemaVersion: '1',
		listing,
		loadListing: async () => listing,
		reserver,
		loadReserver: async () => reserver,
		closeRequestedBySharer: false,
		closeRequestedByReserver: false,
		...overrides,
	} as ReservationRequestProps;
}
