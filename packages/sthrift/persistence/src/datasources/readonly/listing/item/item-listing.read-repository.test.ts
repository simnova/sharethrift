import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Domain } from '@sthrift/domain';
import type { ModelsContext } from '../../../../models-context.ts';
import { ItemListingReadRepositoryImpl } from './item-listing.read-repository.ts';
import type { Models } from '@sthrift/data-sources-mongoose-models';

describe('ItemListingReadRepository', () => {
	let repository: ItemListingReadRepositoryImpl;
	let mockModelsContext: ModelsContext;
	let mockPassport: Domain.Passport;
	let mockModel: Models.Listing.ItemListingModelType;

	const mockListingDoc = {
		_id: 'listing-1',
		title: 'Test Listing',
		description: 'Test description',
		category: 'Electronics',
		location: 'Delhi',
		sharingPeriodStart: new Date('2025-10-06'),
		sharingPeriodEnd: new Date('2025-11-06'),
		state: 'Published',
		sharer: 'user-1',
		images: [],
		reports: 0,
		sharingHistory: [],
		createdAt: new Date('2020-01-01T00:00:00Z'),
		updatedAt: new Date('2020-01-02T00:00:00Z'),
		schemaVersion: '1.0.0',
	} as Models.Listing.ItemListing;

	beforeEach(() => {
		mockPassport = {
			listing: {
				forItemListing: vi.fn(() => ({
					determineIf: vi.fn(() => true),
				})),
			},
			user: {
				forPersonalUser: vi.fn(() => ({
					determineIf: vi.fn(() => true),
				})),
			},
			conversation: {
				forConversation: vi.fn(() => ({
					determineIf: vi.fn(() => true),
					})),
			},
		} as unknown as Domain.Passport;

		// Mock the Mongoose model
		mockModel = {
			find: vi.fn(() => ({
				populate: vi.fn(() => ({
					exec: vi.fn(async () => [mockListingDoc]),
				})),
				exec: vi.fn(async () => [mockListingDoc]),
			})),
			findOne: vi.fn(() => ({
				populate: vi.fn(() => ({
					exec: vi.fn(async () => mockListingDoc),
				})),
				exec: vi.fn(async () => mockListingDoc),
			})),
			findById: vi.fn(() => ({
				populate: vi.fn(() => ({
					exec: vi.fn(async () => mockListingDoc),
				})),
				exec: vi.fn(async () => mockListingDoc),
			})),
		} as unknown as Models.Listing.ItemListingModelType;

		mockModelsContext = {
			Listing: {
				ItemListingModel: mockModel,
			},
		} as ModelsContext;

		repository = new ItemListingReadRepositoryImpl(
			mockModelsContext,
			mockPassport,
		);
	});

	describe('getAll', () => {
		it('should return all listings', async () => {
			const results = await repository.getAll();

			expect(Array.isArray(results)).toBe(true);
			expect(results.length).toBeGreaterThan(0);
		});

		it('should return mock listings when no data exists', async () => {
			// Mock empty result
			mockModel.find = vi.fn(() => ({
				exec: vi.fn(async () => []),
			})) as unknown as Models.Listing.ItemListingModelType['find'];

			const results = await repository.getAll();

			// Should fall back to mock data
			expect(Array.isArray(results)).toBe(true);
			expect(results.length).toBeGreaterThan(0);
		});

		it('should accept find options', async () => {
			const options = { limit: 10, skip: 0 };
			await repository.getAll(options);

			expect(mockModel.find).toHaveBeenCalled();
		});
	});

	describe('getById', () => {
		it('should return a listing by ID', async () => {
			const result = await repository.getById('listing-1');

			expect(result).toBeDefined();
			expect(result?.id).toBe('listing-1');
		});

		it('should return null when listing not found', async () => {
			// Mock no result
			mockModel.findOne = vi.fn(() => ({
				exec: vi.fn(async () => null),
			})) as unknown as Models.Listing.ItemListingModelType['findOne'];

			const result = await repository.getById('nonexistent-id');

			expect(result).toBeNull();
		});

		it('should accept find options', async () => {
			const options = { populate: ['sharer'] };
			await repository.getById('listing-1', options);

			expect(mockModel.findOne).toHaveBeenCalled();
		});
	});

	describe('getBySharer', () => {
		it('should return listings for a specific sharer', async () => {
			const results = await repository.getBySharer('user-1');

			expect(Array.isArray(results)).toBe(true);
			expect(results.length).toBeGreaterThan(0);
		});

		it('should return mock listings when no data exists for sharer', async () => {
			// Mock empty result
			mockModel.find = vi.fn(() => ({
				exec: vi.fn(async () => []),
			})) as unknown as Models.Listing.ItemListingModelType['find'];

			const results = await repository.getBySharer('user-1');

			// Should fall back to mock data
			expect(Array.isArray(results)).toBe(true);
			expect(results.length).toBeGreaterThan(0);
		});
	});

	describe('getPaged', () => {
		it('should return paginated results', async () => {
			const result = await repository.getPaged({
				page: 1,
				pageSize: 10,
			});

			expect(result).toHaveProperty('items');
			expect(result).toHaveProperty('total');
			expect(result).toHaveProperty('page');
			expect(result).toHaveProperty('pageSize');
			expect(Array.isArray(result.items)).toBe(true);
		});

		it('should filter by sharer ID', async () => {
			const result = await repository.getPaged({
				page: 1,
				pageSize: 10,
				sharerId: 'user-1',
			});

			expect(result.items).toBeDefined();
			expect(Array.isArray(result.items)).toBe(true);
		});

		it('should filter by search text', async () => {
			const result = await repository.getPaged({
				page: 1,
				pageSize: 10,
				searchText: 'Test',
			});

			expect(result.items).toBeDefined();
			// Filtered items should contain "Test" in title
			for (const item of result.items) {
				expect(item.title.toLowerCase()).toContain('test');
			}
		});

		it('should filter by status', async () => {
			const result = await repository.getPaged({
				page: 1,
				pageSize: 10,
				statusFilters: ['Published'],
			});

			expect(result.items).toBeDefined();
			// Filtered items should have Published status
			for (const item of result.items) {
				expect(item.state).toBe('Published');
			}
		});

		it('should sort results', async () => {
			const result = await repository.getPaged({
				page: 1,
				pageSize: 10,
				sorter: { field: 'createdAt', order: 'descend' },
			});

			expect(result.items).toBeDefined();
			expect(Array.isArray(result.items)).toBe(true);
		});

		it('should handle pagination correctly', async () => {
			const page1 = await repository.getPaged({
				page: 1,
				pageSize: 5,
			});

			expect(page1.page).toBe(1);
			expect(page1.pageSize).toBe(5);
			expect(page1.items.length).toBeLessThanOrEqual(5);
		});
	});
});
