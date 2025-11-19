import { describe, expect, it, vi } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import { unblock } from '../unblock.ts';

describe('ItemListing Unblock Command', () => {
	it('should successfully unblock a listing', async () => {
		// Arrange
		const mockListing = {
			setBlocked: vi.fn(),
		};

		const mockUpdatedRef = { id: 'listing-123', isBlocked: false };

		const mockRepo = {
			getById: vi.fn().mockResolvedValue(mockListing),
			save: vi.fn().mockResolvedValue(mockUpdatedRef),
		};

		const mockUow = {
			withScopedTransaction: vi.fn(async (callback) => {
				await callback(mockRepo);
			}),
		};

		const mockDataSources = {
			domainDataSource: {
				Listing: {
					ItemListing: {
						ItemListingUnitOfWork: mockUow,
					},
				},
			},
		} as unknown as DataSources;

		// Act
		const result = await unblock(mockDataSources)({
			id: 'listing-123',
		});

		// Assert
		expect(result).toEqual(mockUpdatedRef);
		expect(mockRepo.getById).toHaveBeenCalledWith('listing-123');
		expect(mockListing.setBlocked).toHaveBeenCalledWith(false);
		expect(mockRepo.save).toHaveBeenCalledWith(mockListing);
	});

	it('should throw error when listing is not found', async () => {
		// Arrange
		const mockRepo = {
			getById: vi.fn().mockResolvedValue(null),
		};

		const mockUow = {
			withScopedTransaction: vi.fn(async (callback) => {
				await callback(mockRepo);
			}),
		};

		const mockDataSources = {
			domainDataSource: {
				Listing: {
					ItemListing: {
						ItemListingUnitOfWork: mockUow,
					},
				},
			},
		} as unknown as DataSources;

		// Act & Assert
		await expect(
			unblock(mockDataSources)({
				id: 'listing-123',
			}),
		).rejects.toThrow('Listing not found');
	});

	it('should throw error when save returns undefined', async () => {
		// Arrange
		const mockListing = {
			setBlocked: vi.fn(),
		};

		const mockRepo = {
			getById: vi.fn().mockResolvedValue(mockListing),
			save: vi.fn().mockResolvedValue(undefined),
		};

		const mockUow = {
			withScopedTransaction: vi.fn(async (callback) => {
				await callback(mockRepo);
			}),
		};

		const mockDataSources = {
			domainDataSource: {
				Listing: {
					ItemListing: {
						ItemListingUnitOfWork: mockUow,
					},
				},
			},
		} as unknown as DataSources;

		// Act & Assert
		await expect(
			unblock(mockDataSources)({
				id: 'listing-123',
			}),
		).rejects.toThrow('ItemListing not updated');
	});
});
