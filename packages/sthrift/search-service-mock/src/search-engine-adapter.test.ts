/**
 * Tests for SearchEngineAdapter
 *
 * Tests the adapter layer that wraps the Lunr.js search engine.
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { SearchEngineAdapter } from './search-engine-adapter';
import type { SearchField } from './interfaces';

describe('SearchEngineAdapter', () => {
	let adapter: SearchEngineAdapter;

	const testFields: SearchField[] = [
		{ name: 'id', type: 'Edm.String', key: true },
		{ name: 'title', type: 'Edm.String', searchable: true },
		{ name: 'description', type: 'Edm.String', searchable: true },
		{ name: 'price', type: 'Edm.Double', sortable: true, filterable: true },
		{ name: 'category', type: 'Edm.String', filterable: true, facetable: true },
	];

	const testDocuments = [
		{
			id: '1',
			title: 'Mountain Bike',
			description: 'Great for trails',
			price: 500,
			category: 'Sports',
		},
		{
			id: '2',
			title: 'Road Bike',
			description: 'Fast on pavement',
			price: 800,
			category: 'Sports',
		},
		{
			id: '3',
			title: 'Power Drill',
			description: 'Cordless power tool',
			price: 150,
			category: 'Tools',
		},
	];

	beforeEach(() => {
		adapter = new SearchEngineAdapter();
	});

	describe('build', () => {
		it('should build an index from fields and documents', () => {
			adapter.build('test-index', testFields, testDocuments);
			expect(adapter.hasIndex('test-index')).toBe(true);
		});

		it('should allow building multiple indexes', () => {
			adapter.build('index1', testFields, testDocuments);
			adapter.build('index2', testFields, []);
			expect(adapter.hasIndex('index1')).toBe(true);
			expect(adapter.hasIndex('index2')).toBe(true);
		});
	});

	describe('add', () => {
		it('should add a document to an existing index', () => {
			adapter.build('test-index', testFields, []);
			adapter.add('test-index', testDocuments[0]);

			const stats = adapter.getStats('test-index');
			expect(stats?.documentCount).toBe(1);
		});

		it('should add multiple documents', () => {
			adapter.build('test-index', testFields, []);
			adapter.add('test-index', testDocuments[0]);
			adapter.add('test-index', testDocuments[1]);
			adapter.add('test-index', testDocuments[2]);

			const stats = adapter.getStats('test-index');
			expect(stats?.documentCount).toBe(3);
		});
	});

	describe('remove', () => {
		it('should remove a document from an index', () => {
			adapter.build('test-index', testFields, testDocuments);
			adapter.remove('test-index', '1');

			const stats = adapter.getStats('test-index');
			expect(stats?.documentCount).toBe(2);
		});
	});

	describe('search', () => {
		beforeEach(() => {
			adapter.build('test-index', testFields, testDocuments);
		});

		it('should search by text', () => {
			const results = adapter.search('test-index', 'Mountain');
			expect(results.results.length).toBeGreaterThanOrEqual(1);
			expect(results.results[0].document.title).toBe('Mountain Bike');
		});

		it('should return all documents for wildcard search', () => {
			const results = adapter.search('test-index', '*');
			expect(results.results).toHaveLength(3);
		});

		it('should return all documents for empty search', () => {
			const results = adapter.search('test-index', '');
			expect(results.results).toHaveLength(3);
		});

		it('should apply filters', () => {
			const results = adapter.search('test-index', '*', {
				filter: "category eq 'Tools'",
			});
			expect(results.results).toHaveLength(1);
			expect(results.results[0].document.category).toBe('Tools');
		});

		it('should apply pagination', () => {
			const results = adapter.search('test-index', '*', {
				skip: 1,
				top: 1,
			});
			expect(results.results).toHaveLength(1);
		});

		it('should include count in results', () => {
			const results = adapter.search('test-index', '*', {
				includeTotalCount: true,
			});
			expect(results.count).toBe(3);
		});
	});

	describe('getStats', () => {
		it('should return null for non-existent index', () => {
			expect(adapter.getStats('non-existent')).toBeNull();
		});

		it('should return statistics for existing index', () => {
			adapter.build('test-index', testFields, testDocuments);
			const stats = adapter.getStats('test-index');
			expect(stats).not.toBeNull();
			expect(stats?.documentCount).toBe(3);
			expect(stats?.fieldCount).toBe(5);
		});
	});

	describe('getFilterCapabilities', () => {
		it('should return supported filter capabilities', () => {
			const capabilities = adapter.getFilterCapabilities();
			expect(capabilities.operators).toContain('eq');
			expect(capabilities.operators).toContain('ne');
			expect(capabilities.operators).toContain('gt');
			expect(capabilities.operators).toContain('lt');
			expect(capabilities.functions).toContain('contains');
			expect(capabilities.functions).toContain('startswith');
			expect(capabilities.functions).toContain('endswith');
		});

		it('should return examples', () => {
			const capabilities = adapter.getFilterCapabilities();
			expect(capabilities.examples.length).toBeGreaterThan(0);
		});
	});

	describe('isFilterSupported', () => {
		it('should return true for valid filters', () => {
			expect(adapter.isFilterSupported("category eq 'Sports'")).toBe(true);
			expect(adapter.isFilterSupported('price gt 100')).toBe(true);
		});

		it('should return true for empty filter', () => {
			expect(adapter.isFilterSupported('')).toBe(true);
		});

		it('should return false for invalid filters', () => {
			expect(adapter.isFilterSupported('invalid query')).toBe(false);
		});
	});

	describe('hasIndex', () => {
		it('should return false for non-existent index', () => {
			expect(adapter.hasIndex('non-existent')).toBe(false);
		});

		it('should return true for existing index', () => {
			adapter.build('test-index', testFields, []);
			expect(adapter.hasIndex('test-index')).toBe(true);
		});
	});
});
