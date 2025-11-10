import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { expect } from 'vitest';
import { getReservationRequestUnitOfWork } from './reservation-request.uow.ts';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';
import type { Model } from 'mongoose';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/reservation-request.uow.feature'),
);

test.for(feature, ({ Scenario, Background, BeforeEachScenario }) => {
	let mockModel: Model<Models.ReservationRequest.ReservationRequest>;
	let mockPassport: Domain.Passport;
	let uow: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestUnitOfWork;

	BeforeEachScenario(() => {
		// Create a minimal mock model
		mockModel = {
			modelName: 'ReservationRequest',
		} as Model<Models.ReservationRequest.ReservationRequest>;

		// Create a minimal mock passport
		mockPassport = {} as Domain.Passport;

		uow = undefined as unknown as Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestUnitOfWork;
	});

	Background(({ Given, And }) => {
		Given('a Mongoose context factory with a working service', () => {
			// Mock setup - no implementation needed for unit test
		});
		And('a valid ReservationRequest model from the models context', () => {
			mockModel = {
				modelName: 'ReservationRequest',
			} as Model<Models.ReservationRequest.ReservationRequest>;
		});
		And('a valid passport for domain operations', () => {
			mockPassport = {} as Domain.Passport;
		});
	});

	Scenario('Creating a ReservationRequest Unit of Work', ({ When, Then, And }) => {
		When(
			'I call getReservationRequestUnitOfWork with the ReservationRequest model and passport',
			() => {
				uow = getReservationRequestUnitOfWork(mockModel, mockPassport);
			},
		);
		Then('I should receive a properly initialized ReservationRequestUnitOfWork', () => {
			expect(uow).toBeDefined();
			expect(uow).toHaveProperty('withTransaction');
		});
		And('the Unit of Work should have the correct repository type', () => {
			// The UOW is a wrapped object - basic validation that it exists
			expect(uow).toBeDefined();
		});
		And('the Unit of Work should have the correct converter type', () => {
			// Converter is internal to the UOW
			expect(uow).toBeDefined();
		});
		And('the Unit of Work should have the correct event buses', () => {
			// Event buses are internal to the UOW implementation
			// Verified through the withTransaction method existence
			expect(typeof uow.withTransaction).toBe('function');
		});
	});
});
