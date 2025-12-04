/**
 * Tests for ItemListingSearchApplicationService
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ItemListingSearchApplicationService } from './item-listing-search.js';
import type { CognitiveSearchDomain } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';
import type { SearchDocumentsResult } from '@cellix/search-service';

describe('ItemListingSearchApplicationService', () => {
	let service: ItemListingSearchApplicationService;
	let mockSearchService: CognitiveSearchDomain;
	let mockDataSources: DataSources;

	beforeEach(() => {
		// Mock search service
		mockSearchService = {
			createIndexIfNotExists: vi.fn().mockResolvedValue(undefined),
			search: vi.fn().mockResolvedValue({
				results: [],
				count: 0,
				facets: {},
			} as SearchDocumentsResult),
			indexDocument: vi.fn().mockResolvedValue(undefined),
		} as unknown as CognitiveSearchDomain;

		// Mock data sources
		mockDataSources = {
			readonlyDataSource: {
				Listing: {
					ItemListing: {
						ItemListingReadRepo: {
							getAll: vi.fn().mockResolvedValue([]),
						},
					},
				},
			},
		} as unknown as DataSources;

		service = new ItemListingSearchApplicationService(
			mockSearchService,
			mockDataSources,
		);
	});

	describe('searchItemListings', () => {
		it('should create index if not exists before searching', async () => {
			await service.searchItemListings({ searchString: 'test' });

			expect(mockSearchService.createIndexIfNotExists).toHaveBeenCalledTimes(1);
		});

		it('should search with default wildcard when no search string provided', async () => {
			await service.searchItemListings({});

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'*',
				expect.any(Object),
			);
		});

		it('should trim and use provided search string', async () => {
			await service.searchItemListings({ searchString: '  test query  ' });

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'test query',
				expect.any(Object),
			);
		});

		it('should use default options when none provided', async () => {
			await service.searchItemListings({ searchString: 'test' });

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'test',
				expect.objectContaining({
					queryType: 'full',
					searchMode: 'all',
					includeTotalCount: true,
					facets: ['category,count:0', 'state,count:0', 'sharerId,count:0'],
					top: 50,
					skip: 0,
					orderBy: ['updatedAt desc'],
				}),
			);
		});

		it('should apply custom pagination options', async () => {
			await service.searchItemListings({
				searchString: 'test',
				options: { top: 10, skip: 20 },
			});

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'test',
				expect.objectContaining({
					top: 10,
					skip: 20,
				}),
			);
		});

		it('should apply custom orderBy', async () => {
			await service.searchItemListings({
				searchString: 'test',
				options: { orderBy: ['title asc', 'createdAt desc'] },
			});

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'test',
				expect.objectContaining({
					orderBy: ['title asc', 'createdAt desc'],
				}),
			);
		});

		it('should build filter for category', async () => {
			await service.searchItemListings({
				searchString: 'test',
				options: {
					filter: {
						category: ['Electronics', 'Books'],
					},
				},
			});

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'test',
				expect.objectContaining({
					filter: "(category eq 'Electronics' or category eq 'Books')",
				}),
			);
		});

		it('should build filter for single category', async () => {
			await service.searchItemListings({
				searchString: 'test',
				options: {
					filter: {
						category: ['Electronics'],
					},
				},
			});

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'test',
				expect.objectContaining({
					filter: "(category eq 'Electronics')",
				}),
			);
		});

		it('should build filter for state', async () => {
			await service.searchItemListings({
				searchString: 'test',
				options: {
					filter: {
						state: ['Active', 'Pending'],
					},
				},
			});

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'test',
				expect.objectContaining({
					filter: "(state eq 'Active' or state eq 'Pending')",
				}),
			);
		});

		it('should build filter for sharerId', async () => {
			await service.searchItemListings({
				searchString: 'test',
				options: {
					filter: {
						sharerId: ['user-123', 'user-456'],
					},
				},
			});

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'test',
				expect.objectContaining({
					filter: "(sharerId eq 'user-123' or sharerId eq 'user-456')",
				}),
			);
		});

		it('should build filter for location', async () => {
			await service.searchItemListings({
				searchString: 'test',
				options: {
					filter: {
						location: 'New York, NY',
					},
				},
			});

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'test',
				expect.objectContaining({
					filter: "location eq 'New York, NY'",
				}),
			);
		});

		it('should build filter for date range with start date', async () => {
			await service.searchItemListings({
				searchString: 'test',
				options: {
					filter: {
						dateRange: {
							start: '2025-01-01T00:00:00.000Z',
						},
					},
				},
			});

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'test',
				expect.objectContaining({
					filter: "sharingPeriodStart ge '2025-01-01T00:00:00.000Z'",
				}),
			);
		});

		it('should build filter for date range with end date', async () => {
			await service.searchItemListings({
				searchString: 'test',
				options: {
					filter: {
						dateRange: {
							end: '2025-12-31T23:59:59.999Z',
						},
					},
				},
			});

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'test',
				expect.objectContaining({
					filter: "sharingPeriodEnd le '2025-12-31T23:59:59.999Z'",
				}),
			);
		});

		it('should build filter for date range with both dates', async () => {
			await service.searchItemListings({
				searchString: 'test',
				options: {
					filter: {
						dateRange: {
							start: '2025-01-01T00:00:00.000Z',
							end: '2025-12-31T23:59:59.999Z',
						},
					},
				},
			});

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'test',
				expect.objectContaining({
					filter:
						"sharingPeriodStart ge '2025-01-01T00:00:00.000Z' and sharingPeriodEnd le '2025-12-31T23:59:59.999Z'",
				}),
			);
		});

		it('should combine multiple filters with AND', async () => {
			await service.searchItemListings({
				searchString: 'test',
				options: {
					filter: {
						category: ['Electronics'],
						state: ['Active'],
						location: 'New York',
					},
				},
			});

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'test',
				expect.objectContaining({
					filter:
						"(category eq 'Electronics') and (state eq 'Active') and location eq 'New York'",
				}),
			);
		});

		it('should return converted search results', async () => {
			const mockResults: SearchDocumentsResult = {
				results: [
					{
						document: {
							id: 'listing-1',
							title: 'Test Listing',
							description: 'Description',
							category: 'Electronics',
						},
						score: 1,
					},
				],
				count: 1,
				facets: {
					category: [{ value: 'Electronics', count: 1 }],
				},
			};

			vi.mocked(mockSearchService.search).mockResolvedValue(mockResults);

			const result = await service.searchItemListings({ searchString: 'test' });

			expect(result.items).toHaveLength(1);
			expect(result.items[0].id).toBe('listing-1');
			expect(result.count).toBe(1);
			expect(result.facets).toEqual({
				category: [{ value: 'Electronics', count: 1 }],
			});
		});

		it('should handle empty search results', async () => {
			const result = await service.searchItemListings({ searchString: 'test' });

			expect(result.items).toHaveLength(0);
			expect(result.count).toBe(0);
			expect(result.facets).toEqual({});
		});
	});

	describe('bulkIndexItemListings', () => {
		it('should create index before bulk indexing', async () => {
			await service.bulkIndexItemListings();

			expect(mockSearchService.createIndexIfNotExists).toHaveBeenCalledTimes(1);
		});

		it('should return message when no listings found', async () => {
			const result = await service.bulkIndexItemListings();

			expect(result.successCount).toBe(0);
			expect(result.totalCount).toBe(0);
			expect(result.message).toBe('No listings found to index');
		});

		it('should index all listings successfully', async () => {
			const mockListings = [
				{
					id: 'listing-1',
					title: 'Test Listing 1',
					description: 'Description 1',
					category: 'Electronics',
					location: 'New York',
					state: 'Active',
					images: ['image1.jpg'],
					sharer: {
						id: 'user-1',
						account: {
							profile: {
								firstName: 'John',
								lastName: 'Doe',
							},
						},
					},
					sharingPeriodStart: new Date('2025-01-01'),
					sharingPeriodEnd: new Date('2025-12-31'),
					createdAt: new Date('2024-01-01'),
					updatedAt: new Date('2024-02-01'),
				},
				{
					id: 'listing-2',
					title: 'Test Listing 2',
					description: 'Description 2',
					category: 'Books',
					location: 'Boston',
					state: 'Pending',
					images: ['image2.jpg'],
					sharer: {
						id: 'user-2',
						account: {
							profile: {
								firstName: 'Jane',
								lastName: 'Smith',
							},
						},
					},
					sharingPeriodStart: new Date('2025-02-01'),
					sharingPeriodEnd: new Date('2025-11-30'),
					createdAt: new Date('2024-01-15'),
					updatedAt: new Date('2024-02-15'),
				},
			];

			vi.mocked(
				mockDataSources.readonlyDataSource.Listing.ItemListing
					.ItemListingReadRepo.getAll,
			// biome-ignore lint/suspicious/noExplicitAny: Mock data requires flexible typing
			).mockResolvedValue(mockListings as any);

			const result = await service.bulkIndexItemListings();

			expect(mockSearchService.indexDocument).toHaveBeenCalledTimes(2);
			expect(result.successCount).toBe(2);
			expect(result.totalCount).toBe(2);
			expect(result.message).toBe('Successfully indexed 2/2 listings');
		});

		it('should handle missing optional fields', async () => {
			const mockListings = [
				{
					id: 'listing-1',
					title: 'Test Listing',
					description: null,
					category: null,
					location: null,
					state: null,
					images: null,
					sharer: null,
					sharingPeriodStart: null,
					sharingPeriodEnd: null,
					createdAt: null,
					updatedAt: null,
				},
			];

			vi.mocked(
				mockDataSources.readonlyDataSource.Listing.ItemListing
					.ItemListingReadRepo.getAll,
			// biome-ignore lint/suspicious/noExplicitAny: Mock data requires flexible typing
			).mockResolvedValue(mockListings as any);

			const result = await service.bulkIndexItemListings();

			expect(mockSearchService.indexDocument).toHaveBeenCalledTimes(1);
			expect(mockSearchService.indexDocument).toHaveBeenCalledWith(
				'item-listings',
				expect.objectContaining({
					id: 'listing-1',
					title: 'Test Listing',
					description: '',
					category: '',
					location: '',
					state: '',
					sharerName: 'Unknown',
					sharerId: '',
					images: [],
				}),
			);
			expect(result.successCount).toBe(1);
		});

		it('should handle missing sharer profile', async () => {
			const mockListings = [
				{
					id: 'listing-1',
					title: 'Test Listing',
					sharer: {
						id: 'user-1',
						account: {
							profile: null,
						},
					},
				},
			];

			vi.mocked(
				mockDataSources.readonlyDataSource.Listing.ItemListing
					.ItemListingReadRepo.getAll,
			// biome-ignore lint/suspicious/noExplicitAny: Mock data requires flexible typing
			).mockResolvedValue(mockListings as any);

			await service.bulkIndexItemListings();

			expect(mockSearchService.indexDocument).toHaveBeenCalledWith(
				'item-listings',
				expect.objectContaining({
					sharerName: 'Unknown',
					sharerId: 'user-1',
				}),
			);
		});

		it('should handle missing sharer account', async () => {
			const mockListings = [
				{
					id: 'listing-1',
					title: 'Test Listing',
					sharer: {
						id: 'user-1',
						account: null,
					},
				},
			];

			vi.mocked(
				mockDataSources.readonlyDataSource.Listing.ItemListing
					.ItemListingReadRepo.getAll,
			// biome-ignore lint/suspicious/noExplicitAny: Mock data requires flexible typing
			).mockResolvedValue(mockListings as any);

			await service.bulkIndexItemListings();

			expect(mockSearchService.indexDocument).toHaveBeenCalledWith(
				'item-listings',
				expect.objectContaining({
					sharerName: 'Unknown',
					sharerId: 'user-1',
				}),
			);
		});

		it('should handle indexing errors gracefully', async () => {
			const mockListings = [
				{
					id: 'listing-1',
					title: 'Test Listing 1',
				},
				{
					id: 'listing-2',
					title: 'Test Listing 2',
				},
			];

			vi.mocked(
				mockDataSources.readonlyDataSource.Listing.ItemListing
					.ItemListingReadRepo.getAll,
			// biome-ignore lint/suspicious/noExplicitAny: Mock data requires flexible typing
			).mockResolvedValue(mockListings as any);

			vi.mocked(mockSearchService.indexDocument)
				.mockResolvedValueOnce(undefined)
				.mockRejectedValueOnce(new Error('Indexing failed'));

			const result = await service.bulkIndexItemListings();

			expect(result.successCount).toBe(1);
			expect(result.totalCount).toBe(2);
			expect(result.message).toBe('Successfully indexed 1/2 listings');
		});

		it('should handle non-Error exceptions during indexing', async () => {
			const mockListings = [
				{
					id: 'listing-1',
					title: 'Test Listing',
				},
			];

			vi.mocked(
				mockDataSources.readonlyDataSource.Listing.ItemListing
					.ItemListingReadRepo.getAll,
			// biome-ignore lint/suspicious/noExplicitAny: Mock data requires flexible typing
			).mockResolvedValue(mockListings as any);

			vi.mocked(mockSearchService.indexDocument).mockRejectedValue(
				'String error',
			);

			const result = await service.bulkIndexItemListings();

			expect(result.successCount).toBe(0);
			expect(result.totalCount).toBe(1);
		});
	});
});
