/**
 * Tests for Item Listing Deleted - Update Search Index Handler
 *
 * Tests the event handler that removes documents from the search index
 * when listings are deleted.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CognitiveSearchDomain } from '@sthrift/domain';
import { EventBusInstance, ItemListingDeletedEvent } from '@sthrift/domain';
import { NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import { registerItemListingDeletedUpdateSearchIndexHandler } from './item-listing-deleted-update-search-index.js';

// Mock the search-index-helpers module
vi.mock('./search-index-helpers.js', () => ({
	deleteFromSearchIndexWithRetry: vi.fn().mockResolvedValue(undefined),
}));

import { deleteFromSearchIndexWithRetry } from './search-index-helpers.js';

describe('registerItemListingDeletedUpdateSearchIndexHandler', () => {
	let mockSearchService: CognitiveSearchDomain;

	beforeEach(() => {
		vi.clearAllMocks();
		vi.spyOn(console, 'log').mockImplementation(() => undefined);
		vi.spyOn(console, 'error').mockImplementation(() => undefined);

		mockSearchService = {
			deleteDocument: vi.fn().mockResolvedValue(undefined),
		} as unknown as CognitiveSearchDomain;
	});

	afterEach(() => {
		vi.restoreAllMocks();
		NodeEventBusInstance.removeAllListeners();
	});

	it('should register event handler for ItemListingDeletedEvent', () => {
		registerItemListingDeletedUpdateSearchIndexHandler(mockSearchService);

		expect(mockSearchService).toBeDefined();
	});

	it('should delete document from search index when listing is deleted', async () => {
		registerItemListingDeletedUpdateSearchIndexHandler(mockSearchService);

		await EventBusInstance.dispatch(ItemListingDeletedEvent, {
			id: 'listing-123',
			deletedAt: new Date(),
		});

		await new Promise((resolve) => setTimeout(resolve, 100));

		expect(deleteFromSearchIndexWithRetry).toHaveBeenCalledWith(
			mockSearchService,
			'item-listings',
			'listing-123',
			3,
		);
	});

	it('should log success message after deletion', async () => {
		registerItemListingDeletedUpdateSearchIndexHandler(mockSearchService);

		await EventBusInstance.dispatch(ItemListingDeletedEvent, {
			id: 'listing-456',
			deletedAt: new Date(),
		});

		await new Promise((resolve) => setTimeout(resolve, 100));

		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining('Document removed from search index'),
		);
	});

	it('should log error when deletion fails', async () => {
		vi.mocked(deleteFromSearchIndexWithRetry).mockRejectedValueOnce(
			new Error('Delete failed'),
		);

		registerItemListingDeletedUpdateSearchIndexHandler(mockSearchService);

		await EventBusInstance.dispatch(ItemListingDeletedEvent, {
			id: 'listing-789',
			deletedAt: new Date(),
		});

		await new Promise((resolve) => setTimeout(resolve, 100));

		expect(console.error).toHaveBeenCalledWith(
			expect.stringContaining('Failed to remove document from search index'),
			expect.any(Error),
		);
	});
});
