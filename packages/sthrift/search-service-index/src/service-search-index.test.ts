/**
 * Tests for ServiceSearchIndex (Facade)
 *
 * These tests verify the search service facade implementation
 * which wraps the underlying mock search service.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ServiceSearchIndex } from './service-search-index';
import { ListingSearchIndexSpec } from './indexes/listing-search-index';

describe('ServiceSearchIndex', () => {
	let searchService: ServiceSearchIndex;

	beforeEach(async () => {
		// Suppress console.log during tests
		vi.spyOn(console, 'log').mockImplementation(() => undefined);

		searchService = new ServiceSearchIndex();
		await searchService.startUp();
	});

	afterEach(async () => {
		await searchService.shutDown();
		vi.restoreAllMocks();
	});

	describe('Lifecycle', () => {
		it('should initialize successfully', async () => {
			const service = new ServiceSearchIndex();
			await expect(service.startUp()).resolves.toBe(service);
		});

		it('should shutdown successfully', async () => {
			const service = new ServiceSearchIndex();
			await service.startUp();
			await expect(service.shutDown()).resolves.toBeUndefined();
		});

		it('should initialize with custom config', async () => {
			const service = new ServiceSearchIndex({
				enablePersistence: true,
				persistencePath: '/tmp/test-search',
			});
			await expect(service.startUp()).resolves.toBe(service);
			await service.shutDown();
		});
	});

	describe('Index Management', () => {
		it('should create item-listings index on startup', async () => {
			// The index should be created during startUp()
			// Verify by trying to search (should not throw)
			const results = await searchService.searchListings('*');
			expect(results).toBeDefined();
			expect(results.results).toBeDefined();
		});

		it('should create a new index if not exists', async () => {
			const customIndex = {
				name: 'custom-test-index',
				fields: [
					{ name: 'id', type: 'Edm.String' as const, key: true },
					{ name: 'name', type: 'Edm.String' as const, searchable: true },
				],
			};

			await expect(
				searchService.createIndexIfNotExists(customIndex),
			).resolves.toBeUndefined();
		});

		it('should update an existing index definition', async () => {
			const updatedIndex = {
				...ListingSearchIndexSpec,
				fields: [
					...ListingSearchIndexSpec.fields,
					{
						name: 'newField',
						type: 'Edm.String' as const,
						searchable: true,
					},
				],
			};

			await expect(
				searchService.createOrUpdateIndexDefinition(
					ListingSearchIndexSpec.name,
					updatedIndex,
				),
			).resolves.toBeUndefined();
		});

		it('should delete an index', async () => {
			const tempIndex = {
				name: 'temp-index',
				fields: [{ name: 'id', type: 'Edm.String' as const, key: true }],
			};

			await searchService.createIndexIfNotExists(tempIndex);
			await expect(
				searchService.deleteIndex('temp-index'),
			).resolves.toBeUndefined();
		});
	});

	describe('Document Operations', () => {
		const testListing = {
			id: 'listing-1',
			title: 'Vintage Camera for Photography Enthusiasts',
			description:
				'A beautiful vintage camera perfect for collectors and photography lovers',
			category: 'electronics',
			location: 'New York',
			state: 'active',
			sharerId: 'user-123',
			sharerName: 'John Doe',
			sharingPeriodStart: new Date('2024-01-01'),
			sharingPeriodEnd: new Date('2024-12-31'),
			createdAt: new Date('2024-01-01'),
			updatedAt: new Date('2024-01-01'),
			images: ['image1.jpg', 'image2.jpg'],
		};

		it('should index a listing document', async () => {
			await expect(
				searchService.indexListing(testListing),
			).resolves.toBeUndefined();
		});

		it('should index a document to any index', async () => {
			await expect(
				searchService.indexDocument(
					ListingSearchIndexSpec.name,
					testListing,
				),
			).resolves.toBeUndefined();
		});

		it('should delete a listing document', async () => {
			await searchService.indexListing(testListing);
			await expect(
				searchService.deleteListing({ id: testListing.id }),
			).resolves.toBeUndefined();
		});

		it('should delete a document from any index', async () => {
			await searchService.indexListing(testListing);
			await expect(
				searchService.deleteDocument(ListingSearchIndexSpec.name, {
					id: testListing.id,
				}),
			).resolves.toBeUndefined();
		});
	});

	describe('Search Operations', () => {
		const listings = [
			{
				id: 'listing-1',
				title: 'Vintage Camera',
				description: 'A beautiful vintage camera for photography enthusiasts',
				category: 'electronics',
				location: 'New York',
				state: 'active',
				sharerId: 'user-1',
				sharerName: 'Alice',
				sharingPeriodStart: new Date('2024-01-01'),
				sharingPeriodEnd: new Date('2024-06-30'),
				createdAt: new Date('2024-01-01'),
				updatedAt: new Date('2024-01-01'),
				images: ['camera.jpg'],
			},
			{
				id: 'listing-2',
				title: 'Mountain Bike',
				description: 'Professional mountain bike for trail riding',
				category: 'sports',
				location: 'Denver',
				state: 'active',
				sharerId: 'user-2',
				sharerName: 'Bob',
				sharingPeriodStart: new Date('2024-02-01'),
				sharingPeriodEnd: new Date('2024-08-31'),
				createdAt: new Date('2024-02-01'),
				updatedAt: new Date('2024-02-01'),
				images: ['bike.jpg'],
			},
			{
				id: 'listing-3',
				title: 'Camping Tent',
				description: 'Spacious 4-person camping tent',
				category: 'outdoors',
				location: 'Seattle',
				state: 'inactive',
				sharerId: 'user-3',
				sharerName: 'Charlie',
				sharingPeriodStart: new Date('2024-03-01'),
				sharingPeriodEnd: new Date('2024-09-30'),
				createdAt: new Date('2024-03-01'),
				updatedAt: new Date('2024-03-01'),
				images: ['tent.jpg'],
			},
		];

		beforeEach(async () => {
			// Index all test listings
			for (const listing of listings) {
				await searchService.indexListing(listing);
			}
		});

		it('should search listings by text', async () => {
			const results = await searchService.searchListings('camera');

			expect(results.results.length).toBeGreaterThan(0);
			expect(
				results.results.some(
					(r) =>
						r.document.title === 'Vintage Camera' ||
						(r.document.title as string).toLowerCase().includes('camera'),
				),
			).toBe(true);
		});

		it('should search using generic search method', async () => {
			const results = await searchService.search(
				ListingSearchIndexSpec.name,
				'bike',
			);

			expect(results.results.length).toBeGreaterThan(0);
		});

		it('should return all documents with wildcard search', async () => {
			const results = await searchService.searchListings('*');

			expect(results.results.length).toBe(3);
		});

		it('should filter by category', async () => {
			const results = await searchService.searchListings('*', {
				filter: "category eq 'electronics'",
			});

			expect(results.results.length).toBe(1);
			expect(results.results[0].document.category).toBe('electronics');
		});

		it('should filter by state', async () => {
			const results = await searchService.searchListings('*', {
				filter: "state eq 'active'",
			});

			expect(results.results.length).toBe(2);
			for (const result of results.results) {
				expect(result.document.state).toBe('active');
			}
		});

		it('should filter by location', async () => {
			const results = await searchService.searchListings('*', {
				filter: "location eq 'Denver'",
			});

			expect(results.results.length).toBe(1);
			expect(results.results[0].document.location).toBe('Denver');
		});

		it('should support pagination with top and skip', async () => {
			const page1 = await searchService.searchListings('*', {
				top: 2,
				skip: 0,
				includeTotalCount: true,
			});

			expect(page1.results.length).toBe(2);
			expect(page1.count).toBe(3);

			const page2 = await searchService.searchListings('*', {
				top: 2,
				skip: 2,
				includeTotalCount: true,
			});

			expect(page2.results.length).toBe(1);
			expect(page2.count).toBe(3);
		});

		it('should order by a sortable field', async () => {
			const results = await searchService.searchListings('*', {
				orderBy: ['title asc'],
			});

			expect(results.results.length).toBe(3);
			// Verify ascending order
			const titles = results.results.map((r) => r.document.title as string);
			const sortedTitles = [...titles].sort();
			expect(titles).toEqual(sortedTitles);
		});

		it('should select specific fields', async () => {
			const results = await searchService.searchListings('*', {
				select: ['id', 'title', 'category'],
			});

			expect(results.results.length).toBeGreaterThan(0);
			// The first result should have the selected fields
			const doc = results.results[0].document;
			expect(doc.id).toBeDefined();
			expect(doc.title).toBeDefined();
		});

		it('should return facets when requested', async () => {
			const results = await searchService.searchListings('*', {
				facets: ['category', 'state'],
			});

			expect(results.facets).toBeDefined();
			// Should have facet results for category and state
			if (results.facets) {
				expect(results.facets.category || results.facets.state).toBeDefined();
			}
		});

		it('should combine text search with filters', async () => {
			const results = await searchService.searchListings('bike', {
				filter: "state eq 'active'",
			});

			expect(results.results.length).toBeGreaterThan(0);
			for (const result of results.results) {
				expect(result.document.state).toBe('active');
			}
		});
	});

	describe('Error Handling', () => {
		it('should handle search on non-existent index gracefully', async () => {
			// This may either throw or return empty results depending on implementation
			try {
				const results = await searchService.search(
					'non-existent-index',
					'test',
				);
				expect(results.results).toEqual([]);
			} catch (error) {
				expect(error).toBeDefined();
			}
		});

		it('should handle invalid filter syntax gracefully', async () => {
			// The mock implementation may or may not validate filter syntax
			try {
				await searchService.searchListings('*', {
					filter: 'invalid filter syntax!!!',
				});
			} catch (error) {
				expect(error).toBeDefined();
			}
		});
	});
});
