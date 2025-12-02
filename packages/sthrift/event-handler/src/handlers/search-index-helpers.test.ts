/**
 * Tests for Search Index Helpers
 *
 * Tests the shared utilities for search index operations including
 * hash generation and retry logic.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CognitiveSearchDomain, SearchIndex } from '@sthrift/domain';
import {
	generateSearchDocumentHash,
	retrySearchIndexOperation,
	updateSearchIndexWithRetry,
	deleteFromSearchIndexWithRetry,
} from './search-index-helpers.js';

describe('Search Index Helpers', () => {
	beforeEach(() => {
		vi.spyOn(console, 'log').mockImplementation(() => undefined);
		vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		vi.spyOn(console, 'error').mockImplementation(() => undefined);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('generateSearchDocumentHash', () => {
		it('should generate a consistent hash for the same document', () => {
			const document = {
				id: 'listing-1',
				title: 'Test Listing',
				description: 'A test description',
			};

			const hash1 = generateSearchDocumentHash(document);
			const hash2 = generateSearchDocumentHash(document);

			expect(hash1).toBe(hash2);
		});

		it('should generate different hashes for different documents', () => {
			const document1 = { id: 'listing-1', title: 'Test Listing' };
			const document2 = { id: 'listing-2', title: 'Other Listing' };

			const hash1 = generateSearchDocumentHash(document1);
			const hash2 = generateSearchDocumentHash(document2);

			expect(hash1).not.toBe(hash2);
		});

		it('should exclude volatile fields from hash calculation', () => {
			const baseDoc = { id: 'listing-1', title: 'Test Listing' };
			const docWithUpdatedAt = {
				...baseDoc,
				updatedAt: new Date().toISOString(),
			};
			const docWithLastIndexed = { ...baseDoc, lastIndexed: new Date() };
			const docWithHash = { ...baseDoc, hash: 'some-existing-hash' };

			const baseHash = generateSearchDocumentHash(baseDoc);
			const hashWithUpdatedAt = generateSearchDocumentHash(docWithUpdatedAt);
			const hashWithLastIndexed = generateSearchDocumentHash(docWithLastIndexed);
			const hashWithHash = generateSearchDocumentHash(docWithHash);

			// All should produce the same hash since volatile fields are excluded
			expect(baseHash).toBe(hashWithUpdatedAt);
			expect(baseHash).toBe(hashWithLastIndexed);
			expect(baseHash).toBe(hashWithHash);
		});

		it('should handle nested objects', () => {
			const document = {
				id: 'listing-1',
				metadata: {
					category: 'electronics',
					tags: ['camera', 'vintage'],
				},
			};

			const hash = generateSearchDocumentHash(document);

			expect(hash).toBeDefined();
			expect(typeof hash).toBe('string');
		});

		it('should return base64 encoded hash', () => {
			const document = { id: 'test' };
			const hash = generateSearchDocumentHash(document);

			// Base64 strings should only contain these characters
			const base64Regex = /^[A-Za-z0-9+/=]+$/;
			expect(hash).toMatch(base64Regex);
		});
	});

	describe('retrySearchIndexOperation', () => {
		it('should return result on first successful attempt', async () => {
			const operation = vi.fn().mockResolvedValue('success');

			const result = await retrySearchIndexOperation(operation);

			expect(result).toBe('success');
			expect(operation).toHaveBeenCalledTimes(1);
		});

		it('should retry on failure and succeed on subsequent attempt', async () => {
			const operation = vi
				.fn()
				.mockRejectedValueOnce(new Error('First failure'))
				.mockResolvedValue('success');

			const result = await retrySearchIndexOperation(operation, 3, 10);

			expect(result).toBe('success');
			expect(operation).toHaveBeenCalledTimes(2);
			expect(console.warn).toHaveBeenCalledWith(
				expect.stringContaining('attempt 1/3'),
				expect.any(Error),
			);
		});

		it('should throw after max attempts exceeded', async () => {
			const operation = vi.fn().mockRejectedValue(new Error('Persistent failure'));

			await expect(
				retrySearchIndexOperation(operation, 3, 10),
			).rejects.toThrow('Persistent failure');

			expect(operation).toHaveBeenCalledTimes(3);
			expect(console.error).toHaveBeenCalledWith(
				expect.stringContaining('failed after 3 attempts'),
				expect.any(Error),
			);
		});

		it('should use exponential backoff between retries', async () => {
			vi.useFakeTimers();
			const operation = vi
				.fn()
				.mockRejectedValueOnce(new Error('Failure 1'))
				.mockRejectedValueOnce(new Error('Failure 2'))
				.mockResolvedValue('success');

			const promise = retrySearchIndexOperation(operation, 3, 100);

			// First attempt fails immediately
			await vi.advanceTimersByTimeAsync(0);
			expect(operation).toHaveBeenCalledTimes(1);

			// First retry after 100ms (baseDelay * 2^0)
			await vi.advanceTimersByTimeAsync(100);
			expect(operation).toHaveBeenCalledTimes(2);

			// Second retry after 200ms (baseDelay * 2^1)
			await vi.advanceTimersByTimeAsync(200);
			expect(operation).toHaveBeenCalledTimes(3);

			await promise;
			vi.useRealTimers();
		});

		it('should default to 3 max attempts', async () => {
			const operation = vi.fn().mockRejectedValue(new Error('Always fails'));

			await expect(retrySearchIndexOperation(operation)).rejects.toThrow();

			expect(operation).toHaveBeenCalledTimes(3);
		});
	});

	describe('updateSearchIndexWithRetry', () => {
		let mockSearchService: CognitiveSearchDomain;
		const indexDefinition: SearchIndex = {
			name: 'test-index',
			fields: [{ name: 'id', type: 'Edm.String' as const, key: true }],
		};

		beforeEach(() => {
			mockSearchService = {
				createIndexIfNotExists: vi.fn().mockResolvedValue(undefined),
				indexDocument: vi.fn().mockResolvedValue(undefined),
			} as unknown as CognitiveSearchDomain;
		});

		it('should skip update when hash has not changed', async () => {
			const document = { id: 'listing-1', title: 'Test' };
			const existingHash = generateSearchDocumentHash(document);
			const entity = {
				hash: existingHash,
				lastIndexed: new Date('2024-01-01'),
			};

			const result = await updateSearchIndexWithRetry(
				mockSearchService,
				indexDefinition,
				document,
				entity,
			);

			expect(result).toEqual(new Date('2024-01-01'));
			expect(mockSearchService.createIndexIfNotExists).not.toHaveBeenCalled();
			expect(mockSearchService.indexDocument).not.toHaveBeenCalled();
			expect(console.log).toHaveBeenCalledWith(
				expect.stringContaining('no changes detected'),
			);
		});

		it('should update index when hash has changed', async () => {
			const document = { id: 'listing-1', title: 'Updated Title' };
			const entity = {
				hash: 'old-hash',
				lastIndexed: new Date('2024-01-01'),
			};

			const result = await updateSearchIndexWithRetry(
				mockSearchService,
				indexDefinition,
				document,
				entity,
			);

			expect(mockSearchService.createIndexIfNotExists).toHaveBeenCalledWith(
				indexDefinition,
			);
			expect(mockSearchService.indexDocument).toHaveBeenCalledWith(
				'test-index',
				document,
			);
			expect(entity.hash).toBe(generateSearchDocumentHash(document));
			expect(entity.lastIndexed).toEqual(result);
		});

		it('should update index when entity has no previous hash', async () => {
			const document = { id: 'listing-1', title: 'New Listing' };
			const entity: { hash?: string; lastIndexed?: Date } = {};

			await updateSearchIndexWithRetry(
				mockSearchService,
				indexDefinition,
				document,
				entity,
			);

			expect(mockSearchService.indexDocument).toHaveBeenCalled();
			expect(entity.hash).toBeDefined();
			expect(entity.lastIndexed).toBeDefined();
		});

		it('should return current date when entity has no lastIndexed and hash matches', async () => {
			const document = { id: 'listing-1', title: 'Test' };
			const existingHash = generateSearchDocumentHash(document);
			const entity = { hash: existingHash };

			const result = await updateSearchIndexWithRetry(
				mockSearchService,
				indexDefinition,
				document,
				entity,
			);

			// Should return a new Date since lastIndexed was undefined
			expect(result).toBeInstanceOf(Date);
		});

		it('should retry on failure', async () => {
			const document = { id: 'listing-1', title: 'Test' };
			const entity = { hash: 'old-hash' };

			mockSearchService.indexDocument = vi
				.fn()
				.mockRejectedValueOnce(new Error('Temporary failure'))
				.mockResolvedValue(undefined);

			await updateSearchIndexWithRetry(
				mockSearchService,
				indexDefinition,
				document,
				entity,
				3,
			);

			expect(mockSearchService.indexDocument).toHaveBeenCalledTimes(2);
		});

		it('should throw after max retries exceeded', async () => {
			const document = { id: 'listing-1', title: 'Test' };
			const entity = { hash: 'old-hash' };

			mockSearchService.indexDocument = vi
				.fn()
				.mockRejectedValue(new Error('Persistent failure'));

			await expect(
				updateSearchIndexWithRetry(
					mockSearchService,
					indexDefinition,
					document,
					entity,
					2,
				),
			).rejects.toThrow('Persistent failure');

			expect(console.error).toHaveBeenCalledWith(
				expect.stringContaining('Failed to update search index'),
				expect.any(Error),
			);
		});
	});

	describe('deleteFromSearchIndexWithRetry', () => {
		let mockSearchService: CognitiveSearchDomain;

		beforeEach(() => {
			mockSearchService = {
				deleteDocument: vi.fn().mockResolvedValue(undefined),
			} as unknown as CognitiveSearchDomain;
		});

		it('should delete document from index', async () => {
			await deleteFromSearchIndexWithRetry(
				mockSearchService,
				'test-index',
				'doc-123',
			);

			expect(mockSearchService.deleteDocument).toHaveBeenCalledWith(
				'test-index',
				{ id: 'doc-123' },
			);
		});

		it('should retry on failure', async () => {
			mockSearchService.deleteDocument = vi
				.fn()
				.mockRejectedValueOnce(new Error('Temporary failure'))
				.mockResolvedValue(undefined);

			await deleteFromSearchIndexWithRetry(
				mockSearchService,
				'test-index',
				'doc-123',
				3,
			);

			expect(mockSearchService.deleteDocument).toHaveBeenCalledTimes(2);
		});

		it('should throw after max retries exceeded', async () => {
			mockSearchService.deleteDocument = vi
				.fn()
				.mockRejectedValue(new Error('Delete failed'));

			await expect(
				deleteFromSearchIndexWithRetry(
					mockSearchService,
					'test-index',
					'doc-123',
					2,
				),
			).rejects.toThrow('Delete failed');
		});

		it('should use default max attempts of 3', async () => {
			mockSearchService.deleteDocument = vi
				.fn()
				.mockRejectedValue(new Error('Always fails'));

			await expect(
				deleteFromSearchIndexWithRetry(
					mockSearchService,
					'test-index',
					'doc-123',
				),
			).rejects.toThrow();

			expect(mockSearchService.deleteDocument).toHaveBeenCalledTimes(3);
		});
	});
});
