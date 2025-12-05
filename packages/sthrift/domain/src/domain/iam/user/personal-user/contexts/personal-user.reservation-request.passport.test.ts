import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserReservationRequestPassport } from './personal-user.reservation-request.passport.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';
import type { ReservationRequestEntityReference } from '../../../../contexts/reservation-request/reservation-request/reservation-request.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.reservation-request.passport.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Personal user can access reservation requests', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		let passport: PersonalUserReservationRequestPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have a personal user reservation request passport', () => {
			passport = new PersonalUserReservationRequestPassport(mockUser);
		});

		When('I request access to a reservation request', () => {
			const mockReservation = {
				id: 'reservation-1',
				listing: { sharer: { id: 'user-123' } },
				reserver: { id: 'user-456' },
			} as ReservationRequestEntityReference;
			visa = passport.forReservationRequest(mockReservation);
		});

		Then('visa should be created with permission function', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
		});
	});

	Scenario('Personal user reservation passport is defined', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		let passport: PersonalUserReservationRequestPassport;

		Given('I create a personal user reservation request passport', () => {
			passport = new PersonalUserReservationRequestPassport(mockUser);
		});

		When('I check the passport', () => {
			// Check passport
		});

		Then('it should be defined', () => {
			expect(passport).toBeDefined();
			expect(passport).toBeInstanceOf(PersonalUserReservationRequestPassport);
		});
	});
});
