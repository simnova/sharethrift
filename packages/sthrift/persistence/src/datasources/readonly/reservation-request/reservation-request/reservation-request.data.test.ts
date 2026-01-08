import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Model } from 'mongoose';
import { expect } from 'vitest';
import { ReservationRequestDataSourceImpl } from './reservation-request.data.ts';

const test = { for: describeFeature };
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feature = await loadFeature(
	path.resolve(__dirname, 'features/reservation-request.data.feature'),
);

test.for(feature, ({ Scenario, Background }) => {
	let mockModel: Model<Models.ReservationRequest.ReservationRequest>;
	let dataSource: ReservationRequestDataSourceImpl;
	Background(({ Given }) => {
		Given('a Mongoose ReservationRequest model', () => {
			mockModel = {} as Model<Models.ReservationRequest.ReservationRequest>;
		});
	});

	Scenario('Instantiate data source with a model', ({ When, Then, And }) => {
		When('I create a ReservationRequestDataSource with the model', () => {
			dataSource = new ReservationRequestDataSourceImpl(mockModel);
		});

		Then('the data source instance should be defined', () => {
			expect(dataSource).toBeDefined();
		});

		And(
			'the data source instance should be a ReservationRequestDataSourceImpl',
			() => {
				expect(dataSource).toBeInstanceOf(ReservationRequestDataSourceImpl);
			},
		);
	});

	Scenario('Exposes find method', ({ Given, Then }) => {
		let dataSource: ReservationRequestDataSourceImpl;

		Given('a ReservationRequestDataSource instance', () => {
			const mockModel =
				{} as Model<Models.ReservationRequest.ReservationRequest>;
			dataSource = new ReservationRequestDataSourceImpl(mockModel);
		});

		Then('it should have a "find" method', () => {
			expect(typeof dataSource.find).toBe('function');
		});
	});

	Scenario('Exposes findById method', ({ Given, Then }) => {
		let dataSource: ReservationRequestDataSourceImpl;

		Given('a ReservationRequestDataSource instance', () => {
			const mockModel =
				{} as Model<Models.ReservationRequest.ReservationRequest>;
			dataSource = new ReservationRequestDataSourceImpl(mockModel);
		});

		Then('it should have a "findById" method', () => {
			expect(typeof dataSource.findById).toBe('function');
		});
	});

	Scenario('Exposes findOne method', ({ Given, Then }) => {
		let dataSource: ReservationRequestDataSourceImpl;

		Given('a ReservationRequestDataSource instance', () => {
			const mockModel =
				{} as Model<Models.ReservationRequest.ReservationRequest>;
			dataSource = new ReservationRequestDataSourceImpl(mockModel);
		});

		Then('it should have a "findOne" method', () => {
			expect(typeof dataSource.findOne).toBe('function');
		});
	});
});
