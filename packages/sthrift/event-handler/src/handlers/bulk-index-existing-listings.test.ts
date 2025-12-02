/**
 * Tests for Bulk Index Existing Listings
 *
 * Tests the handler that indexes all existing listings into the search index.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Domain } from '@sthrift/domain';
import type { ServiceSearchIndex } from '@sthrift/search-service-index';
import { bulkIndexExistingListings } from './bulk-index-existing-listings.js';

describe('bulkIndexExistingListings', () => {
	let mockSearchService: ServiceSearchIndex;
	let mockListings: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[];

	beforeEach(() => {
		vi.spyOn(console, 'log').mockImplementation(() => undefined);
		vi.spyOn(console, 'error').mockImplementation(() => undefined);

		mockSearchService = {
			createIndexIfNotExists: vi.fn().mockResolvedValue(undefined),
			indexDocument: vi.fn().mockResolvedValue(undefined),
		} as unknown as ServiceSearchIndex;

		mockListings = [
			{
				id: 'listing-1',
				title: 'Test Listing 1',
				description: 'Description 1',
				category: 'electronics',
				location: 'New York',
				state: 'active',
				sharer: { id: 'user-1', account: { profile: { firstName: 'Alice' } } },
				images: ['img1.jpg'],
				createdAt: new Date('2024-01-01'),
				updatedAt: new Date('2024-01-02'),
				sharingPeriodStart: new Date('2024-01-01'),
				sharingPeriodEnd: new Date('2024-06-30'),
			},
			{
				id: 'listing-2',
				title: 'Test Listing 2',
				description: 'Description 2',
				category: 'sports',
				location: 'Los Angeles',
				state: 'pending',
				sharer: { id: 'user-2', account: { profile: { firstName: 'Bob' } } },
				images: ['img2.jpg'],
				createdAt: new Date('2024-02-01'),
				updatedAt: new Date('2024-02-02'),
				sharingPeriodStart: new Date('2024-02-01'),
				sharingPeriodEnd: new Date('2024-08-31'),
			},
		] as unknown as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[];
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should log start message', async () => {
		await bulkIndexExistingListings(mockListings, mockSearchService);

		expect(console.log).toHaveBeenCalledWith(
			'Starting bulk indexing of existing listings...',
		);
	});

	it('should create index if it does not exist', async () => {
		await bulkIndexExistingListings(mockListings, mockSearchService);

		expect(mockSearchService.createIndexIfNotExists).toHaveBeenCalledWith(
			expect.objectContaining({ name: 'item-listings' }),
		);
	});

	it('should index each listing', async () => {
		await bulkIndexExistingListings(mockListings, mockSearchService);

		expect(mockSearchService.indexDocument).toHaveBeenCalledTimes(2);
		expect(mockSearchService.indexDocument).toHaveBeenCalledWith(
			'item-listings',
			expect.objectContaining({ id: 'listing-1', title: 'Test Listing 1' }),
		);
		expect(mockSearchService.indexDocument).toHaveBeenCalledWith(
			'item-listings',
			expect.objectContaining({ id: 'listing-2', title: 'Test Listing 2' }),
		);
	});

	it('should log success for each indexed listing', async () => {
		await bulkIndexExistingListings(mockListings, mockSearchService);

		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('Indexed listing: listing-1'),
		);
		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('Indexed listing: listing-2'),
		);
	});

	it('should log completion summary', async () => {
		await bulkIndexExistingListings(mockListings, mockSearchService);

		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('2/2 listings indexed successfully'),
		);
	});

	it('should handle empty listings array', async () => {
		await bulkIndexExistingListings([], mockSearchService);

		expect(console.log).toHaveBeenCalledWith('No listings found to index');
		expect(mockSearchService.createIndexIfNotExists).not.toHaveBeenCalled();
		expect(mockSearchService.indexDocument).not.toHaveBeenCalled();
	});

	it('should continue indexing when one listing fails', async () => {
		mockSearchService.indexDocument = vi
			.fn()
			.mockRejectedValueOnce(new Error('Index failed'))
			.mockResolvedValue(undefined);

		await bulkIndexExistingListings(mockListings, mockSearchService);

		expect(mockSearchService.indexDocument).toHaveBeenCalledTimes(2);
		expect(console.error).toHaveBeenCalledWith(
			expect.stringContaining('Failed to index listing listing-1'),
			expect.any(String),
		);
		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('Indexed listing: listing-2'),
		);
	});

	it('should report partial success in summary', async () => {
		mockSearchService.indexDocument = vi
			.fn()
			.mockRejectedValueOnce(new Error('Index failed'))
			.mockResolvedValue(undefined);

		await bulkIndexExistingListings(mockListings, mockSearchService);

		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('1/2 listings indexed successfully'),
		);
		expect(console.error).toHaveBeenCalledWith(
			expect.stringContaining('Failed to index 1 listings'),
			expect.any(Array),
		);
	});

	it('should handle listings with missing optional fields', async () => {
		const listingsWithMissingFields = [
			{
				id: 'listing-minimal',
				title: 'Minimal Listing',
				// Missing optional fields
			},
		] as unknown as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[];

		await bulkIndexExistingListings(
			listingsWithMissingFields,
			mockSearchService,
		);

		expect(mockSearchService.indexDocument).toHaveBeenCalledWith(
			'item-listings',
			expect.objectContaining({
				id: 'listing-minimal',
				title: 'Minimal Listing',
				description: '',
				category: '',
				location: '',
				sharerName: 'Unknown',
				sharerId: '',
				state: '',
			}),
		);
	});

	it('should throw if createIndexIfNotExists fails', async () => {
		mockSearchService.createIndexIfNotExists = vi
			.fn()
			.mockRejectedValue(new Error('Index creation failed'));

		await expect(
			bulkIndexExistingListings(mockListings, mockSearchService),
		).rejects.toThrow('Index creation failed');

		expect(console.error).toHaveBeenCalledWith(
			'Bulk indexing failed:',
			expect.any(Error),
		);
	});

	it('should convert dates to ISO strings', async () => {
		await bulkIndexExistingListings(mockListings, mockSearchService);

		expect(mockSearchService.indexDocument).toHaveBeenCalledWith(
			'item-listings',
			expect.objectContaining({
				sharingPeriodStart: expect.stringContaining('2024-01-01'),
				sharingPeriodEnd: expect.stringContaining('2024-06-30'),
				createdAt: expect.stringContaining('2024-01-01'),
				updatedAt: expect.stringContaining('2024-01-02'),
			}),
		);
	});

	it('should use current date for missing date fields', async () => {
		const listingsWithMissingDates = [
			{
				id: 'listing-no-dates',
				title: 'No Dates Listing',
			},
		] as unknown as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[];

		const beforeTest = new Date().toISOString().split('T')[0];
		await bulkIndexExistingListings(
			listingsWithMissingDates,
			mockSearchService,
		);

		expect(mockSearchService.indexDocument).toHaveBeenCalledWith(
			'item-listings',
			expect.objectContaining({
				sharingPeriodStart: expect.stringContaining(beforeTest),
				sharingPeriodEnd: expect.stringContaining(beforeTest),
				createdAt: expect.stringContaining(beforeTest),
				updatedAt: expect.stringContaining(beforeTest),
			}),
		);
	});
});
