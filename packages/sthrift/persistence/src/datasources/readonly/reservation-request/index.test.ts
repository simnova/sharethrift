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
	Scenario(
		'Exports from readonly reservation request context index',
		({ Then, And }) => {
			Then('the ReservationRequestContext function should be exported', () => {
				expect(ReservationRequestIndex.ReservationRequestContext).toBeDefined();
			});

			And('ReservationRequestContext should be a function', () => {
				expect(
					typeof ReservationRequestIndex.ReservationRequestContext,
				).toBe('function');
			});
		},
	);

	Scenario('Creating Reservation Request Read Context', ({ Given, And, When, Then }) => {
		let mockModels: ModelsContext;
		let mockPassport: Domain.Passport;
		let result: ReturnType<typeof ReservationRequestIndex.ReservationRequestContext>;

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

		When('I call ReservationRequestContext with models and passport', () => {
			result = ReservationRequestIndex.ReservationRequestContext(mockModels, mockPassport);
		});

		Then('it should return an object with ReservationRequest property', () => {
			expect(result.ReservationRequest).toBeDefined();
		});
	});
});
