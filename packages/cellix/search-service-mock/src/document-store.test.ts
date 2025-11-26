/**
 * Tests for DocumentStore
 *
 * Tests document storage CRUD operations and index management.
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { DocumentStore } from './document-store';

describe('DocumentStore', () => {
	let store: DocumentStore;

	beforeEach(() => {
		store = new DocumentStore();
	});

	describe('has', () => {
		it('should return false for non-existent index', () => {
			expect(store.has('non-existent')).toBe(false);
		});

		it('should return true for existing index', () => {
			store.create('test-index');
			expect(store.has('test-index')).toBe(true);
		});
	});

	describe('create', () => {
		it('should create a new document store for an index', () => {
			store.create('test-index');
			expect(store.has('test-index')).toBe(true);
		});

		it('should not overwrite existing store when creating with same name', () => {
			store.create('test-index');
			store.set('test-index', 'doc1', { id: 'doc1', title: 'Test' });
			store.create('test-index'); // Should not overwrite
			expect(store.getCount('test-index')).toBe(1);
		});
	});

	describe('getDocs', () => {
		it('should return empty map for non-existent index', () => {
			const docs = store.getDocs('non-existent');
			expect(docs.size).toBe(0);
		});

		it('should return document map for existing index', () => {
			store.create('test-index');
			store.set('test-index', 'doc1', { id: 'doc1' });
			const docs = store.getDocs('test-index');
			expect(docs.size).toBe(1);
			expect(docs.get('doc1')).toEqual({ id: 'doc1' });
		});
	});

	describe('set', () => {
		it('should add a new document', () => {
			store.create('test-index');
			store.set('test-index', 'doc1', { id: 'doc1', title: 'Test' });
			expect(store.get('test-index', 'doc1')).toEqual({
				id: 'doc1',
				title: 'Test',
			});
		});

		it('should update an existing document', () => {
			store.create('test-index');
			store.set('test-index', 'doc1', { id: 'doc1', title: 'Original' });
			store.set('test-index', 'doc1', { id: 'doc1', title: 'Updated' });
			expect(store.get('test-index', 'doc1')).toEqual({
				id: 'doc1',
				title: 'Updated',
			});
		});

		it('should throw error for non-existent index', () => {
			expect(() => {
				store.set('non-existent', 'doc1', { id: 'doc1' });
			}).toThrow('Document store not found for index non-existent');
		});
	});

	describe('get', () => {
		it('should return undefined for non-existent index', () => {
			expect(store.get('non-existent', 'doc1')).toBeUndefined();
		});

		it('should return undefined for non-existent document', () => {
			store.create('test-index');
			expect(store.get('test-index', 'non-existent')).toBeUndefined();
		});

		it('should return document for existing document', () => {
			store.create('test-index');
			const doc = { id: 'doc1', title: 'Test', price: 100 };
			store.set('test-index', 'doc1', doc);
			expect(store.get('test-index', 'doc1')).toEqual(doc);
		});
	});

	describe('delete', () => {
		it('should return false for non-existent index', () => {
			expect(store.delete('non-existent', 'doc1')).toBe(false);
		});

		it('should return false for non-existent document', () => {
			store.create('test-index');
			expect(store.delete('test-index', 'non-existent')).toBe(false);
		});

		it('should delete document and return true', () => {
			store.create('test-index');
			store.set('test-index', 'doc1', { id: 'doc1' });
			expect(store.delete('test-index', 'doc1')).toBe(true);
			expect(store.get('test-index', 'doc1')).toBeUndefined();
		});
	});

	describe('deleteStore', () => {
		it('should delete the document store for an index', () => {
			store.create('test-index');
			store.set('test-index', 'doc1', { id: 'doc1' });
			store.deleteStore('test-index');
			expect(store.has('test-index')).toBe(false);
		});

		it('should do nothing for non-existent index', () => {
			// Should not throw
			store.deleteStore('non-existent');
			expect(store.has('non-existent')).toBe(false);
		});
	});

	describe('getCount', () => {
		it('should return 0 for non-existent index', () => {
			expect(store.getCount('non-existent')).toBe(0);
		});

		it('should return 0 for empty index', () => {
			store.create('test-index');
			expect(store.getCount('test-index')).toBe(0);
		});

		it('should return correct count for index with documents', () => {
			store.create('test-index');
			store.set('test-index', 'doc1', { id: 'doc1' });
			store.set('test-index', 'doc2', { id: 'doc2' });
			store.set('test-index', 'doc3', { id: 'doc3' });
			expect(store.getCount('test-index')).toBe(3);
		});
	});

	describe('getAllCounts', () => {
		it('should return empty object when no indexes exist', () => {
			expect(store.getAllCounts()).toEqual({});
		});

		it('should return counts for all indexes', () => {
			store.create('index1');
			store.create('index2');
			store.set('index1', 'doc1', { id: 'doc1' });
			store.set('index1', 'doc2', { id: 'doc2' });
			store.set('index2', 'doc3', { id: 'doc3' });

			const counts = store.getAllCounts();
			expect(counts).toEqual({
				index1: 2,
				index2: 1,
			});
		});
	});
});
