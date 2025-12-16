/**
 * Tests for InMemoryCognitiveSearch
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryCognitiveSearch } from './in-memory-search';
import type { SearchIndex } from './interfaces';

describe('InMemoryCognitiveSearch', () => {
	let searchService: InMemoryCognitiveSearch;
	let testIndex: SearchIndex;

	beforeEach(async () => {
		searchService = new InMemoryCognitiveSearch();
		await searchService.startUp();

		testIndex = {
			name: 'test-index',
			fields: [
				{ name: 'id', type: 'Edm.String', key: true },
				{ name: 'title', type: 'Edm.String', searchable: true },
				{
					name: 'category',
					type: 'Edm.String',
					filterable: true,
					facetable: true,
				},
			],
		};
	});

	it('should create index successfully', async () => {
		await searchService.createIndexIfNotExists(testIndex);

		const debugInfo = searchService.getDebugInfo();
		expect(debugInfo.indexes).toContain('test-index');
		expect(debugInfo.documentCounts['test-index']).toBe(0);
	});

	it('should index document successfully', async () => {
		await searchService.createIndexIfNotExists(testIndex);

		const document = {
			id: 'doc1',
			title: 'Test Document',
			category: 'test',
		};

		await searchService.indexDocument('test-index', document);

		const debugInfo = searchService.getDebugInfo();
		expect(debugInfo.documentCounts['test-index']).toBe(1);
	});

	it('should search documents by text', async () => {
		await searchService.createIndexIfNotExists(testIndex);

		await searchService.indexDocument('test-index', {
			id: 'doc1',
			title: 'Test Document',
			category: 'test',
		});

		await searchService.indexDocument('test-index', {
			id: 'doc2',
			title: 'Another Document',
			category: 'other',
		});

		const results = await searchService.search('test-index', 'Test');

		expect(results.results).toHaveLength(1);
		expect(results.results[0].document.title).toBe('Test Document');
	});

	it('should filter documents', async () => {
		await searchService.createIndexIfNotExists(testIndex);

		await searchService.indexDocument('test-index', {
			id: 'doc1',
			title: 'Test Document',
			category: 'test',
		});

		await searchService.indexDocument('test-index', {
			id: 'doc2',
			title: 'Another Document',
			category: 'other',
		});

		const results = await searchService.search('test-index', '*', {
			filter: "category eq 'test'",
		});

		expect(results.results).toHaveLength(1);
		expect(results.results[0].document.category).toBe('test');
	});

	it('should delete document successfully', async () => {
		await searchService.createIndexIfNotExists(testIndex);

		const document = {
			id: 'doc1',
			title: 'Test Document',
			category: 'test',
		};

		await searchService.indexDocument('test-index', document);

		let debugInfo = searchService.getDebugInfo();
		expect(debugInfo.documentCounts['test-index']).toBe(1);

		await searchService.deleteDocument('test-index', document);

		debugInfo = searchService.getDebugInfo();
		expect(debugInfo.documentCounts['test-index']).toBe(0);
	});

	it('should handle pagination', async () => {
		await searchService.createIndexIfNotExists(testIndex);

		// Index multiple documents
		for (let i = 1; i <= 5; i++) {
			await searchService.indexDocument('test-index', {
				id: `doc${i}`,
				title: `Document ${i}`,
				category: 'test',
			});
		}

		const results = await searchService.search('test-index', '*', {
			top: 2,
			skip: 1,
			includeTotalCount: true,
		});

		expect(results.results).toHaveLength(2);
		expect(results.count).toBe(5);
	});

	it('should not create duplicate index', async () => {
		await searchService.createIndexIfNotExists(testIndex);
		await searchService.createIndexIfNotExists(testIndex);

		const debugInfo = searchService.getDebugInfo();
		expect(debugInfo.indexes).toContain('test-index');
	});

	it('should handle shutDown correctly', async () => {
		await searchService.shutDown();
		await expect(searchService.startUp()).resolves.toBe(searchService);
	});

	it('should return same instance when startUp called multiple times', async () => {
		const result1 = await searchService.startUp();
		const result2 = await searchService.startUp();
		expect(result1).toBe(result2);
		expect(result1).toBe(searchService);
	});

	it('should handle search on non-existent index', async () => {
		const results = await searchService.search('non-existent', 'test');
		expect(results.results).toHaveLength(0);
		expect(results.count).toBe(0);
		expect(results.facets).toEqual({});
	});

	it('should reject indexing document to non-existent index', async () => {
		const document = { id: 'doc1', title: 'Test' };
		await expect(
			searchService.indexDocument('non-existent', document),
		).rejects.toThrow('Index non-existent does not exist');
	});

	it('should reject indexing document without id', async () => {
		await searchService.createIndexIfNotExists(testIndex);
		const document = { title: 'Test' };
		await expect(
			searchService.indexDocument('test-index', document),
		).rejects.toThrow('Document must have an id field');
	});

	it('should reject deleting document from non-existent index', async () => {
		const document = { id: 'doc1', title: 'Test' };
		await expect(
			searchService.deleteDocument('non-existent', document),
		).rejects.toThrow('Index non-existent does not exist');
	});

	it('should reject deleting document without id', async () => {
		await searchService.createIndexIfNotExists(testIndex);
		const document = { title: 'Test' };
		await expect(
			searchService.deleteDocument('test-index', document),
		).rejects.toThrow('Document must have an id field');
	});

	it('should create or update index definition', async () => {
		await searchService.createOrUpdateIndexDefinition('test-index', testIndex);

		const debugInfo = searchService.getDebugInfo();
		expect(debugInfo.indexes).toContain('test-index');
	});

	it('should update existing index definition', async () => {
		await searchService.createIndexIfNotExists(testIndex);

		// Index a document
		await searchService.indexDocument('test-index', {
			id: 'doc1',
			title: 'Test',
			category: 'test',
		});

		// Update the index definition
		const updatedIndex: SearchIndex = {
			...testIndex,
			fields: [
				...testIndex.fields,
				{
					name: 'description',
					type: 'Edm.String' as const,
					searchable: true,
				},
			],
		};

		await searchService.createOrUpdateIndexDefinition('test-index', updatedIndex);

		const debugInfo = searchService.getDebugInfo();
		expect(debugInfo.indexes).toContain('test-index');
		expect(debugInfo.documentCounts['test-index']).toBe(1);
	});

	it('should delete index successfully', async () => {
		await searchService.createIndexIfNotExists(testIndex);
		await searchService.indexDocument('test-index', {
			id: 'doc1',
			title: 'Test',
			category: 'test',
		});

		await searchService.deleteIndex('test-index');

		const debugInfo = searchService.getDebugInfo();
		expect(debugInfo.indexes).not.toContain('test-index');
	});

	it('should provide filter capabilities info', () => {
		const capabilities = searchService.getFilterCapabilities();
		expect(capabilities).toHaveProperty('operators');
		expect(capabilities).toHaveProperty('functions');
		expect(capabilities).toHaveProperty('examples');
		expect(Array.isArray(capabilities.operators)).toBe(true);
		expect(Array.isArray(capabilities.functions)).toBe(true);
		expect(Array.isArray(capabilities.examples)).toBe(true);
	});

	it('should validate filter support', () => {
		const validFilter = "category eq 'test'";
		const result = searchService.isFilterSupported(validFilter);
		expect(typeof result).toBe('boolean');
	});

	it('should provide debug info with lunr stats', async () => {
		await searchService.createIndexIfNotExists(testIndex);
		await searchService.indexDocument('test-index', {
			id: 'doc1',
			title: 'Test',
			category: 'test',
		});

		const debugInfo = searchService.getDebugInfo();
		expect(debugInfo).toHaveProperty('indexes');
		expect(debugInfo).toHaveProperty('documentCounts');
		expect(debugInfo).toHaveProperty('lunrStats');
		expect(debugInfo).toHaveProperty('filterCapabilities');
		expect(debugInfo.lunrStats['test-index']).toBeTruthy();
		expect(debugInfo.lunrStats['test-index']?.documentCount).toBeGreaterThan(0);
	});
});
