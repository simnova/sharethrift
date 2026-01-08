import type { DataSources } from '@sthrift/persistence';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { queryActiveByReserverIdAndListingId } from './query-active-by-reserver-id-and-listing-id.ts';

describe('ReservationRequest queryActiveByReserverIdAndListingId', () => {
	// biome-ignore lint/suspicious/noExplicitAny: Test mock type
	let mockDataSources: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock function
	let mockGetActiveByReserverIdAndListingId: any;

	beforeEach(() => {
		mockGetActiveByReserverIdAndListingId = vi.fn().mockResolvedValue(null);

		mockDataSources = {
			readonlyDataSource: {
				ReservationRequest: {
					ReservationRequest: {
						ReservationRequestReadRepo: {
							getActiveByReserverIdAndListingId:
								mockGetActiveByReserverIdAndListingId,
						},
					},
				},
			},
		} as DataSources;
	});

	it('should query active reservation by reserver ID and listing ID without fields', async () => {
		const mockReservation = {
			id: 'reservation-123',
			reserverId: 'reserver-456',
			listingId: 'listing-789',
		};

		mockGetActiveByReserverIdAndListingId.mockResolvedValue(mockReservation);

		const query = queryActiveByReserverIdAndListingId(mockDataSources);
		const result = await query({
			reserverId: 'reserver-456',
			listingId: 'listing-789',
		});

		expect(result).toEqual(mockReservation);
		expect(mockGetActiveByReserverIdAndListingId).toHaveBeenCalledWith(
			'reserver-456',
			'listing-789',
			{ fields: undefined },
		);
	});

	it('should query active reservation with specific fields', async () => {
		const mockReservation = {
			id: 'reservation-123',
			reserverId: 'reserver-456',
			listingId: 'listing-789',
			status: 'Active',
		};

		mockGetActiveByReserverIdAndListingId.mockResolvedValue(mockReservation);

		const query = queryActiveByReserverIdAndListingId(mockDataSources);
		const result = await query({
			reserverId: 'reserver-456',
			listingId: 'listing-789',
			fields: ['id', 'status', 'reservationPeriod'],
		});

		expect(result).toEqual(mockReservation);
		expect(mockGetActiveByReserverIdAndListingId).toHaveBeenCalledWith(
			'reserver-456',
			'listing-789',
			{ fields: ['id', 'status', 'reservationPeriod'] },
		);
	});

	it('should return null when no active reservation exists', async () => {
		mockGetActiveByReserverIdAndListingId.mockResolvedValue(null);

		const query = queryActiveByReserverIdAndListingId(mockDataSources);
		const result = await query({
			reserverId: 'reserver-999',
			listingId: 'listing-999',
		});

		expect(result).toBeNull();
	});

	it('should handle empty fields array', async () => {
		const query = queryActiveByReserverIdAndListingId(mockDataSources);
		await query({
			reserverId: 'reserver-123',
			listingId: 'listing-456',
			fields: [],
		});

		expect(mockGetActiveByReserverIdAndListingId).toHaveBeenCalledWith(
			'reserver-123',
			'listing-456',
			{ fields: [] },
		);
	});
});
