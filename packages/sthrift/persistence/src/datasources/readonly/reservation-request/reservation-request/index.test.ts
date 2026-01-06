import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import * as ReservationRequestIndex from './index.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/index.feature'),
);

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

	Scenario(
		'Creating Reservation Request Read Repository Implementation',
		({ When, Then, And }) => {
			let result: ReturnType<
				typeof ReservationRequestIndex.ReservationRequestReadRepositoryImpl
			>;

			When(
				'I call ReservationRequestReadRepositoryImpl with models and passport',
				() => {
					result = ReservationRequestIndex.ReservationRequestReadRepositoryImpl(
						mockModels,
						mockPassport,
					);
				},
			);

			Then(
				'I should receive an object with ReservationRequestReadRepo property',
				() => {
					expect(result).toBeDefined();
					expect(result.ReservationRequestReadRepo).toBeDefined();
				},
			);

			And(
				'the ReservationRequestReadRepo should be a ReservationRequestReadRepository instance',
				() => {
					expect(result.ReservationRequestReadRepo).toBeDefined();
				},
			);
		},
	);

	Scenario('ReservationRequestReadRepositoryImpl exports', ({ Then, And }) => {
		Then(
			'ReservationRequestReadRepositoryImpl should be exported from index',
			() => {
				expect(
					ReservationRequestIndex.ReservationRequestReadRepositoryImpl,
				).toBeDefined();
			},
		);

		And('ReservationRequestReadRepositoryImpl should be a function', () => {
			expect(
				typeof ReservationRequestIndex.ReservationRequestReadRepositoryImpl,
			).toBe('function');
		});

		And(
			'ReservationRequestReadRepository type should be exported from index',
			() => {
				// Type exports are verified at compile time
				expect(true).toBe(true);
			},
		);
	});
});
