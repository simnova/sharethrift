/**
 * Tests for Bulk Index Existing Listings
 *
 * Tests the handler that indexes all existing listings into the search index.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Domain } from '@sthrift/domain';
import type { SearchService } from '@cellix/search-service';
import { bulkIndexExistingListings } from './bulk-index-existing-listings.js';

describe('bulkIndexExistingListings', () => {
	let mockSearchService: SearchService;
	let mockListings: Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[];
	let mockUnitOfWork: Domain.Contexts.Listing.ItemListing.ItemListingUnitOfWork;
	let mockListingData: Map<string, Domain.Contexts.Listing.ItemListing.ItemListingEntityReference>;

	beforeEach(() => {
		vi.spyOn(console, 'log').mockImplementation(() => undefined);
		vi.spyOn(console, 'error').mockImplementation(() => undefined);

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

		mockListingData = new Map(mockListings.map(listing => [listing.id, listing]));

		mockSearchService = {
			createIndexIfNotExists: vi.fn().mockResolvedValue(undefined),
			indexDocument: vi.fn().mockResolvedValue(undefined),
		} as unknown as SearchService;

		mockUnitOfWork = {
			withScopedTransaction: vi.fn().mockImplementation((callback) => {
				const mockRepo = {
					getById: vi.fn().mockImplementation((id: string) => 
						Promise.resolve(mockListingData.get(id))
					),
				};
				return callback(mockRepo);
			}),
		} as unknown as Domain.Contexts.Listing.ItemListing.ItemListingUnitOfWork;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should log start message', async () => {
		await bulkIndexExistingListings(mockListings, mockSearchService, mockUnitOfWork);

		expect(console.log).toHaveBeenCalledWith(
			'Starting bulk indexing of existing listings...',
		);
	});

	it('should create index through service', async () => {
		await bulkIndexExistingListings(mockListings, mockSearchService, mockUnitOfWork);

		expect(mockSearchService.createIndexIfNotExists).toHaveBeenCalledWith(
			expect.objectContaining({ name: 'listings' }),
		);
	});

	it('should index each listing', async () => {
		await bulkIndexExistingListings(mockListings, mockSearchService, mockUnitOfWork);

		expect(mockSearchService.indexDocument).toHaveBeenCalledTimes(2);
		expect(mockSearchService.indexDocument).toHaveBeenCalledWith(
			'listings',
			expect.objectContaining({ id: 'listing-1', title: 'Test Listing 1' }),
		);
		expect(mockSearchService.indexDocument).toHaveBeenCalledWith(
			'listings',
			expect.objectContaining({ id: 'listing-2', title: 'Test Listing 2' }),
		);
	});

	it('should log success for each indexed listing', async () => {
		await bulkIndexExistingListings(mockListings, mockSearchService, mockUnitOfWork);

		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('Indexed listing: listing-1'),
		);
		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('Indexed listing: listing-2'),
		);
	});

	it('should log completion summary', async () => {
		await bulkIndexExistingListings(mockListings, mockSearchService, mockUnitOfWork);

		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('2/2 listings indexed successfully'),
		);
	});

	it('should handle empty listings array', async () => {
		await bulkIndexExistingListings([], mockSearchService, mockUnitOfWork);

		expect(console.log).toHaveBeenCalledWith('No listings found to index');
		expect(mockSearchService.createIndexIfNotExists).not.toHaveBeenCalled();
		expect(mockSearchService.indexDocument).not.toHaveBeenCalled();
	});

	it('should continue indexing when one listing fails', async () => {
		mockSearchService.indexDocument = vi
			.fn()
			.mockRejectedValue(new Error('Index failed'));

		await bulkIndexExistingListings(mockListings, mockSearchService, mockUnitOfWork);

		expect(console.error).toHaveBeenCalledWith(
			expect.stringContaining('Failed to index listing listing-1'),
			expect.any(String),
		);
		expect(console.error).toHaveBeenCalledWith(
			expect.stringContaining('Failed to index listing listing-2'),
			expect.any(String),
		);
	});

	it('should report partial success in summary', async () => {
		let callCount = 0;
		mockSearchService.indexDocument = vi.fn().mockImplementation(() => {
			callCount++;
			if (callCount <= 3) {
				return Promise.reject(new Error('Index failed'));
			}
			return Promise.resolve(undefined);
		});

		await bulkIndexExistingListings(mockListings, mockSearchService, mockUnitOfWork);

		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('Bulk indexing complete: 1/2 listings indexed successfully'),
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
			},
		] as unknown as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[];

		const minimalListing = listingsWithMissingFields[0];
		if (minimalListing) {
			mockListingData.set('listing-minimal', minimalListing);
		}

		await bulkIndexExistingListings(
			listingsWithMissingFields,
			mockSearchService,
			mockUnitOfWork,
		);

		expect(mockSearchService.indexDocument).toHaveBeenCalledWith(
			'listings',
			expect.objectContaining({
				id: 'listing-minimal',
				title: 'Minimal Listing',
			}),
		);
	});

	it('should handle index creation failure gracefully', async () => {
		mockSearchService.createIndexIfNotExists = vi
			.fn()
			.mockRejectedValue(new Error('Index creation failed'));

		await bulkIndexExistingListings(mockListings, mockSearchService, mockUnitOfWork);

		expect(console.error).toHaveBeenCalledWith(
			expect.stringContaining('Failed to index listing listing-1'),
			expect.any(String),
		);
		expect(console.error).toHaveBeenCalledWith(
			expect.stringContaining('Failed to index listing listing-2'),
			expect.any(String),
		);
	});

	it('should index documents with correct data structure', async () => {
		await bulkIndexExistingListings(mockListings, mockSearchService, mockUnitOfWork);

		expect(mockSearchService.indexDocument).toHaveBeenCalledWith(
			'listings',
			expect.objectContaining({
				id: 'listing-1',
				title: 'Test Listing 1',
			}),
		);
		expect(mockSearchService.indexDocument).toHaveBeenCalledWith(
			'listings',
			expect.objectContaining({
				id: 'listing-2',
				title: 'Test Listing 2',
			}),
		);
	});

	it('should handle missing listings in repository', async () => {
		vi.spyOn(console, 'warn').mockImplementation(() => undefined);

		const listingsWithMissingData = [
			{
				id: 'listing-missing',
				title: 'Missing Listing',
			},
		] as unknown as Domain.Contexts.Listing.ItemListing.ItemListingEntityReference[];

		await bulkIndexExistingListings(
			listingsWithMissingData,
			mockSearchService,
			mockUnitOfWork,
		);

		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('Listing listing-missing not found'),
		);
		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('Bulk indexing complete: 1/1 listings indexed successfully'),
		);
	});
});
