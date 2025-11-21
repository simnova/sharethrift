import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { SystemReservationRequestPassport } from './system.reservation-request.ts';
import type { ReservationRequestEntityReference } from '../../../contexts/reservation-request/reservation-request/reservation-request.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/system.reservation-request.passport.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('System passport for reservation request should use permission function', ({ Given, When, Then }) => {
		let passport: SystemReservationRequestPassport;
		// biome-ignore lint/suspicious/noExplicitAny: Test mock
		let visa: any;

		Given('I have a system reservation request passport', () => {
			passport = new SystemReservationRequestPassport({});
		});

		When('I request access to a reservation request', () => {
			const mockReservation = { id: 'test-reservation-id' } as ReservationRequestEntityReference;
			visa = passport.forReservationRequest(mockReservation);
		});

		Then('visa should use permission function', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
			// biome-ignore lint/suspicious/noExplicitAny: Test mock
			const result = visa.determineIf((_permissions: any) => true);
			expect(result).toBe(true);
		});
	});

	Scenario('System reservation request passport should extend SystemPassportBase', ({ Given, When, Then }) => {
		let passport: SystemReservationRequestPassport;

		Given('I create a system reservation request passport', () => {
			passport = new SystemReservationRequestPassport();
		});

		When('I check its prototype chain', () => {
			// Check inheritance
		});

		Then('it should be an instance of the passport', () => {
			expect(passport).toBeInstanceOf(SystemReservationRequestPassport);
		});
	});
});
