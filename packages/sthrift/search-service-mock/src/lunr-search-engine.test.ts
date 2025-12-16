/**
 * Tests for LunrSearchEngine
 *
 * Tests full-text search with Lunr.js including relevance scoring,
 * field boosting, facets, sorting, pagination, and advanced filtering.
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { LunrSearchEngine } from './lunr-search-engine';
import type { SearchField } from './interfaces';

describe('LunrSearchEngine', () => {
	let engine: LunrSearchEngine;

	const testFields: SearchField[] = [
		{ name: 'id', type: 'Edm.String', key: true },
		{ name: 'title', type: 'Edm.String', searchable: true },
		{ name: 'description', type: 'Edm.String', searchable: true },
		{ name: 'price', type: 'Edm.Double', sortable: true, filterable: true },
		{ name: 'category', type: 'Edm.String', filterable: true, facetable: true },
		{ name: 'brand', type: 'Edm.String', filterable: true, facetable: true },
	];

	const testDocuments = [
		{
			id: '1',
			title: 'Mountain Bike',
			description: 'Great for trails and off-road',
			price: 500,
			category: 'Sports',
			brand: 'Trek',
		},
		{
			id: '2',
			title: 'Road Bike',
			description: 'Fast on pavement and racing',
			price: 800,
			category: 'Sports',
			brand: 'Giant',
		},
		{
			id: '3',
			title: 'Power Drill',
			description: 'Cordless power tool',
			price: 150,
			category: 'Tools',
			brand: 'DeWalt',
		},
		{
			id: '4',
			title: 'Electric Scooter',
			description: 'Eco-friendly transportation',
			price: 600,
			category: 'Sports',
			brand: 'Razor',
		},
		{
			id: '5',
			title: 'Hammer',
			description: 'Basic hand tool',
			price: 25,
			category: 'Tools',
			brand: 'Stanley',
		},
	];

	beforeEach(() => {
		engine = new LunrSearchEngine();
	});

	describe('buildIndex', () => {
		it('should build an index from documents', () => {
			engine.buildIndex('test-index', testFields, testDocuments);
			expect(engine.hasIndex('test-index')).toBe(true);
		});

		it('should store correct document count', () => {
			engine.buildIndex('test-index', testFields, testDocuments);
			const stats = engine.getIndexStats('test-index');
			expect(stats?.documentCount).toBe(5);
		});

		it('should store correct field count', () => {
			engine.buildIndex('test-index', testFields, testDocuments);
			const stats = engine.getIndexStats('test-index');
			expect(stats?.fieldCount).toBe(6);
		});

		it('should handle empty document array', () => {
			engine.buildIndex('empty-index', testFields, []);
			expect(engine.hasIndex('empty-index')).toBe(true);
			const stats = engine.getIndexStats('empty-index');
			expect(stats?.documentCount).toBe(0);
		});
	});

	describe('rebuildIndex', () => {
		it('should rebuild index with updated documents', () => {
			engine.buildIndex('test-index', testFields, testDocuments);
			engine.addDocument('test-index', {
				id: '6',
				title: 'New Item',
				description: 'Test',
				price: 100,
				category: 'Other',
				brand: 'Generic',
			});

			const stats = engine.getIndexStats('test-index');
			expect(stats?.documentCount).toBe(6);
		});

		it('should warn for non-existent index', () => {
			// Should not throw, just warn
			engine.rebuildIndex('non-existent');
			expect(engine.hasIndex('non-existent')).toBe(false);
		});
	});

	describe('addDocument', () => {
		it('should add a document to the index', () => {
			engine.buildIndex('test-index', testFields, []);
			engine.addDocument('test-index', testDocuments[0]);

			const stats = engine.getIndexStats('test-index');
			expect(stats?.documentCount).toBe(1);
		});

		it('should make document searchable after adding', () => {
			engine.buildIndex('test-index', testFields, []);
			engine.addDocument('test-index', testDocuments[0]);

			const results = engine.search('test-index', 'Mountain');
			expect(results.results.length).toBeGreaterThanOrEqual(1);
		});

		it('should warn for non-existent index', () => {
			// Should not throw, just warn
			engine.addDocument('non-existent', testDocuments[0]);
		});

		it('should warn for document without id', () => {
			engine.buildIndex('test-index', testFields, []);
			// Should not throw, just warn
			engine.addDocument('test-index', {
				title: 'No ID',
				description: 'Missing id field',
			});
		});
	});

	describe('removeDocument', () => {
		it('should remove a document from the index', () => {
			engine.buildIndex('test-index', testFields, testDocuments);
			engine.removeDocument('test-index', '1');

			const stats = engine.getIndexStats('test-index');
			expect(stats?.documentCount).toBe(4);
		});

		it('should make document unsearchable after removal', () => {
			engine.buildIndex('test-index', testFields, testDocuments);
			engine.removeDocument('test-index', '1');

			const results = engine.search('test-index', 'Mountain');
			expect(results.results).toHaveLength(0);
		});

		it('should warn for non-existent index', () => {
			// Should not throw, just warn
			engine.removeDocument('non-existent', '1');
		});
	});

	describe('search', () => {
		beforeEach(() => {
			engine.buildIndex('test-index', testFields, testDocuments);
		});

		it('should find documents by keyword', () => {
			const results = engine.search('test-index', 'Bike');
			expect(results.results.length).toBeGreaterThanOrEqual(2);
		});

		it('should return relevance scores', () => {
			const results = engine.search('test-index', 'Bike');
			expect(results.results[0].score).toBeGreaterThan(0);
		});

		it('should return all documents for wildcard search', () => {
			const results = engine.search('test-index', '*');
			expect(results.results).toHaveLength(5);
		});

		it('should return all documents for empty search', () => {
			const results = engine.search('test-index', '');
			expect(results.results).toHaveLength(5);
		});

		it('should handle partial word matches with wildcards', () => {
			const results = engine.search('test-index', 'Moun*');
			expect(results.results.length).toBeGreaterThanOrEqual(1);
		});

		it('should return empty results for non-existent index', () => {
			const results = engine.search('non-existent', 'test');
			expect(results.results).toHaveLength(0);
			expect(results.count).toBe(0);
		});

		it('should handle malformed queries gracefully', () => {
			// Should return empty results without throwing
			const results = engine.search('test-index', '{{{{malformed');
			expect(results.results).toHaveLength(0);
		});
	});

	describe('search with filters', () => {
		beforeEach(() => {
			engine.buildIndex('test-index', testFields, testDocuments);
		});

		it('should filter by category', () => {
			const results = engine.search('test-index', '*', {
				filter: "category eq 'Tools'",
			});
			expect(results.results).toHaveLength(2);
			expect(
				results.results.every((r) => r.document.category === 'Tools'),
			).toBe(true);
		});

		it('should filter by price comparison', () => {
			const results = engine.search('test-index', '*', {
				filter: 'price gt 500',
			});
			expect(results.results).toHaveLength(2);
			expect(
				results.results.every((r) => (r.document.price as number) > 500),
			).toBe(true);
		});

		it('should combine search and filter', () => {
			const results = engine.search('test-index', 'Bike', {
				filter: 'price gt 600',
			});
			expect(results.results).toHaveLength(1);
			expect(results.results[0].document.title).toBe('Road Bike');
		});
	});

	describe('search with pagination', () => {
		beforeEach(() => {
			engine.buildIndex('test-index', testFields, testDocuments);
		});

		it('should limit results with top', () => {
			const results = engine.search('test-index', '*', {
				top: 2,
			});
			expect(results.results).toHaveLength(2);
		});

		it('should skip results with skip', () => {
			const allResults = engine.search('test-index', '*');
			const skippedResults = engine.search('test-index', '*', {
				skip: 2,
			});

			expect(skippedResults.results).toHaveLength(3);
			// Skipped results should not include first two
			const skippedIds = skippedResults.results.map((r) => r.document.id);
			expect(skippedIds).not.toContain(allResults.results[0].document.id);
			expect(skippedIds).not.toContain(allResults.results[1].document.id);
		});

		it('should combine skip and top', () => {
			const results = engine.search('test-index', '*', {
				skip: 1,
				top: 2,
			});
			expect(results.results).toHaveLength(2);
		});

		it('should include total count', () => {
			const results = engine.search('test-index', '*', {
				top: 2,
				includeTotalCount: true,
			});
			expect(results.count).toBe(5);
		});
	});

	describe('search with sorting', () => {
		beforeEach(() => {
			engine.buildIndex('test-index', testFields, testDocuments);
		});

		it('should sort by price ascending', () => {
			const results = engine.search('test-index', '*', {
				orderBy: ['price asc'],
			});

			const prices = results.results.map((r) => r.document.price as number);
			expect(prices).toEqual([...prices].sort((a, b) => a - b));
		});

		it('should sort by price descending', () => {
			const results = engine.search('test-index', '*', {
				orderBy: ['price desc'],
			});

			const prices = results.results.map((r) => r.document.price as number);
			expect(prices).toEqual([...prices].sort((a, b) => b - a));
		});

		it('should sort by title alphabetically', () => {
			const results = engine.search('test-index', '*', {
				orderBy: ['title asc'],
			});

			const titles = results.results.map((r) => r.document.title as string);
			expect(titles).toEqual([...titles].sort());
		});

		it('should default to relevance sorting for text search', () => {
			const results = engine.search('test-index', 'Bike');
			// First result should have the highest score
			if (results.results.length > 1) {
				expect(results.results[0].score).toBeGreaterThanOrEqual(
					results.results[1].score ?? 0,
				);
			}
		});
	});

	describe('search with facets', () => {
		beforeEach(() => {
			engine.buildIndex('test-index', testFields, testDocuments);
		});

		it('should return facet counts for category', () => {
			const results = engine.search('test-index', '*', {
				facets: ['category'],
			});

			expect(results.facets?.category).toBeDefined();
			const sportsFacet = results.facets?.category?.find(
				(f) => f.value === 'Sports',
			);
			const toolsFacet = results.facets?.category?.find(
				(f) => f.value === 'Tools',
			);
			expect(sportsFacet?.count).toBe(3);
			expect(toolsFacet?.count).toBe(2);
		});

		it('should return facet counts for multiple fields', () => {
			const results = engine.search('test-index', '*', {
				facets: ['category', 'brand'],
			});

			expect(results.facets?.category).toBeDefined();
			expect(results.facets?.brand).toBeDefined();
		});

		it('should sort facets by count descending', () => {
			const results = engine.search('test-index', '*', {
				facets: ['category'],
			});

			const facets = results.facets?.category || [];
			for (let i = 1; i < facets.length; i++) {
				expect(facets[i - 1].count).toBeGreaterThanOrEqual(facets[i].count);
			}
		});
	});

	describe('hasIndex', () => {
		it('should return false for non-existent index', () => {
			expect(engine.hasIndex('non-existent')).toBe(false);
		});

		it('should return true for existing index', () => {
			engine.buildIndex('test-index', testFields, []);
			expect(engine.hasIndex('test-index')).toBe(true);
		});
	});

	describe('getIndexStats', () => {
		it('should return null for non-existent index', () => {
			expect(engine.getIndexStats('non-existent')).toBeNull();
		});

		it('should return stats for existing index', () => {
			engine.buildIndex('test-index', testFields, testDocuments);
			const stats = engine.getIndexStats('test-index');

			expect(stats).not.toBeNull();
			expect(stats?.documentCount).toBe(5);
			expect(stats?.fieldCount).toBe(6);
		});
	});

	describe('getFilterCapabilities', () => {
		it('should return LiQE filter capabilities', () => {
			const capabilities = engine.getFilterCapabilities();

			expect(capabilities.operators).toContain('eq');
			expect(capabilities.operators).toContain('ne');
			expect(capabilities.operators).toContain('gt');
			expect(capabilities.operators).toContain('lt');
			expect(capabilities.functions).toContain('contains');
		});
	});

	describe('isFilterSupported', () => {
		it('should validate supported filters', () => {
			expect(engine.isFilterSupported("category eq 'Sports'")).toBe(true);
			expect(engine.isFilterSupported('price gt 100')).toBe(true);
			expect(engine.isFilterSupported('')).toBe(true);
		});

		it('should reject unsupported filters', () => {
			expect(engine.isFilterSupported('invalid query')).toBe(false);
		});
	});
});
