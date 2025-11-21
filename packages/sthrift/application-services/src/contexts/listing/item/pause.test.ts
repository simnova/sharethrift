import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { pause, type ItemListingPauseCommand } from './pause.ts';

describe('pause', () => {
	let mockDataSources: DataSources;
	let mockListing: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference;
	let mockRepo: {
		getById: ReturnType<typeof vi.fn>;
		save: ReturnType<typeof vi.fn>;
	};
	let mockUow: {
		withScopedTransaction: ReturnType<typeof vi.fn>;
	};

	beforeEach(() => {
		mockListing = {
			id: 'listing-1',
			title: 'Test Listing',
			description: 'Test description',
			category: 'Electronics',
			location: 'Delhi',
			sharingPeriodStart: new Date('2025-10-06'),
			sharingPeriodEnd: new Date('2025-11-06'),
			state: 'Published',
			sharer: {
				id: 'user-1',
			} as Domain.Contexts.User.PersonalUser.PersonalUserEntityReference,
			images: [],
			reports: 0,
			sharingHistory: [],
			createdAt: new Date(),
			updatedAt: new Date(),
			schemaVersion: '1.0.0',
			listingType: 'item-listing',
		};

		mockRepo = {
			getById: vi.fn().mockResolvedValue(mockListing),
			save: vi.fn().mockResolvedValue({
				...mockListing,
				state: 'Paused',
			}),
		};

		mockUow = {
			withScopedTransaction: vi.fn().mockImplementation(async (callback) => {
				return await callback(mockRepo);
			}),
		};

		mockDataSources = {
			domainDataSource: {
				Listing: {
					ItemListing: {
						ItemListingUnitOfWork: mockUow,
					},
				},
			},
		} as unknown as DataSources;
	});

	it('should pause a listing successfully', async () => {
		const command: ItemListingPauseCommand = { id: 'listing-1' };
		const pauseFn = pause(mockDataSources);

		// Mock the pause method on the listing
		const listingWithPause = {
			...mockListing,
			pause: vi.fn(),
		};
		mockRepo.getById = vi.fn().mockResolvedValue(listingWithPause);

		const result = await pauseFn(command);

		expect(mockUow.withScopedTransaction).toHaveBeenCalled();
		expect(mockRepo.getById).toHaveBeenCalledWith('listing-1');
		expect(listingWithPause.pause).toHaveBeenCalled();
		expect(mockRepo.save).toHaveBeenCalledWith(listingWithPause);
		expect(result.state).toBe('Paused');
	});

	it('should throw error when listing is not found', async () => {
		const command: ItemListingPauseCommand = { id: 'nonexistent-id' };
		const pauseFn = pause(mockDataSources);

		mockRepo.getById = vi.fn().mockResolvedValue(null);

		await expect(pauseFn(command)).rejects.toThrow('Listing not found');
		expect(mockUow.withScopedTransaction).toHaveBeenCalled();
		expect(mockRepo.getById).toHaveBeenCalledWith('nonexistent-id');
		expect(mockRepo.save).not.toHaveBeenCalled();
	});

	it('should throw error when save fails', async () => {
		const command: ItemListingPauseCommand = { id: 'listing-1' };
		const pauseFn = pause(mockDataSources);

		const listingWithPause = {
			...mockListing,
			pause: vi.fn(),
		};
		mockRepo.getById = vi.fn().mockResolvedValue(listingWithPause);
		mockRepo.save = vi.fn().mockResolvedValue(undefined);

		await expect(pauseFn(command)).rejects.toThrow('ItemListing not paused');
		expect(mockUow.withScopedTransaction).toHaveBeenCalled();
		expect(mockRepo.getById).toHaveBeenCalledWith('listing-1');
		expect(listingWithPause.pause).toHaveBeenCalled();
		expect(mockRepo.save).toHaveBeenCalled();
	});

	it('should throw error when repository throws', async () => {
		const command: ItemListingPauseCommand = { id: 'listing-1' };
		const pauseFn = pause(mockDataSources);

		mockUow.withScopedTransaction = vi.fn().mockRejectedValue(
			new Error('Database error'),
		);

		await expect(pauseFn(command)).rejects.toThrow('Database error');
	});
});

