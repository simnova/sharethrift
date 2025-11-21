import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { PersonalUserReservationRequestVisa } from './personal-user.reservation-request.visa.ts';
import type { PersonalUserEntityReference } from '../../../../contexts/user/personal-user/personal-user.entity.ts';
import type { ReservationRequestEntityReference } from '../../../../contexts/reservation-request/reservation-request/reservation-request.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/personal-user.reservation-request.visa.feature'),
);

test.for(feature, ({ Scenario }) => {
	Scenario('Reservation visa evaluates sharer permissions', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockReservation = {
			id: 'reservation-1',
			listing: { sharer: { id: 'user-123' } },
			reserver: { id: 'user-456' },
		} as ReservationRequestEntityReference;
		let visa: PersonalUserReservationRequestVisa<ReservationRequestEntityReference>;
		let canAccept: boolean;

		Given('I have a reservation visa as sharer', () => {
			visa = new PersonalUserReservationRequestVisa(mockReservation, mockUser);
		});

		When('I check accept permission', () => {
			canAccept = visa.determineIf((p) => p.canAcceptRequest);
		});

		Then('sharer can accept request', () => {
			expect(canAccept).toBe(true);
		});
	});

	Scenario('Reservation visa is created properly', ({ Given, When, Then }) => {
		const mockUser = { id: 'user-123', isBlocked: false } as PersonalUserEntityReference;
		const mockReservation = {
			id: 'reservation-1',
			listing: { sharer: { id: 'user-123' } },
			reserver: { id: 'user-456' },
		} as ReservationRequestEntityReference;
		let visa: PersonalUserReservationRequestVisa<ReservationRequestEntityReference>;

		Given('I create a reservation request visa', () => {
			visa = new PersonalUserReservationRequestVisa(mockReservation, mockUser);
		});

		When('I check the visa', () => {
			// Check visa
		});

		Then('it should have determineIf function', () => {
			expect(visa).toBeDefined();
			expect(visa.determineIf).toBeDefined();
			expect(typeof visa.determineIf).toBe('function');
		});
	});
});
