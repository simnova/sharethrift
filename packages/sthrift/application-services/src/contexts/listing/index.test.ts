import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import type { CognitiveSearchDomain } from '@sthrift/domain';
import { Listing } from './index.ts';

describe('Listing Context Factory', () => {
	// biome-ignore lint/suspicious/noExplicitAny: Test mock type
	let mockDataSources: any;
	let mockSearchService: CognitiveSearchDomain;

	beforeEach(() => {
		mockDataSources = {
			domainDataSource: {},
			readonlyDataSource: {},
		} as DataSources;

		mockSearchService = {
			search: vi.fn(),
			indexDocument: vi.fn(),
			deleteDocument: vi.fn(),
			createIndexIfNotExists: vi.fn(),
		} as unknown as CognitiveSearchDomain;
	});

	it('should create Listing context with all services', () => {
		const context = Listing(mockDataSources, mockSearchService);

		expect(context).toBeDefined();
		expect(context.ItemListing).toBeDefined();
		expect(context.ListingSearch).toBeDefined();
	});

	it('should have ItemListing service with all required methods', () => {
		const context = Listing(mockDataSources, mockSearchService);

		expect(context.ItemListing.create).toBeDefined();
		expect(context.ItemListing.update).toBeDefined();
		expect(context.ItemListing.deleteListings).toBeDefined();
		expect(context.ItemListing.cancel).toBeDefined();
		expect(context.ItemListing.unblock).toBeDefined();
		expect(context.ItemListing.queryById).toBeDefined();
		expect(context.ItemListing.queryBySharer).toBeDefined();
		expect(context.ItemListing.queryAll).toBeDefined();
		expect(context.ItemListing.queryPaged).toBeDefined();
	});

	it('should throw error when searchService is not provided', () => {
		expect(() => Listing(mockDataSources)).toThrow(
			'searchService is required for Listing context',
		);
	});
});
