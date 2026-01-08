import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteExpiredReservationRequests } from './delete-expired.ts';

describe('deleteExpiredReservationRequests', () => {
	let mockDataSources: DataSources;
	let mockExpiredRequests: Domain.Contexts.ReservationRequest.ReservationRequest.ReservationRequestEntityReference[];
	let mockRequest: any;
	let mockRepo: any;

	beforeEach(() => {
		// Create mock expired reservation requests
		const sixMonthsOneDay = new Date();
		sixMonthsOneDay.setMonth(sixMonthsOneDay.getMonth() - 6);
		sixMonthsOneDay.setDate(sixMonthsOneDay.getDate() - 1);

		mockExpiredRequests = [
			{
				id: 'expired-req-1',
				state: 'Closed',
				updatedAt: sixMonthsOneDay,
				createdAt: new Date('2023-01-01'),
				schemaVersion: '1.0.0',
				reservationPeriodStart: new Date('2023-02-01'),
				reservationPeriodEnd: new Date('2023-02-10'),
				listing: { id: 'listing-1' } as any,
				reserver: { id: 'user-1' } as any,
				closeRequestedBySharer: true,
				closeRequestedByReserver: true,
				loadListing: vi.fn(),
				loadReserver: vi.fn(),
			},
			{
				id: 'expired-req-2',
				state: 'Closed',
				updatedAt: sixMonthsOneDay,
				createdAt: new Date('2023-01-15'),
				schemaVersion: '1.0.0',
				reservationPeriodStart: new Date('2023-03-01'),
				reservationPeriodEnd: new Date('2023-03-10'),
				listing: { id: 'listing-2' } as any,
				reserver: { id: 'user-2' } as any,
				closeRequestedBySharer: true,
				closeRequestedByReserver: true,
				loadListing: vi.fn(),
				loadReserver: vi.fn(),
			},
		];

		// Create mock request with requestDelete method
		mockRequest = {
			id: 'test-id',
			requestDelete: vi.fn(),
			isDeleted: false,
		};

		// Create mock repository
		mockRepo = {
			get: vi.fn().mockResolvedValue(mockRequest),
			save: vi.fn().mockResolvedValue(undefined),
		};

		// Create mock unit of work
		const mockUow = {
			withScopedTransaction: vi.fn(async (callback: any) => {
				return await callback(mockRepo);
			}),
		};

		// Create mock data sources
		mockDataSources = {
			domainDataSource: {
				ReservationRequest: {
					ReservationRequest: {
						ReservationRequestUnitOfWork: mockUow,
					},
				},
			},
			readonlyDataSource: {
				ReservationRequest: {
					ReservationRequest: {
						ReservationRequestReadRepo: {
							getExpiredClosed: vi.fn().mockResolvedValue(mockExpiredRequests),
						},
					},
				},
			},
		} as any;
	});

	it('should delete expired reservation requests', async () => {
		const deleteService = deleteExpiredReservationRequests(mockDataSources);
		const deletedCount = await deleteService();

		expect(deletedCount).toBe(2);
		expect(
			mockDataSources.readonlyDataSource.ReservationRequest.ReservationRequest
				.ReservationRequestReadRepo.getExpiredClosed,
		).toHaveBeenCalled();
		expect(mockRequest.requestDelete).toHaveBeenCalledTimes(2);
		expect(mockRepo.save).toHaveBeenCalledTimes(2);
	});

	it('should return 0 when no expired requests are found', async () => {
		mockDataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getExpiredClosed =
			vi.fn().mockResolvedValue([]);

		const deleteService = deleteExpiredReservationRequests(mockDataSources);
		const deletedCount = await deleteService();

		expect(deletedCount).toBe(0);
		expect(mockRequest.requestDelete).not.toHaveBeenCalled();
		expect(mockRepo.save).not.toHaveBeenCalled();
	});

	it('should continue deleting even if one request fails', async () => {
		let callCount = 0;
		mockRepo.get = vi.fn().mockImplementation(() => {
			callCount++;
			if (callCount === 1) {
				throw new Error('Failed to get request');
			}
			return mockRequest;
		});

		const deleteService = deleteExpiredReservationRequests(mockDataSources);
		const deletedCount = await deleteService();

		// Should have successfully deleted the second request
		expect(deletedCount).toBe(1);
		expect(mockRepo.get).toHaveBeenCalledTimes(2);
	});

	it('should throw error if UnitOfWork is not available', async () => {
		mockDataSources.domainDataSource.ReservationRequest.ReservationRequest.ReservationRequestUnitOfWork =
			undefined as any;

		const deleteService = deleteExpiredReservationRequests(mockDataSources);

		await expect(deleteService()).rejects.toThrow(
			'ReservationRequestUnitOfWork not available',
		);
	});
});
