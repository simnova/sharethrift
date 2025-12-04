import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as ReservationRequestIndex from './index.ts';
import type { ModelsContext } from '../../../models-context.ts';
import type { Domain } from '@sthrift/domain';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(path.resolve(__dirname, 'features/index.feature'));

test.for(feature, ({ Scenario }) => {
	Scenario('Exports from reservation request context index', ({ Then, And }) => {
		Then('the ReservationRequestContextPersistence function should be exported', () => {
			expect(ReservationRequestIndex.ReservationRequestContextPersistence).toBeDefined();
		});

		And('ReservationRequestContextPersistence should be a function', () => {
			expect(typeof ReservationRequestIndex.ReservationRequestContextPersistence).toBe('function');
		});
	});

	Scenario('Creating Reservation Request Context Persistence', ({ Given, And, When, Then }) => {
		let mockModels: ModelsContext;
		let mockPassport: Domain.Passport;
		let result: ReturnType<typeof ReservationRequestIndex.ReservationRequestContextPersistence>;

		Given('a mock ModelsContext with ReservationRequest models', () => {
			mockModels = {
				ReservationRequest: {
					ReservationRequest: {} as unknown,
				},
			} as ModelsContext;
		});

		And('a mock Passport', () => {
			mockPassport = {} as Domain.Passport;
		});

		When('I call ReservationRequestContextPersistence with models and passport', () => {
			result = ReservationRequestIndex.ReservationRequestContextPersistence(mockModels, mockPassport);
		});

		Then('it should return an object with ReservationRequest property', () => {
			expect(result.ReservationRequest).toBeDefined();
		});
	});
});
