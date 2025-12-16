/**
 * Tests for IndexManager
 *
 * Tests index lifecycle operations including creation, retrieval, and deletion.
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { IndexManager } from './index-manager';
import type { SearchIndex } from './interfaces';

describe('IndexManager', () => {
	let manager: IndexManager;

	const createTestIndex = (name: string): SearchIndex => ({
		name,
		fields: [
			{ name: 'id', type: 'Edm.String', key: true },
			{ name: 'title', type: 'Edm.String', searchable: true },
			{ name: 'description', type: 'Edm.String', searchable: true },
			{ name: 'price', type: 'Edm.Double', sortable: true, filterable: true },
			{
				name: 'category',
				type: 'Edm.String',
				filterable: true,
				facetable: true,
			},
		],
	});

	beforeEach(() => {
		manager = new IndexManager();
	});

	describe('has', () => {
		it('should return false for non-existent index', () => {
			expect(manager.has('non-existent')).toBe(false);
		});

		it('should return true for existing index', () => {
			manager.create(createTestIndex('test-index'));
			expect(manager.has('test-index')).toBe(true);
		});
	});

	describe('create', () => {
		it('should create a new index', () => {
			const indexDef = createTestIndex('test-index');
			manager.create(indexDef);
			expect(manager.has('test-index')).toBe(true);
		});

		it('should overwrite existing index with same name', () => {
			const indexDef1 = createTestIndex('test-index');
			const indexDef2: SearchIndex = {
				name: 'test-index',
				fields: [{ name: 'id', type: 'Edm.String', key: true }],
			};

			manager.create(indexDef1);
			manager.create(indexDef2);

			const retrieved = manager.get('test-index');
			expect(retrieved?.fields).toHaveLength(1);
		});
	});

	describe('get', () => {
		it('should return undefined for non-existent index', () => {
			expect(manager.get('non-existent')).toBeUndefined();
		});

		it('should return the index definition', () => {
			const indexDef = createTestIndex('test-index');
			manager.create(indexDef);

			const retrieved = manager.get('test-index');
			expect(retrieved).toEqual(indexDef);
		});

		it('should return correct fields for the index', () => {
			const indexDef = createTestIndex('test-index');
			manager.create(indexDef);

			const retrieved = manager.get('test-index');
			expect(retrieved?.fields).toHaveLength(5);
			expect(retrieved?.fields.find((f) => f.name === 'id')?.key).toBe(true);
			expect(
				retrieved?.fields.find((f) => f.name === 'title')?.searchable,
			).toBe(true);
			expect(retrieved?.fields.find((f) => f.name === 'price')?.sortable).toBe(
				true,
			);
		});
	});

	describe('delete', () => {
		it('should delete an existing index', () => {
			manager.create(createTestIndex('test-index'));
			manager.delete('test-index');
			expect(manager.has('test-index')).toBe(false);
		});

		it('should do nothing for non-existent index', () => {
			// Should not throw
			manager.delete('non-existent');
			expect(manager.has('non-existent')).toBe(false);
		});
	});

	describe('listIndexes', () => {
		it('should return empty array when no indexes exist', () => {
			expect(manager.listIndexes()).toEqual([]);
		});

		it('should return all index names', () => {
			manager.create(createTestIndex('index1'));
			manager.create(createTestIndex('index2'));
			manager.create(createTestIndex('index3'));

			const names = manager.listIndexes();
			expect(names).toHaveLength(3);
			expect(names).toContain('index1');
			expect(names).toContain('index2');
			expect(names).toContain('index3');
		});

		it('should not include deleted indexes', () => {
			manager.create(createTestIndex('index1'));
			manager.create(createTestIndex('index2'));
			manager.delete('index1');

			const names = manager.listIndexes();
			expect(names).toEqual(['index2']);
		});
	});

	describe('getAll', () => {
		it('should return empty map when no indexes exist', () => {
			const all = manager.getAll();
			expect(all.size).toBe(0);
		});

		it('should return all index definitions', () => {
			const index1 = createTestIndex('index1');
			const index2 = createTestIndex('index2');
			manager.create(index1);
			manager.create(index2);

			const all = manager.getAll();
			expect(all.size).toBe(2);
			expect(all.get('index1')).toEqual(index1);
			expect(all.get('index2')).toEqual(index2);
		});

		it('should return a copy, not the internal map', () => {
			const index1 = createTestIndex('index1');
			manager.create(index1);

			const all = manager.getAll();
			all.delete('index1');

			// Original should still have the index
			expect(manager.has('index1')).toBe(true);
		});
	});
});
