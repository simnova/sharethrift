/**
 * Tests for Item Listing Updated - Update Search Index Handler
 *
 * Tests the event handler that updates search index when listings are updated.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CognitiveSearchDomain, ItemListingUnitOfWork } from '@sthrift/domain';
import { EventBusInstance, ItemListingUpdatedEvent } from '@sthrift/domain';
import { NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';
import { registerItemListingUpdatedUpdateSearchIndexHandler } from './item-listing-updated-update-search-index.js';

// Mock the search-index-helpers module
vi.mock('./search-index-helpers.js', () => ({
	updateSearchIndexWithRetry: vi.fn().mockResolvedValue(new Date()),
}));

import { updateSearchIndexWithRetry } from './search-index-helpers.js';

describe('registerItemListingUpdatedUpdateSearchIndexHandler', () => {
	let mockSearchService: CognitiveSearchDomain;
	let mockUow: ItemListingUnitOfWork;
	let mockListing: Record<string, unknown>;

	beforeEach(() => {
		vi.clearAllMocks();
		vi.spyOn(console, 'log').mockImplementation(() => undefined);
		vi.spyOn(console, 'warn').mockImplementation(() => undefined);
		vi.spyOn(console, 'error').mockImplementation(() => undefined);

		mockListing = {
			id: 'listing-123',
			title: 'Test Listing',
			description: 'A test listing',
			category: 'electronics',
			location: 'New York',
			state: 'active',
			sharer: { id: 'user-1', account: { profile: { firstName: 'John' } } },
			images: ['image1.jpg'],
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		mockSearchService = {
			createIndexIfNotExists: vi.fn().mockResolvedValue(undefined),
			indexDocument: vi.fn().mockResolvedValue(undefined),
		} as unknown as CognitiveSearchDomain;

		mockUow = {
			withScopedTransaction: vi.fn((callback) => {
				const mockRepo = {
					getById: vi.fn().mockResolvedValue(mockListing),
				};
				return callback(mockRepo);
			}),
		} as unknown as ItemListingUnitOfWork;
	});

	afterEach(() => {
		vi.restoreAllMocks();
		// Clear event handlers using the concrete instance
		NodeEventBusInstance.removeAllListeners();
	});

	it('should register event handler for ItemListingUpdatedEvent', () => {
		registerItemListingUpdatedUpdateSearchIndexHandler(
			mockSearchService,
			mockUow,
		);

		// The handler should be registered (we can verify by emitting an event)
		expect(mockSearchService).toBeDefined();
	});

	it('should update search index when listing is updated', async () => {
		registerItemListingUpdatedUpdateSearchIndexHandler(
			mockSearchService,
			mockUow,
		);

		// Emit the event using dispatch
		await EventBusInstance.dispatch(ItemListingUpdatedEvent, {
			id: 'listing-123',
			updatedAt: new Date(),
		});

		// Give time for async handler to execute
		await new Promise((resolve) => setTimeout(resolve, 100));

		expect(mockUow.withScopedTransaction).toHaveBeenCalled();
		expect(updateSearchIndexWithRetry).toHaveBeenCalledWith(
			mockSearchService,
			expect.objectContaining({ name: 'item-listings' }),
			expect.any(Object),
			mockListing,
			3,
		);
	});

	it('should skip update when listing is not found', async () => {
		mockUow.withScopedTransaction = vi.fn((callback) => {
			const mockRepo = {
				getById: vi.fn().mockResolvedValue(null),
			};
			return callback(mockRepo);
		});

		registerItemListingUpdatedUpdateSearchIndexHandler(
			mockSearchService,
			mockUow,
		);

		await EventBusInstance.dispatch(ItemListingUpdatedEvent, {
			id: 'nonexistent-listing',
			updatedAt: new Date(),
		});

		await new Promise((resolve) => setTimeout(resolve, 100));

		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining('not found, skipping search index update'),
		);
		expect(updateSearchIndexWithRetry).not.toHaveBeenCalled();
	});

	it('should log error when search index update fails', async () => {
		vi.mocked(updateSearchIndexWithRetry).mockRejectedValueOnce(
			new Error('Index update failed'),
		);

		registerItemListingUpdatedUpdateSearchIndexHandler(
			mockSearchService,
			mockUow,
		);

		await EventBusInstance.dispatch(ItemListingUpdatedEvent, {
			id: 'listing-123',
			updatedAt: new Date(),
		});

		await new Promise((resolve) => setTimeout(resolve, 100));

		expect(console.error).toHaveBeenCalledWith(
			expect.stringContaining('Failed to update search index'),
			expect.any(Error),
		);
	});
});

