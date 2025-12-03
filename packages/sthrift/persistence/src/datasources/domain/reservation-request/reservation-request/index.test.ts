import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as ReservationRequestIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Background, Scenario }) => {
	let mockModels: never;
	let mockPassport: never;

	Background(({ Given, And }) => {
		Given('a valid models context with ReservationRequest model', () => {
			mockModels = {
				ReservationRequest: {
					ReservationRequest: {} as never,
				},
			} as never;
		});

		And('a valid passport for domain operations', () => {
			mockPassport = {} as never;
		});
	});

	Scenario('Creating Reservation Request Persistence', ({ When, Then, And }) => {
		let result: ReturnType<typeof ReservationRequestIndex.ReservationRequestPersistence>;

		When('I call ReservationRequestPersistence with models and passport', () => {
			result = ReservationRequestIndex.ReservationRequestPersistence(mockModels, mockPassport);
		});

		Then('I should receive an object with ReservationRequestUnitOfWork property', () => {
			expect(result).toBeDefined();
			expect(result.ReservationRequestUnitOfWork).toBeDefined();
		});

		And('the ReservationRequestUnitOfWork should be properly initialized', () => {
			expect(result.ReservationRequestUnitOfWork).toBeDefined();
		});
	});

	Scenario('ReservationRequestPersistence exports', ({ Then, And }) => {
		Then('ReservationRequestPersistence should be exported from index', () => {
			expect(ReservationRequestIndex.ReservationRequestPersistence).toBeDefined();
		});

		And('ReservationRequestPersistence should be a function', () => {
			expect(typeof ReservationRequestIndex.ReservationRequestPersistence).toBe('function');
		});
	});
});
