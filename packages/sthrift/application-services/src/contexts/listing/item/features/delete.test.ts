import { describe, expect, it, vi } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import { deleteListings } from '../delete.ts';

describe('ItemListing Delete Command', () => {
	it('should successfully delete a listing when user has permission and no active reservations', async () => {
		// Arrange
		const mockListing = {
			requestDelete: vi.fn(),
		};

		const mockRepo = {
			get: vi.fn().mockResolvedValue(mockListing),
			save: vi.fn().mockResolvedValue(undefined),
		};

		const mockUow = {
			withScopedTransaction: vi.fn(async (callback) => {
				await callback(mockRepo);
			}),
		};

		const mockUser = { id: 'user-123', email: 'test@example.com' };

		const mockDataSources = {
			domainDataSource: {
				Listing: {
					ItemListing: {
						ItemListingUnitOfWork: mockUow,
					},
				},
			},
			readonlyDataSource: {
				User: {
					PersonalUser: {
						PersonalUserReadRepo: {
							getByEmail: vi.fn().mockResolvedValue(mockUser),
						},
					},
				},
				ReservationRequest: {
					ReservationRequest: {
						ReservationRequestReadRepo: {
							getActiveByListingId: vi.fn().mockResolvedValue([]),
						},
					},
				},
			},
		} as unknown as DataSources;

		// Act
		const result = await deleteListings(mockDataSources)({
			id: 'listing-123',
			userEmail: 'test@example.com',
		});

		// Assert
		expect(result).toBe(true);
		expect(mockDataSources.readonlyDataSource.User.PersonalUser.PersonalUserReadRepo.getByEmail).toHaveBeenCalledWith('test@example.com');
		expect(mockDataSources.readonlyDataSource.ReservationRequest.ReservationRequest.ReservationRequestReadRepo.getActiveByListingId).toHaveBeenCalledWith('listing-123');
		expect(mockRepo.get).toHaveBeenCalledWith('listing-123');
		expect(mockListing.requestDelete).toHaveBeenCalled();
		expect(mockRepo.save).toHaveBeenCalledWith(mockListing);
	});

	it('should throw error when user is not found', async () => {
		// Arrange
		const mockDataSources = {
			domainDataSource: {
				Listing: {
					ItemListing: {
						ItemListingUnitOfWork: {},
					},
				},
			},
			readonlyDataSource: {
				User: {
					PersonalUser: {
						PersonalUserReadRepo: {
							getByEmail: vi.fn().mockResolvedValue(null),
						},
					},
				},
			},
		} as unknown as DataSources;

		// Act & Assert
		await expect(
			deleteListings(mockDataSources)({
				id: 'listing-123',
				userEmail: 'test@example.com',
			}),
		).rejects.toThrow('User not found');
	});

	it('should throw error when listing has active reservation requests', async () => {
		// Arrange
		const mockUser = { id: 'user-123', email: 'test@example.com' };
		const mockActiveReservations = [{ id: 'reservation-1' }];

		const mockDataSources = {
			domainDataSource: {
				Listing: {
					ItemListing: {
						ItemListingUnitOfWork: {},
					},
				},
			},
			readonlyDataSource: {
				User: {
					PersonalUser: {
						PersonalUserReadRepo: {
							getByEmail: vi.fn().mockResolvedValue(mockUser),
						},
					},
				},
				ReservationRequest: {
					ReservationRequest: {
						ReservationRequestReadRepo: {
							getActiveByListingId: vi.fn().mockResolvedValue(mockActiveReservations),
						},
					},
				},
			},
		} as unknown as DataSources;

		// Act & Assert
		await expect(
			deleteListings(mockDataSources)({
				id: 'listing-123',
				userEmail: 'test@example.com',
			}),
		).rejects.toThrow('Cannot delete listing with active reservation requests');
	});

	it('should throw error when UnitOfWork is not available', async () => {
		// Arrange
		const mockDataSources = {
			domainDataSource: {
				Listing: {
					ItemListing: {
						ItemListingUnitOfWork: null,
					},
				},
			},
		} as unknown as DataSources;

		// Act & Assert
		await expect(
			deleteListings(mockDataSources)({
				id: 'listing-123',
				userEmail: 'test@example.com',
			}),
		).rejects.toThrow('ItemListingUnitOfWork not available');
	});
});
