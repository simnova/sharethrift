import { describe, it, expect } from 'vitest';
import { ReservationRequestDataSourceImpl } from './reservation-request.data.ts';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Model } from 'mongoose';

describe('ReservationRequestDataSource', () => {
	it('should be instantiable with a model', () => {
		const mockModel = {} as Model<Models.ReservationRequest.ReservationRequest>;
		const dataSource = new ReservationRequestDataSourceImpl(mockModel);
		
		expect(dataSource).toBeDefined();
		expect(dataSource).toBeInstanceOf(ReservationRequestDataSourceImpl);
	});

	it('should have find method', () => {
		const mockModel = {} as Model<Models.ReservationRequest.ReservationRequest>;
		const dataSource = new ReservationRequestDataSourceImpl(mockModel);
		
		expect(typeof dataSource.find).toBe('function');
	});

	it('should have findById method', () => {
		const mockModel = {} as Model<Models.ReservationRequest.ReservationRequest>;
		const dataSource = new ReservationRequestDataSourceImpl(mockModel);
		
		expect(typeof dataSource.findById).toBe('function');
	});

	it('should have findOne method', () => {
		const mockModel = {} as Model<Models.ReservationRequest.ReservationRequest>;
		const dataSource = new ReservationRequestDataSourceImpl(mockModel);
		
		expect(typeof dataSource.findOne).toBe('function');
	});
});
