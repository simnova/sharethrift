import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as ValueObjects from './reservation-request.value-objects.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/reservation-request.value-objects.feature'),
);

test.for(feature, ({ Scenario }) => {
	// ReservationPeriodStart
	Scenario('Creating a ReservationPeriodStart with a valid value', ({ When, Then }) => {
		let value: string;
		When('I create a ReservationPeriodStart with "2025-10-15T10:00:00Z"', () => {
			value = new ValueObjects.ReservationPeriodStart('2025-10-15T10:00:00Z').valueOf();
		});
		Then('the value should be "2025-10-15T10:00:00Z"', () => {
			expect(value).toBe('2025-10-15T10:00:00Z');
		});
	});

	Scenario('Creating a ReservationPeriodStart with null', ({ When, Then }) => {
		let createNull: () => void;
		When('I try to create a ReservationPeriodStart with null', () => {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock data
			createNull = () => new ValueObjects.ReservationPeriodStart(null as any).valueOf();
		});
		Then('an error should be thrown indicating the value is invalid', () => {
			expect(createNull).toThrow();
		});
	});



	// ReservationPeriodEnd
	Scenario('Creating a ReservationPeriodEnd with a valid value', ({ When, Then }) => {
		let value: string;
		When('I create a ReservationPeriodEnd with "2025-10-20T10:00:00Z"', () => {
			value = new ValueObjects.ReservationPeriodEnd('2025-10-20T10:00:00Z').valueOf();
		});
		Then('the value should be "2025-10-20T10:00:00Z"', () => {
			expect(value).toBe('2025-10-20T10:00:00Z');
		});
	});

	Scenario('Creating a ReservationPeriodEnd with null', ({ When, Then }) => {
		let createNull: () => void;
		When('I try to create a ReservationPeriodEnd with null', () => {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock data
			createNull = () => new ValueObjects.ReservationPeriodEnd(null as any).valueOf();
		});
		Then('an error should be thrown indicating the value is invalid', () => {
			expect(createNull).toThrow();
		});
	});



	// ReservationRequestStateValue
	Scenario('Creating a ReservationRequestStateValue with a valid state', ({ When, Then }) => {
		let value: string;
		When('I create a ReservationRequestStateValue with "Requested"', () => {
			value = new ValueObjects.ReservationRequestStateValue('Requested').valueOf();
		});
		Then('the value should be "Requested"', () => {
			expect(value).toBe('Requested');
		});
	});

	Scenario('Creating a ReservationRequestStateValue with another valid state', ({ When, Then }) => {
		let value: string;
		When('I create a ReservationRequestStateValue with "Accepted"', () => {
			value = new ValueObjects.ReservationRequestStateValue('Accepted').valueOf();
		});
		Then('the value should be "Accepted"', () => {
			expect(value).toBe('Accepted');
		});
	});

	Scenario('Creating a ReservationRequestStateValue with an invalid state', ({ When, Then }) => {
		let createInvalid: () => void;
		When('I try to create a ReservationRequestStateValue with "Pending"', () => {
			createInvalid = () => new ValueObjects.ReservationRequestStateValue('Pending').valueOf();
		});
		Then('an error should be thrown indicating the state is invalid', () => {
			expect(createInvalid).toThrow('Invalid state: Pending');
		});
	});

	Scenario('Creating a ReservationRequestStateValue with null', ({ When, Then }) => {
		let createNull: () => void;
		When('I try to create a ReservationRequestStateValue with null', () => {
			// biome-ignore lint/suspicious/noExplicitAny: Test mock data
			createNull = () => new ValueObjects.ReservationRequestStateValue(null as any).valueOf();
		});
		Then('an error should be thrown indicating the value is invalid', () => {
			expect(createNull).toThrow();
		});
	});

	Scenario('Creating a ReservationRequestStateValue with an empty string', ({ When, Then }) => {
		let createEmpty: () => void;
		When('I try to create a ReservationRequestStateValue with an empty string', () => {
			createEmpty = () => new ValueObjects.ReservationRequestStateValue('').valueOf();
		});
		Then('an error should be thrown indicating the value is invalid', () => {
			expect(createEmpty).toThrow();
		});
	});
});
