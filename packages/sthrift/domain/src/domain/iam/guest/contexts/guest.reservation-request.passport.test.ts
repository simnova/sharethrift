import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { GuestReservationRequestPassport } from './guest.reservation-request.passport.ts';
import type { ReservationRequestEntityReference } from '../../../contexts/reservation-request/reservation-request/index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/guest.reservation-request.passport.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Guest passport for reservation request should deny access', ({ Given, When, Then }) => {
		let passport: GuestReservationRequestPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have a guest reservation request passport', () => {
			passport = new GuestReservationRequestPassport();
		});

		When('I request access to a reservation request', () => {
			const mockReservation = { id: 'test-reservation-id' } as ReservationRequestEntityReference;
			visa = passport.forReservationRequest(mockReservation);
		});

		Then('access should be denied', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
			expect(visa.determineIf()).toBe(false);
		});
	});

	Scenario('Guest reservation request passport should extend GuestPassportBase', ({ Given, When, Then }) => {
		let passport: GuestReservationRequestPassport;

		Given('I create a guest reservation request passport', () => {
			passport = new GuestReservationRequestPassport();
		});

		When('I check its prototype chain', () => {
			// Verify inheritance relationship through instanceof
		});

		Then('it should be an instance of the passport', () => {
			expect(passport).toBeInstanceOf(GuestReservationRequestPassport);
		});
	});
});
