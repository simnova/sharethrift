import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect, vi } from 'vitest';
import { AdminUserReservationRequestVisa } from './admin-user.reservation-request.visa.ts';
import type { ReservationRequestEntityReference } from '../../../../contexts/reservation-request/reservation-request/reservation-request.entity.ts';
import type { AdminUserEntityReference } from '../../../../contexts/user/admin-user/admin-user.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/admin-user.reservation-request.visa.feature'),
);

function makeAdminUser(
	canModerateListings = false,
): AdminUserEntityReference {
	return vi.mocked({
		id: 'admin-1',
		isBlocked: false,
		role: {
			permissions: {
				listingPermissions: {
					canModerateListings,
				},
			},
		},
	} as unknown as AdminUserEntityReference);
}

function makeReservationRequestRoot(): ReservationRequestEntityReference {
	return vi.mocked({
		id: 'request-1',
	} as unknown as ReservationRequestEntityReference);
}

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let admin: AdminUserEntityReference;
	let requestRoot: ReservationRequestEntityReference;
	let visa: AdminUserReservationRequestVisa<ReservationRequestEntityReference>;
	let result: boolean;

	BeforeEachScenario(() => {
		admin = makeAdminUser();
		requestRoot = makeReservationRequestRoot();
		visa = new AdminUserReservationRequestVisa(requestRoot, admin);
		result = false;
	});

	Background(({ Given, And }) => {
		Given('an admin user with role permissions', () => {
			admin = makeAdminUser();
		});
		And('a reservation request entity reference', () => {
			requestRoot = makeReservationRequestRoot();
		});
	});

	Scenario(
		'Admin can edit request with moderation permission',
		({ Given, When, Then }) => {
			Given('the admin has canModerateListings permission', () => {
				admin = makeAdminUser(true);
				visa = new AdminUserReservationRequestVisa(requestRoot, admin);
			});

			When('I check if admin can edit request', () => {
				result = visa.determineIf((p) => p.canEditReservationRequest);
			});

			Then('the permission should be granted', () => {
				expect(result).toBe(true);
			});
		},
	);

	Scenario(
		'Admin cannot edit requests without moderation permission',
		({ Given, When, Then }) => {
			Given('the admin does not have canModerateListings permission', () => {
				admin = makeAdminUser(false);
				visa = new AdminUserReservationRequestVisa(requestRoot, admin);
			});

			When('I check if admin can edit request', () => {
				result = visa.determineIf((p) => p.canEditReservationRequest);
			});

			Then('the permission should be denied', () => {
				expect(result).toBe(false);
			});
		},
	);
});
