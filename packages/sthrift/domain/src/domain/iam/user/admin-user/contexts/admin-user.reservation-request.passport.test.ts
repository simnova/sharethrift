import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { AdminUserReservationRequestPassport } from './admin-user.reservation-request.passport.ts';
import type { AdminUserEntityReference } from '../../../../contexts/user/admin-user/admin-user.entity.ts';
import type { ReservationRequestEntityReference } from '../../../../contexts/reservation-request/reservation-request/reservation-request.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(
		__dirname,
		'features/admin-user.reservation-request.passport.feature',
	),
);

test.for(feature, ({ Scenario }) => {
	Scenario(
		'Admin user can access reservation requests',
		({ Given, When, Then }) => {
			const mockUser = {
				id: 'admin-user-123',
				isBlocked: false,
			} as AdminUserEntityReference;
			let passport: AdminUserReservationRequestPassport;
			// biome-ignore lint/suspicious/noExplicitAny: Test mock
			let visa: any;

			Given('I have an admin user reservation request passport', () => {
				passport = new AdminUserReservationRequestPassport(mockUser);
			});

			When('I request access to a reservation request', () => {
				const mockReservationRequest = {
					id: 'req-1',
					reserver: { id: 'user-456' },
				} as ReservationRequestEntityReference;
				visa = passport.forReservationRequest(mockReservationRequest);
			});

			Then('visa should be created with permission function', () => {
				expect(visa).toBeDefined();
				expect(visa.determineIf).toBeDefined();
				expect(typeof visa.determineIf).toBe('function');
			});
		},
	);

	Scenario(
		'Admin user reservation passport is defined',
		({ Given, When, Then }) => {
			const mockUser = {
				id: 'admin-user-123',
				isBlocked: false,
			} as AdminUserEntityReference;
			let passport: AdminUserReservationRequestPassport;

			Given('I create an admin user reservation request passport', () => {
				passport = new AdminUserReservationRequestPassport(mockUser);
			});

			When('I check the passport', () => {
				// Check passport
			});

			Then('it should be defined', () => {
				expect(passport).toBeDefined();
				expect(passport).toBeInstanceOf(AdminUserReservationRequestPassport);
			});
		},
	);
});
