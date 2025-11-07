import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReservationRequestRepository } from './reservation-request.repository.ts';
import { ReservationRequestConverter } from './reservation-request.domain-adapter.ts';
import type { Models } from '@sthrift/data-sources-mongoose-models';
import type { Domain } from '@sthrift/domain';
import type { Model } from 'mongoose';

describe('ReservationRequestRepository', () => {
	let repository: ReservationRequestRepository;
	let mockModel: Partial<Model<Models.ReservationRequest.ReservationRequest>>;
	let mockPassport: Domain.Passport;
	let mockConverter: ReservationRequestConverter;

	beforeEach(() => {
		// Create minimal mocks
		mockModel = {};
		mockPassport = {} as Domain.Passport;
		mockConverter = new ReservationRequestConverter();

		repository = new ReservationRequestRepository(
			mockModel as Model<Models.ReservationRequest.ReservationRequest>,
			mockConverter,
			mockPassport,
		);
	});

	it('should be instantiated with correct parameters', () => {
		expect(repository).toBeDefined();
		expect(repository).toBeInstanceOf(ReservationRequestRepository);
	});

	it('should have getById method', () => {
		expect(typeof repository.getById).toBe('function');
	});

	it('should have getAll method', () => {
		expect(typeof repository.getAll).toBe('function');
	});

	it('should have getNewInstance method', () => {
		expect(typeof repository.getNewInstance).toBe('function');
	});

	it('should have getByReserverId method', () => {
		expect(typeof repository.getByReserverId).toBe('function');
	});

	it('should have getByListingId method', () => {
		expect(typeof repository.getByListingId).toBe('function');
	});
});
