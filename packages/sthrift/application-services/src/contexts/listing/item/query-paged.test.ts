import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import { queryPaged } from './query-paged.ts';

describe('ItemListing queryPaged', () => {
	// biome-ignore lint/suspicious/noExplicitAny: Test mock type
	let mockDataSources: any;
	// biome-ignore lint/suspicious/noExplicitAny: Test mock function
	let mockGetPaged: any;

	beforeEach(() => {
		mockGetPaged = vi.fn().mockResolvedValue({
			items: [],
			total: 0,
			page: 1,
			pageSize: 10,
		});

		mockDataSources = {
			readonlyDataSource: {
				Listing: {
					ItemListing: {
						ItemListingReadRepo: {
							getPaged: mockGetPaged,
						},
					},
				},
			},
		} as DataSources;
	});

	it('should query with basic page and pageSize only', async () => {
		const query = queryPaged(mockDataSources);
		const result = await query({
			page: 1,
			pageSize: 20,
		});

		expect(result).toBeDefined();
		expect(mockGetPaged).toHaveBeenCalledWith({
			page: 1,
			pageSize: 20,
		});
	});

	it('should include searchText when provided', async () => {
		const query = queryPaged(mockDataSources);
		await query({
			page: 1,
			pageSize: 10,
			searchText: 'test search',
		});

		expect(mockGetPaged).toHaveBeenCalledWith({
			page: 1,
			pageSize: 10,
			searchText: 'test search',
		});
	});

	it('should include explicit statusFilters when provided', async () => {
		const query = queryPaged(mockDataSources);
		await query({
			page: 1,
			pageSize: 10,
			statusFilters: ['Active', 'Blocked'],
		});

		expect(mockGetPaged).toHaveBeenCalledWith({
			page: 1,
			pageSize: 10,
			statusFilters: ['Active', 'Blocked'],
		});
	});

	it('should include sharerId and not use default statusFilters when sharerId provided', async () => {
		const query = queryPaged(mockDataSources);
		await query({
			page: 1,
			pageSize: 10,
			sharerId: 'sharer-123',
		});

		expect(mockGetPaged).toHaveBeenCalledWith({
			page: 1,
			pageSize: 10,
			sharerId: 'sharer-123',
		});
	});

	it('should include sorter when provided', async () => {
		const query = queryPaged(mockDataSources);
		await query({
			page: 1,
			pageSize: 10,
			sorter: { field: 'createdAt', order: 'descend' },
		});

		expect(mockGetPaged).toHaveBeenCalledWith({
			page: 1,
			pageSize: 10,
			sorter: { field: 'createdAt', order: 'descend' },
		});
	});

	it('should handle all parameters together', async () => {
		const query = queryPaged(mockDataSources);
		await query({
			page: 2,
			pageSize: 25,
			searchText: 'furniture',
			statusFilters: ['Active'],
			sharerId: 'user-456',
			sorter: { field: 'title', order: 'ascend' },
		});

		expect(mockGetPaged).toHaveBeenCalledWith({
			page: 2,
			pageSize: 25,
			searchText: 'furniture',
			statusFilters: ['Active'],
			sharerId: 'user-456',
			sorter: { field: 'title', order: 'ascend' },
		});
	});

	it('should return the result from repository', async () => {
		const expectedResult = {
			items: [
				{ id: 'item-1', title: 'Test Item' },
				{ id: 'item-2', title: 'Another Item' },
			],
			total: 2,
			page: 1,
			pageSize: 10,
		};

		mockGetPaged.mockResolvedValue(expectedResult);

		const query = queryPaged(mockDataSources);
		const result = await query({
			page: 1,
			pageSize: 10,
		});

		expect(result).toEqual(expectedResult);
	});

	it('should use default admin statusFilters when no sharerId and no explicit filters', async () => {
		const query = queryPaged(mockDataSources);
		await query({
			page: 1,
			pageSize: 10,
			isAdmin: true,
		});

		expect(mockGetPaged).toHaveBeenCalledWith({
			page: 1,
			pageSize: 10,
			isAdmin: true,
		});
	});

	it('should not include default statusFilters when sharerId is provided', async () => {
		const query = queryPaged(mockDataSources);
		await query({
			page: 1,
			pageSize: 10,
			sharerId: 'sharer-789',
		});

		const callArgs = mockGetPaged.mock.calls[0][0];
		expect(callArgs.statusFilters).toBeUndefined();
	});
});
