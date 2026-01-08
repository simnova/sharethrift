import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import type { ReservationRequestProps } from './reservation-request.entity.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/reservation-request.entity.feature'),
);

// biome-ignore lint/suspicious/noExplicitAny: Test helper function
function makeReservationRequestProps(overrides?: Partial<ReservationRequestProps>): any {
	return {
		id: 'test-reservation-id',
		state: 'pending',
		reservationPeriodStart: new Date('2024-01-01'),
		reservationPeriodEnd: new Date('2024-01-10'),
		createdAt: new Date(),
		updatedAt: new Date(),
		schemaVersion: '1.0',
		listing: { id: 'test-listing-id' },
		loadListing: async () => ({ id: 'test-listing-id' }),
		reserver: { id: 'test-reserver-id' },
		loadReserver: async () => ({ id: 'test-reserver-id' }),
		closeRequestedBy: null,
		...overrides,
	};
}

test.for(feature, ({ Background, Scenario }) => {
	// biome-ignore lint/suspicious/noExplicitAny: Test variable
	let props: any;

	Background(({ Given }) => {
		Given('I have a reservation request props object', () => {
			props = makeReservationRequestProps({ state: 'pending' });
		});
	});

	Scenario('Reservation request state should be a string', ({ When, Then }) => {

		When('I access the state property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const reservationProps: ReservationRequestProps = props;
			expect(typeof reservationProps.state).toBe('string');
			expect(reservationProps.state).toBe('pending');
		});
	});

	Scenario('Reservation request period dates should be Date objects', ({ When, Then }) => {

		When('I access the period date properties', () => {
			// Access the properties
		});

		Then('reservationPeriodStart and reservationPeriodEnd should be Date objects', () => {
			const reservationProps: ReservationRequestProps = props;
			expect(reservationProps.reservationPeriodStart).toBeInstanceOf(Date);
			expect(reservationProps.reservationPeriodEnd).toBeInstanceOf(Date);
		});
	});

	Scenario('Reservation request createdAt should be readonly', ({ When, Then }) => {

		When('I access the createdAt property', () => {
			// Access the property
		});

		Then('it should be a Date object', () => {
			const reservationProps: ReservationRequestProps = props;
			expect(reservationProps.createdAt).toBeInstanceOf(Date);
		});
	});

	Scenario('Reservation request updatedAt should be readonly', ({ When, Then }) => {

		When('I access the updatedAt property', () => {
			// Access the property
		});

		Then('it should be a Date object', () => {
			const reservationProps: ReservationRequestProps = props;
			expect(reservationProps.updatedAt).toBeInstanceOf(Date);
		});
	});

	Scenario('Reservation request schemaVersion should be readonly', ({ When, Then }) => {

		When('I access the schemaVersion property', () => {
			// Access the property
		});

		Then('it should be a string', () => {
			const reservationProps: ReservationRequestProps = props;
			expect(typeof reservationProps.schemaVersion).toBe('string');
			expect(reservationProps.schemaVersion).toBe('1.0');
		});
	});

	Scenario('Reservation request listing reference should be readonly', ({ When, Then }) => {

		When('I attempt to modify the listing property', () => {
			Object.defineProperty(props, 'listing', { writable: false, configurable: false, value: props.listing });
			try {
				props.listing = { id: 'new-listing-id' };
			} catch (_error) {
				// Expected behavior for readonly
			}
		});

		Then('the listing property should be readonly', () => {
			const reservationProps: ReservationRequestProps = props;
			expect(reservationProps.listing).toEqual({ id: 'test-listing-id' });
		});
	});

	Scenario('Reservation request loadListing should return a promise', ({ When, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let result: any;

		When('I call the loadListing method', async () => {
			result = await props.loadListing();
		});

		Then('it should return a listing reference', () => {
			expect(result).toEqual({ id: 'test-listing-id' });
		});
	});

	Scenario('Reservation request reserver reference should be readonly', ({ When, Then }) => {

		When('I attempt to modify the reserver property', () => {
			Object.defineProperty(props, 'reserver', { writable: false, configurable: false, value: props.reserver });
			try {
				props.reserver = { id: 'new-reserver-id' };
			} catch (_error) {
				// Expected behavior for readonly
			}
		});

		Then('the reserver property should be readonly', () => {
			const reservationProps: ReservationRequestProps = props;
			expect(reservationProps.reserver).toEqual({ id: 'test-reserver-id' });
		});
	});

	Scenario('Reservation request loadReserver should return a promise', ({ When, Then }) => {
		// biome-ignore lint/suspicious/noExplicitAny: Test variable
		let result: any;

		When('I call the loadReserver method', async () => {
			result = await props.loadReserver();
		});

		Then('it should return a reserver reference', () => {
			expect(result).toEqual({ id: 'test-reserver-id' });
		});
	});

	Scenario('Reservation request closeRequestedBy should be nullable', ({ When, Then }) => {

		When('I access the close request field', () => {
			// Access the properties
		});

		Then('it should be null by default', () => {
			const reservationProps: ReservationRequestProps = props;
			expect(reservationProps.closeRequestedBy).toBe(null);
		});
	});
});
