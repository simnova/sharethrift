import { describe, expect, it, vi } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import { update } from '../update.ts';

describe('ItemListing Update Command', () => {
	it('should successfully update listing title', async () => {
		// Arrange
		const mockListing = {
			title: 'Old Title',
		};

		const mockUpdatedRef = { id: 'listing-123', title: 'New Title' };

		const mockRepo = {
			get: vi.fn().mockResolvedValue(mockListing),
			save: vi.fn().mockResolvedValue(mockUpdatedRef),
		};

		const mockUow = {
			withScopedTransactionById: vi.fn(async (_id, callback) => {
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
		const result = await update(mockDataSources)({
			id: 'listing-123',
			title: 'New Title',
		});

		// Assert
		expect(result).toEqual(mockUpdatedRef);
		expect(mockListing.title).toBe('New Title');
		expect(mockRepo.save).toHaveBeenCalledWith(mockListing);
	});

	it('should successfully update multiple fields', async () => {
		// Arrange
		const mockListing = {
			title: 'Old Title',
			description: 'Old Description',
			category: 'Old Category',
			location: 'Old Location',
		};

		const mockUpdatedRef = { id: 'listing-123' };

		const mockRepo = {
			get: vi.fn().mockResolvedValue(mockListing),
			save: vi.fn().mockResolvedValue(mockUpdatedRef),
		};

		const mockUow = {
			withScopedTransactionById: vi.fn(async (_id, callback) => {
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
		const result = await update(mockDataSources)({
			id: 'listing-123',
			title: 'New Title',
			description: 'New Description',
			category: 'New Category',
			location: 'New Location',
		});

		// Assert
		expect(result).toEqual(mockUpdatedRef);
		expect(mockListing.title).toBe('New Title');
		expect(mockListing.description).toBe('New Description');
		expect(mockListing.category).toBe('New Category');
		expect(mockListing.location).toBe('New Location');
	});

	it('should successfully update sharing period dates', async () => {
		// Arrange
		const startDate = new Date('2025-10-10');
		const endDate = new Date('2025-12-10');

		const mockListing = {
			sharingPeriodStart: undefined,
			sharingPeriodEnd: undefined,
		};

		const mockUpdatedRef = { id: 'listing-123' };

		const mockRepo = {
			get: vi.fn().mockResolvedValue(mockListing),
			save: vi.fn().mockResolvedValue(mockUpdatedRef),
		};

		const mockUow = {
			withScopedTransactionById: vi.fn(async (_id, callback) => {
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
		const result = await update(mockDataSources)({
			id: 'listing-123',
			sharingPeriodStart: startDate,
			sharingPeriodEnd: endDate,
		});

		// Assert
		expect(result).toEqual(mockUpdatedRef);
		expect(mockListing.sharingPeriodStart).toEqual(startDate);
		expect(mockListing.sharingPeriodEnd).toEqual(endDate);
	});

	it('should convert string dates to Date objects', async () => {
		// Arrange
		const mockListing: { sharingPeriodStart: Date | undefined } = {
			sharingPeriodStart: undefined,
		};

		const mockUpdatedRef = { id: 'listing-123' };

		const mockRepo = {
			get: vi.fn().mockResolvedValue(mockListing),
			save: vi.fn().mockResolvedValue(mockUpdatedRef),
		};

		const mockUow = {
			withScopedTransactionById: vi.fn(async (_id, callback) => {
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
		await update(mockDataSources)({
			id: 'listing-123',
			sharingPeriodStart: '2025-10-10',
		});

		// Assert
		expect(mockListing.sharingPeriodStart).toBeInstanceOf(Date);
		expect((mockListing.sharingPeriodStart as Date).toISOString()).toContain('2025-10-10');
	});

	it('should throw error for invalid date string', async () => {
		// Arrange
		const mockDataSources = {
			domainDataSource: {
				Listing: {
					ItemListing: {
						ItemListingUnitOfWork: {},
					},
				},
			},
		} as unknown as DataSources;

		// Act & Assert
		await expect(
			update(mockDataSources)({
				id: 'listing-123',
				sharingPeriodStart: 'invalid-date',
			}),
		).rejects.toThrow('Invalid date supplied for listing update');
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
			update(mockDataSources)({
				id: 'listing-123',
				title: 'New Title',
			}),
		).rejects.toThrow('ItemListingUnitOfWork not available');
	});

	it('should update images array', async () => {
		// Arrange
		const mockListing = {
			images: [] as string[],
		};

		const mockUpdatedRef = { id: 'listing-123' };

		const mockRepo = {
			get: vi.fn().mockResolvedValue(mockListing),
			save: vi.fn().mockResolvedValue(mockUpdatedRef),
		};

		const mockUow = {
			withScopedTransactionById: vi.fn(async (_id, callback) => {
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
		await update(mockDataSources)({
			id: 'listing-123',
			images: ['img1.png', 'img2.png'],
		});

		// Assert
		expect(mockListing.images).toEqual(['img1.png', 'img2.png']);
	});

	it('should update isBlocked status', async () => {
		// Arrange
		const mockListing = {
			setBlocked: vi.fn(),
		};

		const mockUpdatedRef = { id: 'listing-123' };

		const mockRepo = {
			get: vi.fn().mockResolvedValue(mockListing),
			save: vi.fn().mockResolvedValue(mockUpdatedRef),
		};

		const mockUow = {
			withScopedTransactionById: vi.fn(async (_id, callback) => {
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
		await update(mockDataSources)({
			id: 'listing-123',
			isBlocked: true,
		});

		// Assert
		expect(mockListing.setBlocked).toHaveBeenCalledWith(true);
	});
});
