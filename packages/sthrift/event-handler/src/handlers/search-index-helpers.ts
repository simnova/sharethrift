/**
 * Search Index Helpers
 *
 * Shared utilities for search index operations including hash generation
 * and retry logic for reliable index updates.
 */

import * as crypto from 'node:crypto';
import type { CognitiveSearchDomain, SearchIndex } from '@sthrift/domain';

/**
 * Generate a hash for change detection
 * Excludes the updatedAt field from hash calculation to avoid unnecessary updates
 */
export function generateSearchDocumentHash(
	document: Record<string, unknown>,
): string {
	const docCopy = JSON.parse(JSON.stringify(document));
	delete docCopy.updatedAt;

	return crypto
		.createHash('sha256')
		.update(JSON.stringify(docCopy))
		.digest('base64');
}

/**
 * Retry logic for search index operations
 * Implements exponential backoff with a maximum number of attempts
 */
export async function retrySearchIndexOperation<T>(
	operation: () => Promise<T>,
	maxAttempts: number = 3,
	baseDelayMs: number = 1000,
): Promise<T> {
	let lastError: Error;

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			return await operation();
		} catch (error) {
			lastError = error as Error;

			if (attempt === maxAttempts) {
				console.error(
					`Search index operation failed after ${maxAttempts} attempts:`,
					lastError,
				);
				throw lastError;
			}

			const delayMs = baseDelayMs * 2 ** (attempt - 1);
			console.warn(
				`Search index operation failed (attempt ${attempt}/${maxAttempts}), retrying in ${delayMs}ms:`,
				error,
			);

			await new Promise((resolve) => setTimeout(resolve, delayMs));
		}
	}

	throw new Error('Operation failed after all retry attempts');
}

/**
 * Update search index with retry logic and hash-based change detection
 */
export async function updateSearchIndexWithRetry<
	T extends { hash?: string; lastIndexed?: Date },
>(
	searchService: CognitiveSearchDomain,
	indexDefinition: SearchIndex,
	document: Record<string, unknown>,
	entity: T,
	maxAttempts = 3,
): Promise<Date> {
	const newHash = generateSearchDocumentHash(document);

	// Skip update if content hasn't changed
	if (entity.hash === newHash) {
		console.log(
			`Search index update skipped - no changes detected for entity ${entity}`,
		);
		return entity.lastIndexed || new Date();
	}

	console.log(
		`Search index update required - hash changed for entity ${entity}`,
	);

	try {
		const indexedAt = await retrySearchIndexOperation(async () => {
			await searchService.createIndexIfNotExists(indexDefinition);
			await searchService.indexDocument(indexDefinition.name, document);
			return new Date();
		}, maxAttempts);

		// Update entity metadata
		entity.hash = newHash;
		entity.lastIndexed = indexedAt;

		return indexedAt;
	} catch (error) {
		console.error(
			`Failed to update search index after ${maxAttempts} attempts:`,
			error,
		);
		throw error;
	}
}

/**
 * Delete document from search index with retry logic
 */
export async function deleteFromSearchIndexWithRetry(
	searchService: CognitiveSearchDomain,
	indexName: string,
	documentId: string,
	maxAttempts = 3,
): Promise<void> {
	await retrySearchIndexOperation(async () => {
		await searchService.deleteDocument(indexName, {
			id: documentId,
		});
	}, maxAttempts);
}
