import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import { Listing } from './index.ts';

describe('Listing Context Factory', () => {
	// biome-ignore lint/suspicious/noExplicitAny: Test mock type
	let mockDataSources: any;

	beforeEach(() => {
		mockDataSources = {
			domainDataSource: {},
			readonlyDataSource: {},
		} as DataSources;
	});

	it('should create Listing context with all services', () => {
		const context = Listing(mockDataSources);

		expect(context).toBeDefined();
		expect(context.ItemListing).toBeDefined();
	});

	it('should have ItemListing service with all required methods', () => {
		const context = Listing(mockDataSources);

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
});
