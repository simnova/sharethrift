import type { Domain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { block } from './block.ts';

describe('listing/item', () => {
	describe('block', () => {
		let mockRepo: {
			getById: ReturnType<typeof vi.fn>;
			save: ReturnType<typeof vi.fn>;
		};

		let mockListing: {
			blocked?: boolean;
		};

		let mockDataSources: DataSources;

		beforeEach(() => {
			mockListing = {};

			mockRepo = {
				getById: vi.fn().mockResolvedValue(mockListing),
				save: vi
					.fn()
					.mockResolvedValue(
						mockListing as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference,
					),
			};

			mockDataSources = {
				domainDataSource: {
					Listing: {
						ItemListing: {
							ItemListingUnitOfWork: {
								withScopedTransaction: vi
									.fn()
									.mockImplementation(async (callback) => {
										return await callback(mockRepo);
									}),
							},
						},
					},
				},
			} as unknown as DataSources;
		});

		it('should block an item listing', async () => {
			const command = { id: 'test-listing-id' };
			const blockFn = block(mockDataSources);

			const result = await blockFn(command);

			expect(mockRepo.getById).toHaveBeenCalledWith('test-listing-id');
			expect(mockListing.blocked).toBe(true);
			expect(mockRepo.save).toHaveBeenCalledWith(mockListing);
			expect(result).toBe(mockListing);
		});

		it('should throw an error if listing is not found', async () => {
			mockRepo.getById.mockResolvedValue(null);
			const command = { id: 'non-existent-id' };
			const blockFn = block(mockDataSources);

			await expect(blockFn(command)).rejects.toThrow('Listing not found');
		});

		it('should throw an error if listing is not saved', async () => {
			mockRepo.save.mockResolvedValue(undefined);
			const command = { id: 'test-listing-id' };
			const blockFn = block(mockDataSources);

			await expect(blockFn(command)).rejects.toThrow('ItemListing not updated');
		});
	});
});
