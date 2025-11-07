import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReservationRequestReadRepositoryImpl } from './reservation-request.read-repository.ts';
import type { ModelsContext } from '../../../../models-context.ts';
import type { Domain } from '@sthrift/domain';

describe('ReservationRequestReadRepository', () => {
	let repository: ReservationRequestReadRepositoryImpl;
	let mockModels: ModelsContext;
	let mockPassport: Domain.Passport;

	beforeEach(() => {
		// Create minimal mocks
		mockModels = {
			ReservationRequest: {
				ReservationRequest: {} as any,
			},
		} as ModelsContext;

		mockPassport = {} as Domain.Passport;

		repository = new ReservationRequestReadRepositoryImpl(mockModels, mockPassport);
	});

	it('should be instantiated correctly', () => {
		expect(repository).toBeDefined();
		expect(repository).toBeInstanceOf(ReservationRequestReadRepositoryImpl);
	});

	it('should have getAll method', () => {
		expect(typeof repository.getAll).toBe('function');
	});

	it('should have getById method', () => {
		expect(typeof repository.getById).toBe('function');
	});

	it('should have getByReserverId method', () => {
		expect(typeof repository.getByReserverId).toBe('function');
	});

	it('should have getActiveByReserverIdWithListingWithSharer method', () => {
		expect(typeof repository.getActiveByReserverIdWithListingWithSharer).toBe('function');
	});

	it('should have getPastByReserverIdWithListingWithSharer method', () => {
		expect(typeof repository.getPastByReserverIdWithListingWithSharer).toBe('function');
	});

	it('should have getListingRequestsBySharerId method', () => {
		expect(typeof repository.getListingRequestsBySharerId).toBe('function');
	});

	it('should have getActiveByReserverIdAndListingId method', () => {
		expect(typeof repository.getActiveByReserverIdAndListingId).toBe('function');
	});

	it('should have getOverlapActiveReservationRequestsForListing method', () => {
		expect(typeof repository.getOverlapActiveReservationRequestsForListing).toBe('function');
	});

	it('should have getActiveByListingId method', () => {
		expect(typeof repository.getActiveByListingId).toBe('function');
	});

	it('should return mock data for getActiveByReserverIdWithListingWithSharer', async () => {
		const reserverId = 'test-reserver-id';
		const result = await repository.getActiveByReserverIdWithListingWithSharer(reserverId);
		
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(result[0]).toHaveProperty('id');
		expect(result[0]).toHaveProperty('state');
		expect(result[0]).toHaveProperty('reserver');
		expect(result[0]).toHaveProperty('listing');
	});

	it('should return mock data for getPastByReserverIdWithListingWithSharer', async () => {
		const reserverId = 'test-reserver-id';
		const result = await repository.getPastByReserverIdWithListingWithSharer(reserverId);
		
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(result[0].state).toBe('Closed');
	});

	it('should return mock data for getListingRequestsBySharerId', async () => {
		const sharerId = 'test-sharer-id';
		const result = await repository.getListingRequestsBySharerId(sharerId);
		
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(result[0]).toHaveProperty('listing');
		expect(result[0].listing.sharer.id).toBe(sharerId);
	});

	it('should return mock data for getActiveByListingId', async () => {
		const listingId = 'test-listing-id';
		const result = await repository.getActiveByListingId(listingId);
		
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
	});
});
