import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { DataSources } from '@sthrift/persistence';
import { AppealRequest } from './index.ts';

describe('AppealRequest Context Factory', () => {
	// biome-ignore lint/suspicious/noExplicitAny: Test mock type
	let mockDataSources: any;

	beforeEach(() => {
		mockDataSources = {
			domainDataSource: {},
			readonlyDataSource: {},
		} as DataSources;
	});

	it('should create AppealRequest context with all services', () => {
		const context = AppealRequest(mockDataSources);

		expect(context).toBeDefined();
		expect(context.ListingAppealRequest).toBeDefined();
		expect(context.UserAppealRequest).toBeDefined();
	});

	it('should have ListingAppealRequest with all required methods', () => {
		const context = AppealRequest(mockDataSources);

		expect(context.ListingAppealRequest.create).toBeDefined();
		expect(context.ListingAppealRequest.getAll).toBeDefined();
		expect(context.ListingAppealRequest.getById).toBeDefined();
		expect(context.ListingAppealRequest.updateState).toBeDefined();
	});

	it('should have UserAppealRequest with all required methods', () => {
		const context = AppealRequest(mockDataSources);

		expect(context.UserAppealRequest.create).toBeDefined();
		expect(context.UserAppealRequest.getAll).toBeDefined();
		expect(context.UserAppealRequest.getById).toBeDefined();
		expect(context.UserAppealRequest.updateState).toBeDefined();
	});
});
