/**
 * Tests for queryPagedWithSearchFallback
 *
 * Tests the search functionality with fallback to database query
 * when cognitive search is unavailable or fails.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import type { CognitiveSearchDomain } from '@sthrift/domain';
import {
	queryPagedWithSearchFallback,
	type ItemListingQueryPagedWithSearchCommand,
} from './query-paged-with-search.js';

describe('queryPagedWithSearchFallback', () => {
	let mockDataSources: DataSources;
	let mockSearchService: CognitiveSearchDomain;
	let mockDbQueryResult: {
		items: Array<{ id: string; title: string }>;
		total: number;
		page: number;
		pageSize: number;
	};
	let mockSearchResult: {
		results: Array<{ document: { id: string } }>;
		count: number;
	};

	beforeEach(() => {
		// Suppress console output during tests
		vi.spyOn(console, 'log').mockImplementation(() => undefined);
		vi.spyOn(console, 'error').mockImplementation(() => undefined);

		// Setup mock database query result
		mockDbQueryResult = {
			items: [
				{ id: 'listing-1', title: 'Database Listing 1' },
				{ id: 'listing-2', title: 'Database Listing 2' },
			],
			total: 2,
			page: 1,
			pageSize: 10,
		};

		// Setup mock search result
		mockSearchResult = {
			results: [
				{ document: { id: 'listing-1' } },
				{ document: { id: 'listing-2' } },
			],
			count: 2,
		};

		// Setup mock data sources with read repository
		mockDataSources = {
			readonlyDataSource: {
				Listing: {
					ItemListing: {
						ItemListingReadRepo: {
							getById: vi.fn().mockImplementation((id: string) =>
								Promise.resolve({ id, title: `Listing ${id}` }),
							),
							getPaged: vi.fn().mockResolvedValue(mockDbQueryResult),
						},
					},
				},
			},
		} as unknown as DataSources;

		// Setup mock search service
		mockSearchService = {
			createIndexIfNotExists: vi.fn().mockResolvedValue(undefined),
			search: vi.fn().mockResolvedValue(mockSearchResult),
		} as unknown as CognitiveSearchDomain;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('without search service', () => {
		it('should fall back to database query when search service is not provided', async () => {
			const queryFn = queryPagedWithSearchFallback(mockDataSources);

			const command: ItemListingQueryPagedWithSearchCommand = {
				page: 1,
				pageSize: 10,
				searchText: 'test search',
			};

			const result = await queryFn(command);

			expect(result).toEqual(mockDbQueryResult);
			expect(
				mockDataSources.readonlyDataSource.Listing.ItemListing
					.ItemListingReadRepo.getPaged,
			).toHaveBeenCalled();
		});

		it('should fall back to database query when searchText is empty', async () => {
			const queryFn = queryPagedWithSearchFallback(
				mockDataSources,
				mockSearchService,
			);

			const command: ItemListingQueryPagedWithSearchCommand = {
				page: 1,
				pageSize: 10,
				searchText: '',
			};

			const result = await queryFn(command);

			expect(result).toEqual(mockDbQueryResult);
			expect(mockSearchService.search).not.toHaveBeenCalled();
		});

		it('should fall back to database query when searchText is whitespace only', async () => {
			const queryFn = queryPagedWithSearchFallback(
				mockDataSources,
				mockSearchService,
			);

			const command: ItemListingQueryPagedWithSearchCommand = {
				page: 1,
				pageSize: 10,
				searchText: '   ',
			};

			const result = await queryFn(command);

			expect(result).toEqual(mockDbQueryResult);
			expect(mockSearchService.search).not.toHaveBeenCalled();
		});

		it('should fall back to database query when searchText is undefined', async () => {
			const queryFn = queryPagedWithSearchFallback(
				mockDataSources,
				mockSearchService,
			);

			const command: ItemListingQueryPagedWithSearchCommand = {
				page: 1,
				pageSize: 10,
			};

			const result = await queryFn(command);

			expect(result).toEqual(mockDbQueryResult);
			expect(mockSearchService.search).not.toHaveBeenCalled();
		});
	});

	describe('with search service', () => {
		it('should use cognitive search when searchText is provided', async () => {
			const queryFn = queryPagedWithSearchFallback(
				mockDataSources,
				mockSearchService,
			);

			const command: ItemListingQueryPagedWithSearchCommand = {
				page: 1,
				pageSize: 10,
				searchText: 'vintage camera',
			};

			const result = await queryFn(command);

			expect(mockSearchService.createIndexIfNotExists).toHaveBeenCalled();
			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'vintage camera',
				expect.objectContaining({
					top: 10,
					skip: 0,
				}),
			);
			expect(result.items).toHaveLength(2);
			expect(result.total).toBe(2);
		});

		it('should calculate correct skip for pagination', async () => {
			const queryFn = queryPagedWithSearchFallback(
				mockDataSources,
				mockSearchService,
			);

			const command: ItemListingQueryPagedWithSearchCommand = {
				page: 3,
				pageSize: 20,
				searchText: 'test',
			};

			await queryFn(command);

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'test',
				expect.objectContaining({
					top: 20,
					skip: 40, // (3 - 1) * 20
				}),
			);
		});

		it('should apply sorter in search options', async () => {
			const queryFn = queryPagedWithSearchFallback(
				mockDataSources,
				mockSearchService,
			);

			const command: ItemListingQueryPagedWithSearchCommand = {
				page: 1,
				pageSize: 10,
				searchText: 'test',
				sorter: { field: 'title', order: 'ascend' },
			};

			await queryFn(command);

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'test',
				expect.objectContaining({
					orderBy: ['title asc'],
				}),
			);
		});

		it('should apply descending sorter correctly', async () => {
			const queryFn = queryPagedWithSearchFallback(
				mockDataSources,
				mockSearchService,
			);

			const command: ItemListingQueryPagedWithSearchCommand = {
				page: 1,
				pageSize: 10,
				searchText: 'test',
				sorter: { field: 'createdAt', order: 'descend' },
			};

			await queryFn(command);

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'test',
				expect.objectContaining({
					orderBy: ['createdAt desc'],
				}),
			);
		});

		it('should use default orderBy when sorter is not provided', async () => {
			const queryFn = queryPagedWithSearchFallback(
				mockDataSources,
				mockSearchService,
			);

			const command: ItemListingQueryPagedWithSearchCommand = {
				page: 1,
				pageSize: 10,
				searchText: 'test',
			};

			await queryFn(command);

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'test',
				expect.objectContaining({
					orderBy: ['updatedAt desc'],
				}),
			);
		});

		it('should apply sharerId filter', async () => {
			const queryFn = queryPagedWithSearchFallback(
				mockDataSources,
				mockSearchService,
			);

			const command: ItemListingQueryPagedWithSearchCommand = {
				page: 1,
				pageSize: 10,
				searchText: 'test',
				sharerId: 'user-123',
			};

			await queryFn(command);

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'test',
				expect.objectContaining({
					filter: { sharerId: ['user-123'] },
				}),
			);
		});

		it('should apply status filters', async () => {
			const queryFn = queryPagedWithSearchFallback(
				mockDataSources,
				mockSearchService,
			);

			const command: ItemListingQueryPagedWithSearchCommand = {
				page: 1,
				pageSize: 10,
				searchText: 'test',
				statusFilters: ['active', 'pending'],
			};

			await queryFn(command);

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'test',
				expect.objectContaining({
					filter: { state: ['active', 'pending'] },
				}),
			);
		});

		it('should apply both sharerId and status filters', async () => {
			const queryFn = queryPagedWithSearchFallback(
				mockDataSources,
				mockSearchService,
			);

			const command: ItemListingQueryPagedWithSearchCommand = {
				page: 1,
				pageSize: 10,
				searchText: 'test',
				sharerId: 'user-456',
				statusFilters: ['active'],
			};

			await queryFn(command);

			expect(mockSearchService.search).toHaveBeenCalledWith(
				'item-listings',
				'test',
				expect.objectContaining({
					filter: {
						sharerId: ['user-456'],
						state: ['active'],
					},
				}),
			);
		});

		it('should fetch full entities from database using search result IDs', async () => {
			const queryFn = queryPagedWithSearchFallback(
				mockDataSources,
				mockSearchService,
			);

			const command: ItemListingQueryPagedWithSearchCommand = {
				page: 1,
				pageSize: 10,
				searchText: 'test',
			};

			await queryFn(command);

			// Should fetch each ID from the database
			expect(
				mockDataSources.readonlyDataSource.Listing.ItemListing
					.ItemListingReadRepo.getById,
			).toHaveBeenCalledWith('listing-1');
			expect(
				mockDataSources.readonlyDataSource.Listing.ItemListing
					.ItemListingReadRepo.getById,
			).toHaveBeenCalledWith('listing-2');
		});
	});

	describe('error handling and fallback', () => {
		it('should fall back to database query when search fails', async () => {
			mockSearchService.search = vi
				.fn()
				.mockRejectedValue(new Error('Search service unavailable'));

			const queryFn = queryPagedWithSearchFallback(
				mockDataSources,
				mockSearchService,
			);

			const command: ItemListingQueryPagedWithSearchCommand = {
				page: 1,
				pageSize: 10,
				searchText: 'test',
			};

			const result = await queryFn(command);

			expect(result).toEqual(mockDbQueryResult);
			expect(console.error).toHaveBeenCalledWith(
				'Cognitive search failed, falling back to database query:',
				expect.any(Error),
			);
		});

		it('should fall back to database when createIndexIfNotExists fails', async () => {
			mockSearchService.createIndexIfNotExists = vi
				.fn()
				.mockRejectedValue(new Error('Index creation failed'));

			const queryFn = queryPagedWithSearchFallback(
				mockDataSources,
				mockSearchService,
			);

			const command: ItemListingQueryPagedWithSearchCommand = {
				page: 1,
				pageSize: 10,
				searchText: 'test',
			};

			const result = await queryFn(command);

			expect(result).toEqual(mockDbQueryResult);
		});

		it('should throw error when entity not found in database for search result ID', async () => {
			mockDataSources.readonlyDataSource.Listing.ItemListing.ItemListingReadRepo.getById =
				vi.fn().mockResolvedValue(null);

			const queryFn = queryPagedWithSearchFallback(
				mockDataSources,
				mockSearchService,
			);

			const command: ItemListingQueryPagedWithSearchCommand = {
				page: 1,
				pageSize: 10,
				searchText: 'test',
			};

			// This should fall back to database query because an error is thrown
			// inside the try block when entity is not found
			const result = await queryFn(command);
			expect(result).toEqual(mockDbQueryResult);
			expect(console.error).toHaveBeenCalled();
		});

		it('should handle zero search results', async () => {
			mockSearchService.search = vi.fn().mockResolvedValue({
				results: [],
				count: 0,
			});

			const queryFn = queryPagedWithSearchFallback(
				mockDataSources,
				mockSearchService,
			);

			const command: ItemListingQueryPagedWithSearchCommand = {
				page: 1,
				pageSize: 10,
				searchText: 'nonexistent item',
			};

			const result = await queryFn(command);

			expect(result.items).toHaveLength(0);
			expect(result.total).toBe(0);
			expect(result.page).toBe(1);
			expect(result.pageSize).toBe(10);
		});

		it('should handle undefined count in search results', async () => {
			mockSearchService.search = vi.fn().mockResolvedValue({
				results: [{ document: { id: 'listing-1' } }],
				count: undefined,
			});

			const queryFn = queryPagedWithSearchFallback(
				mockDataSources,
				mockSearchService,
			);

			const command: ItemListingQueryPagedWithSearchCommand = {
				page: 1,
				pageSize: 10,
				searchText: 'test',
			};

			const result = await queryFn(command);

			expect(result.total).toBe(0);
		});
	});
});
