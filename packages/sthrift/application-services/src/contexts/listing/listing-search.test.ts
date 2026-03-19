/**
 * Tests for ListingSearchApplicationService
 *
 * These tests verify the search functionality including:
 * - Search with various filters
 * - Pagination
 * - Sorting
 * - Bulk indexing
 * - Error handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ListingSearchApplicationService } from './listing-search';
import type { CognitiveSearchDomain, ListingSearchInput } from '@sthrift/domain';
import type { DataSources } from '@sthrift/persistence';

describe('ListingSearchApplicationService', () => {
	let service: ListingSearchApplicationService;
	let mockSearchService: CognitiveSearchDomain;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock type
	let mockDataSources: any;

	beforeEach(() => {
		// Mock search service
		mockSearchService = {
			createIndexIfNotExists: vi.fn().mockResolvedValue(undefined),
			search: vi.fn().mockResolvedValue({
				results: [],
				count: 0,
			}),
			indexDocument: vi.fn().mockResolvedValue(undefined),
			deleteDocument: vi.fn().mockResolvedValue(undefined),
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

		service = new ListingSearchApplicationService(
			mockSearchService,
			mockDataSources,
		);
	});

	describe('searchListings', () => {
		it('should search with basic text query', async () => {
			const mockResults = {
				results: [
					{
						document: {
							id: 'listing-1',
							title: 'Camera',
							description: 'Professional camera',
							category: 'electronics',
						},
					},
				],
				count: 1,
			};

			vi.mocked(mockSearchService.search).mockResolvedValue(mockResults);

			const input: ListingSearchInput = {
				searchString: 'camera',
			};

			const result = await service.searchListings(input);

			expect(result.items).toHaveLength(1);
			expect(result.count).toBe(1);
			expect(mockSearchService.createIndexIfNotExists).toHaveBeenCalled();
			expect(mockSearchService.search).toHaveBeenCalledWith(
				'listings',
				'camera',
				expect.objectContaining({
					queryType: 'full',
					searchMode: 'all',
				}),
			);
		});

		it('should handle empty search string with wildcard', async () => {
			await service.searchListings({ searchString: '' });

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'listings',
				'*',
				expect.any(Object),
			);
		});

		it('should trim search string', async () => {
			await service.searchListings({ searchString: '  camera  ' });

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'listings',
				'camera',
				expect.any(Object),
			);
		});

		it('should use default wildcard when no search string provided', async () => {
			await service.searchListings({});

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'listings',
				'*',
				expect.any(Object),
			);
		});

		it('should apply category filter', async () => {
			const input: ListingSearchInput = {
				searchString: '*',
				options: {
					filter: {
						category: ['electronics', 'sports'],
					},
				},
			};

			await service.searchListings(input);

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'listings',
				'*',
				expect.objectContaining({
					filter: "(category eq 'electronics' or category eq 'sports')",
				}),
			);
		});

		it('should apply state filter', async () => {
			const input: ListingSearchInput = {
				searchString: '*',
				options: {
					filter: {
						state: ['active', 'draft'],
					},
				},
			};

			await service.searchListings(input);

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'listings',
				'*',
				expect.objectContaining({
					filter: "(state eq 'active' or state eq 'draft')",
				}),
			);
		});

		it('should apply sharerId filter', async () => {
			const input: ListingSearchInput = {
				searchString: '*',
				options: {
					filter: {
						sharerId: ['user-1', 'user-2'],
					},
				},
			};

			await service.searchListings(input);

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'listings',
				'*',
				expect.objectContaining({
					filter: "(sharerId eq 'user-1' or sharerId eq 'user-2')",
				}),
			);
		});

		it('should apply location filter', async () => {
			const input: ListingSearchInput = {
				searchString: '*',
				options: {
					filter: {
						location: 'New York',
					},
				},
			};

			await service.searchListings(input);

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'listings',
				'*',
				expect.objectContaining({
					filter: "location eq 'New York'",
				}),
			);
		});

		it('should apply date range filter with start date', async () => {
			const input: ListingSearchInput = {
				searchString: '*',
				options: {
					filter: {
						dateRange: {
							start: '2024-01-01',
						},
					},
				},
			};

			await service.searchListings(input);

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'listings',
				'*',
				expect.objectContaining({
					filter: "sharingPeriodStart ge '2024-01-01'",
				}),
			);
		});

		it('should apply date range filter with end date', async () => {
			const input: ListingSearchInput = {
				searchString: '*',
				options: {
					filter: {
						dateRange: {
							end: '2024-12-31',
						},
					},
				},
			};

			await service.searchListings(input);

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'listings',
				'*',
				expect.objectContaining({
					filter: "sharingPeriodEnd le '2024-12-31'",
				}),
			);
		});

		it('should apply date range filter with both start and end dates', async () => {
			const input: ListingSearchInput = {
				searchString: '*',
				options: {
					filter: {
						dateRange: {
							start: '2024-01-01',
							end: '2024-12-31',
						},
					},
				},
			};

			await service.searchListings(input);

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'listings',
				'*',
				expect.objectContaining({
					filter: "sharingPeriodStart ge '2024-01-01' and sharingPeriodEnd le '2024-12-31'",
				}),
			);
		});

		it('should combine multiple filters with AND', async () => {
			const input: ListingSearchInput = {
				searchString: '*',
				options: {
					filter: {
						category: ['electronics'],
						state: ['active'],
						location: 'Seattle',
					},
				},
			};

			await service.searchListings(input);

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'listings',
				'*',
				expect.objectContaining({
					filter: "(category eq 'electronics') and (state eq 'active') and location eq 'Seattle'",
				}),
			);
		});

		it('should apply pagination options', async () => {
			const input: ListingSearchInput = {
				searchString: '*',
				options: {
					top: 10,
					skip: 20,
				},
			};

			await service.searchListings(input);

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'listings',
				'*',
				expect.objectContaining({
					top: 10,
					skip: 20,
				}),
			);
		});

		it('should use default pagination values when not provided', async () => {
			await service.searchListings({ searchString: '*' });

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'listings',
				'*',
				expect.objectContaining({
					top: 50,
					skip: 0,
				}),
			);
		});

		it('should apply custom orderBy', async () => {
			const input: ListingSearchInput = {
				searchString: '*',
				options: {
					orderBy: ['title asc', 'createdAt desc'],
				},
			};

			await service.searchListings(input);

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'listings',
				'*',
				expect.objectContaining({
					orderBy: ['title asc', 'createdAt desc'],
				}),
			);
		});

		it('should use default orderBy when not provided', async () => {
			await service.searchListings({ searchString: '*' });

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'listings',
				'*',
				expect.objectContaining({
					orderBy: ['updatedAt desc'],
				}),
			);
		});

		it('should include facets in search options', async () => {
			await service.searchListings({ searchString: '*' });

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'listings',
				'*',
				expect.objectContaining({
					facets: ['category,count:0', 'state,count:0', 'sharerId,count:0'],
				}),
			);
		});

		it('should convert facets in response', async () => {
			const mockResults = {
				results: [],
				count: 0,
				facets: {
					category: [
						{ value: 'electronics', count: 5 },
						{ value: 'sports', count: 3 },
					],
					state: [
						{ value: 'active', count: 7 },
						{ value: 'draft', count: 1 },
					],
				},
			};

			vi.mocked(mockSearchService.search).mockResolvedValue(mockResults);

			const result = await service.searchListings({ searchString: '*' });

			expect(result.facets).toBeDefined();
			expect(result.facets?.category).toHaveLength(2);
			expect(result.facets?.state).toHaveLength(2);
			expect(result.facets?.category?.[0]).toEqual({
				value: 'electronics',
				count: 5,
			});
		});

		it('should return result without facets when none provided', async () => {
			const mockResults = {
				results: [],
				count: 0,
				facets: undefined,
			};

			vi.mocked(mockSearchService.search).mockResolvedValue(mockResults);

			const result = await service.searchListings({ searchString: '*' });

			expect(result.facets).toBeUndefined();
		});

		it('should convert all facet types', async () => {
			const mockResults = {
				results: [],
				count: 0,
				facets: {
					category: [{ value: 'electronics', count: 1 }],
					state: [{ value: 'active', count: 1 }],
					sharerId: [{ value: 'user-1', count: 1 }],
					createdAt: [{ value: '2024-01-01', count: 1 }],
				},
			};

			vi.mocked(mockSearchService.search).mockResolvedValue(mockResults);

			const result = await service.searchListings({ searchString: '*' });

			expect(result.facets?.category).toBeDefined();
			expect(result.facets?.state).toBeDefined();
			expect(result.facets?.sharerId).toBeDefined();
			expect(result.facets?.createdAt).toBeDefined();
		});
	});

	describe('bulkIndexListings', () => {
		it('should index all listings successfully', async () => {
			const mockListings = [
				{
					id: 'listing-1',
					title: 'Camera',
					description: 'Professional camera',
					category: 'electronics',
					props: {
						id: 'listing-1',
						title: 'Camera',
						description: 'Professional camera',
						sharer: { id: 'user-1' },
					},
				},
				{
					id: 'listing-2',
					title: 'Bike',
					description: 'Mountain bike',
					category: 'sports',
					props: {
						id: 'listing-2',
						title: 'Bike',
						description: 'Mountain bike',
						sharer: { id: 'user-2' },
					},
				},
			];

			vi.mocked(
				mockDataSources.readonlyDataSource.Listing.ItemListing
					.ItemListingReadRepo.getAll,
			).mockResolvedValue(mockListings);

			const result = await service.bulkIndexListings();

			expect(result.successCount).toBe(2);
			expect(result.totalCount).toBe(2);
			expect(result.message).toBe('Successfully indexed 2/2 listings');
			expect(mockSearchService.indexDocument).toHaveBeenCalledTimes(2);
		});

		it('should return early when no listings found', async () => {
			vi.mocked(
				mockDataSources.readonlyDataSource.Listing.ItemListing
					.ItemListingReadRepo.getAll,
			).mockResolvedValue([]);

			const result = await service.bulkIndexListings();

			expect(result.successCount).toBe(0);
			expect(result.totalCount).toBe(0);
			expect(result.message).toBe('No listings found to index');
			expect(mockSearchService.indexDocument).not.toHaveBeenCalled();
		});

		it('should handle indexing errors gracefully', async () => {
			const mockListings = [
				{
					id: 'listing-1',
					title: 'Camera',
					props: { id: 'listing-1', title: 'Camera' },
				},
				{
					id: 'listing-2',
					title: 'Bike',
					props: { id: 'listing-2', title: 'Bike' },
				},
			];

			vi.mocked(
				mockDataSources.readonlyDataSource.Listing.ItemListing
					.ItemListingReadRepo.getAll,
			).mockResolvedValue(mockListings);

			// Mock first call to succeed, second to fail
			vi.mocked(mockSearchService.indexDocument)
				.mockResolvedValueOnce(undefined)
				.mockRejectedValueOnce(new Error('Index error'));

			// Spy on console.error
			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

			const result = await service.bulkIndexListings();

			expect(result.successCount).toBe(1);
			expect(result.totalCount).toBe(2);
			expect(result.message).toBe('Successfully indexed 1/2 listings');
			expect(consoleErrorSpy).toHaveBeenCalled();

			consoleErrorSpy.mockRestore();
		});

		it('should handle non-Error exceptions during indexing', async () => {
			const mockListings = [
				{
					id: 'listing-1',
					title: 'Camera',
					props: { id: 'listing-1', title: 'Camera' },
				},
			];

			vi.mocked(
				mockDataSources.readonlyDataSource.Listing.ItemListing
					.ItemListingReadRepo.getAll,
			).mockResolvedValue(mockListings);

			// Mock indexDocument to throw a non-Error object
			vi.mocked(mockSearchService.indexDocument).mockRejectedValue(
				'String error message',
			);

			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

			const result = await service.bulkIndexListings();

			expect(result.successCount).toBe(0);
			expect(result.totalCount).toBe(1);

			consoleErrorSpy.mockRestore();
		});

		it('should create index before bulk indexing', async () => {
			vi.mocked(
				mockDataSources.readonlyDataSource.Listing.ItemListing
					.ItemListingReadRepo.getAll,
			).mockResolvedValue([
				{
					id: 'listing-1',
					props: { id: 'listing-1' },
				},
			]);

			await service.bulkIndexListings();

			expect(mockSearchService.createIndexIfNotExists).toHaveBeenCalled();
		});

		it('should log error stack traces when available', async () => {
			const mockListings = [
				{
					id: 'listing-1',
					props: { id: 'listing-1' },
				},
			];

			vi.mocked(
				mockDataSources.readonlyDataSource.Listing.ItemListing
					.ItemListingReadRepo.getAll,
			).mockResolvedValue(mockListings);

			const errorWithStack = new Error('Test error');
			errorWithStack.stack = 'Error stack trace here';

			vi.mocked(mockSearchService.indexDocument).mockRejectedValue(
				errorWithStack,
			);

			const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

			await service.bulkIndexListings();

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				expect.stringContaining('[BulkIndex] Stack trace:'),
				expect.any(String),
			);

			consoleErrorSpy.mockRestore();
		});
	});

	describe('edge cases', () => {
		it('should handle null options', async () => {
			const input: ListingSearchInput = {
				searchString: '*',
				options: null,
			};

			await service.searchListings(input);

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'listings',
				'*',
				expect.objectContaining({
					top: 50,
					skip: 0,
				}),
			);
		});

		it('should handle null filter', async () => {
			const input: ListingSearchInput = {
				searchString: '*',
				options: {
					filter: null,
				},
			};

			await service.searchListings(input);

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'listings',
				'*',
				expect.not.objectContaining({
					filter: expect.anything(),
				}),
			);
		});

		it('should handle empty arrays in filters', async () => {
			const input: ListingSearchInput = {
				searchString: '*',
				options: {
					filter: {
						category: [],
						state: [],
						sharerId: [],
					},
				},
			};

			await service.searchListings(input);

			// Empty arrays produce an empty filter string
			const call = vi.mocked(mockSearchService.search).mock.calls[0];
			expect(call?.[2]?.filter).toBe('');
		});

		it('should handle undefined top and skip values', async () => {
			const input: ListingSearchInput = {
				searchString: '*',
				options: {
					top: null,
					skip: null,
				},
			};

			await service.searchListings(input);

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'listings',
				'*',
				expect.objectContaining({
					top: 50,
					skip: 0,
				}),
			);
		});
	});
});
