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
		await searchService.startup();

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
});
